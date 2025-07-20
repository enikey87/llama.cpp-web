from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime


class GenerateRequest(BaseModel):
    """Ollama generate request schema."""
    model: str = Field(..., description="Model name")
    prompt: str = Field(..., description="Input prompt")
    stream: bool = Field(False, description="Stream response")
    options: Optional[Dict[str, Any]] = Field(None, description="Generation options")


class GenerateResponse(BaseModel):
    """Ollama generate response schema."""
    model: str = Field(..., description="Model name")
    created_at: str = Field(..., description="Creation timestamp")
    response: str = Field(..., description="Generated response")
    done: bool = Field(..., description="Generation complete")
    context: List[int] = Field(default_factory=list, description="Context tokens")
    total_duration: int = Field(0, description="Total duration in nanoseconds")
    load_duration: int = Field(0, description="Load duration in nanoseconds")
    prompt_eval_duration: int = Field(0, description="Prompt evaluation duration")
    eval_duration: int = Field(0, description="Evaluation duration")


class ChatMessage(BaseModel):
    """Chat message schema."""
    role: str = Field(..., description="Message role (user/assistant)")
    content: str = Field(..., description="Message content")


class ChatRequest(BaseModel):
    """Ollama chat request schema."""
    model: str = Field(..., description="Model name")
    messages: List[ChatMessage] = Field(..., description="Chat messages")
    stream: bool = Field(False, description="Stream response")
    options: Optional[Dict[str, Any]] = Field(None, description="Generation options")


class ChatResponse(BaseModel):
    """Ollama chat response schema."""
    model: str = Field(..., description="Model name")
    created_at: str = Field(..., description="Creation timestamp")
    message: ChatMessage = Field(..., description="Response message")
    done: bool = Field(..., description="Generation complete")
    total_duration: int = Field(0, description="Total duration in nanoseconds")
    load_duration: int = Field(0, description="Load duration in nanoseconds")
    prompt_eval_duration: int = Field(0, description="Prompt evaluation duration")
    eval_duration: int = Field(0, description="Evaluation duration")


class ModelInfo(BaseModel):
    """Model information schema."""
    name: str = Field(..., description="Model name")
    size: int = Field(0, description="Model size in bytes")
    modified_at: str = Field(..., description="Last modified timestamp")
    digest: str = Field("", description="Model digest")


class TagsResponse(BaseModel):
    """Ollama tags response schema."""
    models: List[ModelInfo] = Field(..., description="Available models")


class ShowRequest(BaseModel):
    """Ollama show request schema."""
    name: str = Field(..., description="Model name")


class ShowResponse(BaseModel):
    """Ollama show response schema."""
    license: str = Field("", description="Model license")
    modelfile: str = Field("", description="Model file content")
    parameters: str = Field("", description="Model parameters")
    template: str = Field("", description="Model template")
    system: str = Field("", description="System prompt")
    digest: str = Field("", description="Model digest")
    details: Dict[str, Any] = Field(default_factory=dict, description="Model details") 