"""Shared LangChain LLM factory (OpenAI)."""
from __future__ import annotations

from functools import lru_cache

from langchain_openai import ChatOpenAI

from app.config import get_settings


@lru_cache
def fast_llm(temperature: float = 0.2) -> ChatOpenAI:
    s = get_settings()
    return ChatOpenAI(model=s.model_fast, temperature=temperature, api_key=s.openai_api_key)


@lru_cache
def smart_llm(temperature: float = 0.4) -> ChatOpenAI:
    s = get_settings()
    return ChatOpenAI(model=s.model_smart, temperature=temperature, api_key=s.openai_api_key)
