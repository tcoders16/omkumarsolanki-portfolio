"""Shared LangChain LLM factory (OpenAI or Azure OpenAI).

When the Azure OpenAI settings are present (``use_azure``) every role is served
by the configured Azure chat deployment; otherwise we fall back to plain OpenAI.
"""
from __future__ import annotations

from functools import lru_cache

from langchain_openai import (
    AzureChatOpenAI,
    AzureOpenAIEmbeddings,
    ChatOpenAI,
    OpenAIEmbeddings,
)

from app.config import get_settings


def _build(model: str, temperature: float):
    s = get_settings()
    if s.use_azure:
        # Azure exposes deployments, not model names — route every role to the
        # single configured chat deployment. gpt-5 / reasoning deployments only
        # accept the default temperature, so omit it for those to avoid 400s.
        kwargs = {
            "azure_deployment": s.azure_openai_deployment,
            "azure_endpoint": s.azure_openai_endpoint,
            "api_key": s.azure_openai_api_key,
            "api_version": s.azure_openai_api_version,
        }
        dep = s.azure_openai_deployment.lower()
        if not (dep.startswith("gpt-5") or dep.startswith("o3") or dep.startswith("o4")):
            kwargs["temperature"] = temperature
        return AzureChatOpenAI(**kwargs)
    kwargs = {"model": model, "temperature": temperature, "api_key": s.openai_api_key}
    if s.openai_base_url:
        kwargs["base_url"] = s.openai_base_url
    return ChatOpenAI(**kwargs)


@lru_cache
def fast_llm(temperature: float = 0.2):
    s = get_settings()
    return _build(s.model_fast, temperature)


@lru_cache
def smart_llm(temperature: float = 0.4):
    s = get_settings()
    return _build(s.model_smart, temperature)


@lru_cache
def embeddings():
    """Embeddings client that honours the same provider config as the chat models.

    Azure is used when an embedding deployment is configured; otherwise plain
    OpenAI, respecting ``openai_base_url`` so gateway/proxy setups work too.
    """
    s = get_settings()
    if s.use_azure and s.azure_openai_embedding_deployment:
        return AzureOpenAIEmbeddings(
            azure_deployment=s.azure_openai_embedding_deployment,
            azure_endpoint=s.azure_openai_endpoint,
            api_key=s.azure_openai_api_key,
            api_version=s.azure_openai_api_version,
        )
    kwargs = {"model": s.embedding_model, "api_key": s.openai_api_key}
    if s.openai_base_url:
        kwargs["base_url"] = s.openai_base_url
    return OpenAIEmbeddings(**kwargs)
