import asyncio
import os
import time
from typing import Dict, Any, Optional, List
from ..utils.logging import logger
from datetime import datetime


class LlamaCppModel:
    """Wrapper for llama.cpp CLI integration."""
    
    def __init__(self, model_config: Dict[str, Any]):
        self.model_config = model_config
        self.model_path = model_config["path"]
        self.model_name = model_config["name"]
        self.default_params = model_config.get("parameters", {})
        
        # Validate model path
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"Model file not found: {self.model_path}")
    
    def _map_parameters(self, options: Optional[Dict[str, Any]] = None) -> List[str]:
        """Map Ollama parameters to llama.cpp CLI arguments."""
        if options is None:
            options = {}
        
        # Merge with default parameters
        params = {**self.default_params, **options}
        
        cmd_args = []
        
        # Parameter mapping
        if "temperature" in params:
            cmd_args.extend(["--temp", str(params["temperature"])])
        
        if "top_p" in params:
            cmd_args.extend(["--top-p", str(params["top_p"])])
        
        if "max_tokens" in params:
            cmd_args.extend(["--n-predict", str(params["max_tokens"])])
        
        if "top_k" in params:
            cmd_args.extend(["--top-k", str(params["top_k"])])
        
        if "repeat_penalty" in params:
            cmd_args.extend(["--repeat-penalty", str(params["repeat_penalty"])])
        
        return cmd_args
    
    async def generate(self, prompt: str, options: Optional[Dict[str, Any]] = None) -> str:
        """Generate response using llama.cpp CLI."""
        start_time = time.time()
        
        # Build command
        cmd = ["llama-cli", "-m", self.model_path]
        cmd.extend(self._map_parameters(options))
        
        logger.info(f"Executing llama.cpp command: {' '.join(cmd)}")
        
        try:
            # Create subprocess
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            # Send prompt and get response
            stdout, stderr = await process.communicate(input=prompt.encode())
            
            if process.returncode != 0:
                error_msg = stderr.decode().strip()
                logger.error(f"llama.cpp error: {error_msg}")
                raise RuntimeError(f"llama.cpp failed: {error_msg}")
            
            response = stdout.decode().strip()
            duration = time.time() - start_time
            
            logger.info(f"Generated response in {duration:.2f}s")
            return response
            
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            raise
    
    async def generate_stream(self, prompt: str, options: Optional[Dict[str, Any]] = None):
        """Generate streaming response using llama.cpp CLI."""
        start_time = time.time()
        
        # Build command
        cmd = ["llama-cli", "-m", self.model_path]
        cmd.extend(self._map_parameters(options))
        
        logger.info(f"Executing streaming llama.cpp command: {' '.join(cmd)}")
        
        try:
            # Create subprocess
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            # Send prompt
            process.stdin.write(prompt.encode())
            await process.stdin.drain()
            process.stdin.close()
            
            # Stream response
            response_chunks = []
            while True:
                chunk = await process.stdout.readline()
                if not chunk:
                    break
                
                chunk_text = chunk.decode().strip()
                if chunk_text:
                    response_chunks.append(chunk_text)
                    yield chunk_text
            
            # Wait for process to complete
            await process.wait()
            
            if process.returncode != 0:
                stderr = await process.stderr.read()
                error_msg = stderr.decode().strip()
                logger.error(f"llama.cpp streaming error: {error_msg}")
                raise RuntimeError(f"llama.cpp streaming failed: {error_msg}")
            
            duration = time.time() - start_time
            logger.info(f"Generated streaming response in {duration:.2f}s")
            
        except Exception as e:
            logger.error(f"Error generating streaming response: {e}")
            raise


class ModelRegistry:
    """Registry for managing available models."""
    
    def __init__(self, config):
        self.config = config
        self.models = {}
        self._load_models()
    
    def _load_models(self):
        """Load models from configuration."""
        for model_name, model_config in self.config.get_models().items():
            try:
                self.models[model_name] = LlamaCppModel(model_config)
                logger.info(f"Loaded model: {model_name}")
            except Exception as e:
                logger.error(f"Failed to load model {model_name}: {e}")
    
    def get_model(self, model_name: str) -> Optional[LlamaCppModel]:
        """Get model by name."""
        return self.models.get(model_name)
    
    def list_models(self) -> List[str]:
        """List available model names."""
        return list(self.models.keys())
    
    def get_model_info(self, model_name: str) -> Optional[Dict[str, Any]]:
        """Get model information."""
        model = self.get_model(model_name)
        if not model:
            return None
        
        try:
            stat = os.stat(model.model_path)
            return {
                "name": model.model_name,
                "size": stat.st_size,
                "modified_at": datetime.fromtimestamp(stat.st_mtime).isoformat(),
                "path": model.model_path
            }
        except Exception as e:
            logger.error(f"Error getting model info for {model_name}: {e}")
            return None 