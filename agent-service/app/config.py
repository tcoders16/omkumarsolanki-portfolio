"""Central configuration for the agent-service.

All tunables come from environment variables (see .env.example) so the same
image runs locally (docker-compose) and on Railway/Render without code changes.
"""
from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # --- LLM provider (OpenAI) ---
    openai_api_key: str = ""
    openai_base_url: str = ""
    # Cheap model for routing / case-match / profile QA, strong model for reasoning.
    model_fast: str = "gpt-4o-mini"
    model_smart: str = "gpt-4o"
    model_guardrails: str = "gpt-4o-mini"
    embedding_model: str = "text-embedding-3-small"

    # --- Azure OpenAI (used when these are set; takes priority over plain OpenAI) ---
    # Resource endpoint only, e.g. https://<name>.openai.azure.com (no path).
    azure_openai_endpoint: str = ""
    azure_openai_api_key: str = ""
    azure_openai_api_version: str = "2025-01-01-preview"
    # Single chat deployment used for both fast and smart roles.
    azure_openai_deployment: str = ""
    # Optional embedding deployment; when set, vector RAG uses Azure embeddings.
    azure_openai_embedding_deployment: str = ""

    @property
    def use_azure(self) -> bool:
        return bool(
            self.azure_openai_endpoint
            and self.azure_openai_api_key
            and self.azure_openai_deployment
        )

    # --- Knowledge base location (copied into the image at build) ---
    knowledge_dir: str = "knowledge"          # contains portfolio.md
    meta_file: str = "knowledge/om-meta.json"  # structured metadata
    chroma_dir: str = ".chroma"                # persisted vector store

    # --- Retrieval strategy: vector | vectorless | hybrid ---
    rag_mode: str = "hybrid"
    case_match_threshold: float = 0.45         # below this -> "no direct match"

    # --- Owner identity (used by the appointment & email agents) ---
    owner_name: str = "Omkumar Solanki"
    owner_email: str = "emailtosolankiom@gmail.com"
    owner_timezone: str = "America/Toronto"    # IANA tz for calendar slots

    # --- Email follow-up agent (Resend) ---
    # When resend_api_key is empty the email agent runs in DRAFT-ONLY mode:
    # it composes the message and returns it, but does not send.
    resend_api_key: str = ""
    resend_from: str = "Omkumar Solanki <hello@omkumarsolanki.com>"  # verified sender
    resend_reply_to: str = ""                  # defaults to owner_email when empty

    # --- Appointment agent (Google Calendar) ---
    # Two auth paths, first configured one wins:
    # 1. google_credentials_json — path to a service-account JSON file OR the raw
    #    JSON itself (handy for Azure env vars). Calendar must be shared with the
    #    service account. Unavailable when the org enforces
    #    iam.disableServiceAccountKeyCreation.
    # 2. google_oauth_* — an OAuth client + refresh token acting as Om himself
    #    (same credentials the Next.js /book page uses; no key file needed).
    # Neither -> agent falls back to the booking link instead of real events.
    google_credentials_json: str = ""
    google_oauth_client_id: str = ""
    google_oauth_client_secret: str = ""
    google_oauth_refresh_token: str = ""
    google_calendar_id: str = "primary"        # shared calendar (or "primary" with OAuth)
    appointment_duration_min: int = 30
    appointment_window_days: int = 10          # how far ahead to offer slots
    appointment_hour_start: int = 10           # local working-hours window (24h)
    appointment_hour_end: int = 17

    # --- Guardrails ---
    guardrails_enabled: bool = True
    guardrails_config_dir: str = "app/guardrails/config"

    # --- Service / security ---
    allowed_origins: str = "http://localhost:3000"
    service_api_key: str = ""                  # shared secret with the Next.js proxy

    @property
    def origins(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

    @property
    def portfolio_md_path(self) -> Path:
        return Path(self.knowledge_dir) / "portfolio.md"

    @property
    def meta_path(self) -> Path:
        return Path(self.meta_file)


@lru_cache
def get_settings() -> Settings:
    return Settings()
