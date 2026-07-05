"""Google Calendar client — powers the Appointment agent.

Two auth paths (first configured wins):

1. Service account — ``google_credentials_json`` is a path to the key file or
   the raw JSON string (convenient as an Azure env var); the target calendar
   (``google_calendar_id``) must be shared with the service account's email
   with "Make changes to events" permission.
2. OAuth user — ``GOOGLE_OAUTH_CLIENT_ID`` / ``GOOGLE_OAUTH_CLIENT_SECRET`` /
   ``GOOGLE_OAUTH_REFRESH_TOKEN`` (the same credentials the Next.js /book page
   uses) act as the calendar owner directly. Use this where org policy blocks
   service-account key creation (iam.disableServiceAccountKeyCreation).

Every function is defensive: if the optional Google libraries or credentials are
missing, ``is_configured()`` returns False and the Appointment agent falls back
to offering the booking link instead of creating a real event.
"""
from __future__ import annotations

import json
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from pathlib import Path

try:  # zoneinfo is stdlib on 3.9+
    from zoneinfo import ZoneInfo
except Exception:  # pragma: no cover
    ZoneInfo = None  # type: ignore

from app.config import get_settings

_SCOPES = ["https://www.googleapis.com/auth/calendar"]


@dataclass
class Slot:
    start: datetime
    end: datetime


@dataclass
class BookOutcome:
    booked: bool
    event_link: str = ""
    note: str = ""
    proposed: list[str] = field(default_factory=list)  # ISO strings, when not booked


def _tz():
    s = get_settings()
    if ZoneInfo is None:
        return None
    try:
        return ZoneInfo(s.owner_timezone)
    except Exception:
        return None


def _credentials():
    """Load Google credentials — service account first, OAuth user second.

    The OAuth path uses the same client id/secret + refresh token the Next.js
    /book page authenticates with, acting directly as the calendar owner, so it
    works where org policy blocks service-account key creation.
    """
    s = get_settings()
    raw = s.google_credentials_json.strip()
    if raw:
        try:
            from google.oauth2 import service_account  # type: ignore

            if raw.startswith("{"):
                info = json.loads(raw)
            else:
                info = json.loads(Path(raw).read_text())
            return service_account.Credentials.from_service_account_info(info, scopes=_SCOPES)
        except Exception:
            pass
    if s.google_oauth_client_id and s.google_oauth_client_secret and s.google_oauth_refresh_token:
        try:
            from google.oauth2.credentials import Credentials  # type: ignore

            return Credentials(
                None,
                refresh_token=s.google_oauth_refresh_token,
                client_id=s.google_oauth_client_id,
                client_secret=s.google_oauth_client_secret,
                token_uri="https://oauth2.googleapis.com/token",
                scopes=_SCOPES,
            )
        except Exception:
            return None
    return None


def _service():
    creds = _credentials()
    if creds is None:
        return None
    try:
        from googleapiclient.discovery import build  # type: ignore

        return build("calendar", "v3", credentials=creds, cache_discovery=False)
    except Exception:
        return None


def is_configured() -> bool:
    return _credentials() is not None


def _candidate_slots(now: datetime) -> list[Slot]:
    """Generate working-hours candidate slots over the configured window."""
    s = get_settings()
    dur = timedelta(minutes=s.appointment_duration_min)
    slots: list[Slot] = []
    # Start from the next whole hour, at least 1h out.
    day = (now + timedelta(hours=1)).replace(minute=0, second=0, microsecond=0)
    for _ in range(s.appointment_window_days):
        if day.weekday() < 5:  # Mon–Fri only
            start = day.replace(hour=s.appointment_hour_start)
            end_of_day = day.replace(hour=s.appointment_hour_end)
            cur = max(start, now + timedelta(hours=1)) if day.date() == now.date() else start
            while cur + dur <= end_of_day:
                slots.append(Slot(cur, cur + dur))
                cur += dur
        day = (day + timedelta(days=1)).replace(hour=s.appointment_hour_start)
    return slots


def propose_slots(limit: int = 3) -> list[Slot]:
    """Return up to ``limit`` free slots, checking the calendar's busy times."""
    tz = _tz()
    now = datetime.now(tz) if tz else datetime.now()
    candidates = _candidate_slots(now)
    svc = _service()
    if svc is None:
        return candidates[:limit]  # no calendar access -> offer working-hours slots

    s = get_settings()
    try:
        window_start = candidates[0].start if candidates else now
        window_end = candidates[-1].end if candidates else now + timedelta(days=1)
        busy = (
            svc.freebusy()
            .query(
                body={
                    "timeMin": window_start.isoformat(),
                    "timeMax": window_end.isoformat(),
                    "items": [{"id": s.google_calendar_id}],
                }
            )
            .execute()
        )
        periods = busy["calendars"][s.google_calendar_id]["busy"]
        busy_ranges = [
            (datetime.fromisoformat(p["start"]), datetime.fromisoformat(p["end"]))
            for p in periods
        ]
    except Exception:
        busy_ranges = []

    free: list[Slot] = []
    for slot in candidates:
        clash = any(slot.start < b_end and slot.end > b_start for b_start, b_end in busy_ranges)
        if not clash:
            free.append(slot)
        if len(free) >= limit:
            break
    return free


def create_event(
    *, start: datetime, end: datetime, attendee_email: str, summary: str, description: str
) -> BookOutcome:
    """Create a calendar event. Never raises — returns a BookOutcome."""
    s = get_settings()
    svc = _service()
    if svc is None:
        return BookOutcome(booked=False, note="Google Calendar not configured.")
    body = {
        "summary": summary,
        "description": description,
        "start": {"dateTime": start.isoformat(), "timeZone": s.owner_timezone},
        "end": {"dateTime": end.isoformat(), "timeZone": s.owner_timezone},
    }
    if attendee_email:
        body["attendees"] = [{"email": attendee_email}, {"email": s.owner_email}]
    try:
        event = (
            svc.events()
            .insert(calendarId=s.google_calendar_id, body=body, sendUpdates="all")
            .execute()
        )
        return BookOutcome(booked=True, event_link=event.get("htmlLink", ""), note="Event created.")
    except Exception as e:
        return BookOutcome(booked=False, note=f"Calendar insert failed: {e}")
