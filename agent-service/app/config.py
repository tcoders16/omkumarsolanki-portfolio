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
    # Cheap model for routing / case-match / profile QA, strong model for reasoning.
    model_fast: str = "gpt-4o-mini"
    model_smart: str = "gpt-4o"
    model_guardrails: str = "gpt-4o-mini"
    embedding_model: str = "text-embedding-3-small"

    # --- Knowledge base location (copied into the image at build) ---
    knowledge_dir: str = "knowledge"          # contains portfolio.md
    meta_file: str = "knowledge/om-meta.json"  # structured metadata
    chroma_dir: str = ".chroma"                # persisted vector store

    # --- Retrieval strategy: vector | vectorless | hybrid ---
    rag_mode: str = "hybrid"
    case_match_threshold: float = 0.45         # below this -> "no direct match"

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
