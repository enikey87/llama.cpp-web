import time
from datetime import datetime
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import StreamingResponse
import json

from .schemas import (
    GenerateRequest, GenerateResponse, ChatRequest, ChatResponse,
    TagsResponse, ShowRequest, ShowResponse, ModelInfo, ChatMessage
)
from ..models.llama_wrapper import ModelRegistry
from ..utils.config import config
from ..utils.logging import logger


# Create router
router = APIRouter(prefix="/api")

# Initialize model registry
model_registry = ModelRegistry(config)


@router.get("/tags", response_model=TagsResponse)
async def list_models():
    """List available models (Ollama /api/tags endpoint)."""
    try:
        models = []
        for model_name in model_registry.list_models():
            model_info = model_registry.get_model_info(model_name)
            if model_info:
                models.append(ModelInfo(
                    name=model_info["name"],
                    size=model_info["size"],
                    modified_at=model_info["modified_at"],
                    digest=""
                ))
        
        return TagsResponse(models=models)
    except Exception as e:
        logger.error(f"Error listing models: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate", response_model=GenerateResponse)
async def generate_text(request: GenerateRequest):
    """Generate text completion (Ollama /api/generate endpoint)."""
    try:
        # Get model
        model = model_registry.get_model(request.model)
        if not model:
            raise HTTPException(status_code=404, detail=f"Model '{request.model}' not found")
        
        # Generate response
        start_time = time.time()
        response_text = await model.generate(request.prompt, request.options)
        duration = time.time() - start_time
        
        # Format response
        return GenerateResponse(
            model=request.model,
            created_at=datetime.now().isoformat(),
            response=response_text,
            done=True,
            context=[],
            total_duration=int(duration * 1_000_000_000),  # Convert to nanoseconds
            load_duration=0,
            prompt_eval_duration=0,
            eval_duration=int(duration * 1_000_000_000)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating text: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate/stream")
async def generate_text_stream(request: GenerateRequest):
    """Generate streaming text completion."""
    try:
        # Get model
        model = model_registry.get_model(request.model)
        if not model:
            raise HTTPException(status_code=404, detail=f"Model '{request.model}' not found")
        
        async def generate_stream():
            start_time = time.time()
            complete_response = ""
            
            async for chunk in model.generate_stream(request.prompt, request.options):
                # Format streaming response
                complete_response += chunk
                response_data = {
                    "model": request.model,
                    "created_at": datetime.now().isoformat(),
                    "response": chunk,
                    "done": False
                }
                yield f"data: {json.dumps(response_data)}\n\n"
            
            # Send final response with complete content
            duration = time.time() - start_time
            final_response = {
                "model": request.model,
                "created_at": datetime.now().isoformat(),
                "response": complete_response,
                "done": True,
                "total_duration": int(duration * 1_000_000_000)
            }
            yield f"data: {json.dumps(final_response)}\n\n"
        
        return StreamingResponse(
            generate_stream(),
            media_type="text/plain"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating streaming text: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chat", response_model=ChatResponse)
async def chat_completion(request: ChatRequest):
    """Chat completion (Ollama /api/chat endpoint)."""
    try:
        # Get model
        model = model_registry.get_model(request.model)
        if not model:
            raise HTTPException(status_code=404, detail=f"Model '{request.model}' not found")
        
        # Format messages as prompt
        prompt = ""
        for message in request.messages:
            if message.role == "user":
                prompt += f"User: {message.content}\n"
            elif message.role == "assistant":
                prompt += f"Assistant: {message.content}\n"
        
        prompt += "Assistant: "
        
        # Generate response
        start_time = time.time()
        response_text = await model.generate(prompt, request.options)
        duration = time.time() - start_time
        
        # Format response
        return ChatResponse(
            model=request.model,
            created_at=datetime.now().isoformat(),
            message=ChatMessage(role="assistant", content=response_text),
            done=True,
            total_duration=int(duration * 1_000_000_000),
            load_duration=0,
            prompt_eval_duration=0,
            eval_duration=int(duration * 1_000_000_000)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in chat completion: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/show", response_model=ShowResponse)
async def show_model(request: ShowRequest):
    """Show model information (Ollama /api/show endpoint)."""
    try:
        # Get model info
        model_info = model_registry.get_model_info(request.name)
        if not model_info:
            raise HTTPException(status_code=404, detail=f"Model '{request.name}' not found")
        
        # Format response
        return ShowResponse(
            license="",
            modelfile=f"FROM {model_info['path']}",
            parameters="",
            template="",
            system="",
            digest="",
            details={
                "format": "gguf",
                "family": "phi3",
                "parameter_size": "4k",
                "quantization_level": "q4"
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error showing model: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "models": model_registry.list_models()} 