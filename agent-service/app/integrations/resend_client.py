"""Resend email client — sends the follow-up recap composed by the Email agent.

Uses Resend's REST API directly (no SDK dependency). When ``resend_api_key`` is
unset the client reports ``configured=False`` so the agent stays in draft-only
mode and simply returns the composed message for manual sending.
"""
from __future__ import annotations

import json
import urllib.error
import urllib.request
from dataclasses import dataclass

from app.config import get_settings

_ENDPOINT = "https://api.resend.com/emails"


@dataclass
class SendOutcome:
    sent: bool
    note: str


def is_configured() -> bool:
    return bool(get_settings().resend_api_key)


def send_email(*, to: str, subject: str, html: str, text: str) -> SendOutcome:
    """Send one email via Resend. Never raises — returns a SendOutcome."""
    s = get_settings()
    if not s.resend_api_key:
        return SendOutcome(sent=False, note="Resend API key not set — draft only.")
    if not to:
        return SendOutcome(sent=False, note="No recipient email provided — draft only.")

    payload = {
        "from": s.resend_from,
        "to": [to],
        "reply_to": s.resend_reply_to or s.owner_email,
        "subject": subject,
        "html": html,
        "text": text,
    }
    req = urllib.request.Request(
        _ENDPOINT,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {s.resend_api_key}",
            "Content-Type": "application/json",
            # Cloudflare in front of api.resend.com 403s (error 1010) urllib's
            # default Python-urllib/x.y User-Agent — send a real one.
            "User-Agent": "om-agent-service/1.0 (+https://omkumarsolanki.com)",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            if 200 <= resp.status < 300:
                return SendOutcome(sent=True, note="Sent via Resend.")
            return SendOutcome(sent=False, note=f"Resend returned HTTP {resp.status}.")
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", "ignore")[:200]
        return SendOutcome(sent=False, note=f"Resend error {e.code}: {detail}")
    except Exception as e:  # network, timeout, etc. — degrade to draft.
        return SendOutcome(sent=False, note=f"Resend send failed: {e}")
