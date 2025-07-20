import os
import yaml
from typing import Dict, Any, Optional
from pathlib import Path


class Config:
    def __init__(self, config_path: str = "config/models.yaml"):
        self.config_path = config_path
        self.config = self._load_config()
        self._validate_config()

    def _load_config(self) -> Dict[str, Any]:
        """Load configuration from YAML file."""
        if not os.path.exists(self.config_path):
            raise FileNotFoundError(f"Configuration file not found: {self.config_path}")
        
        with open(self.config_path, 'r') as f:
            config = yaml.safe_load(f)
        
        return config

    def _validate_config(self):
        """Validate configuration structure and model paths."""
        if 'models' not in self.config:
            raise ValueError("Configuration must contain 'models' section")
        
        if 'server' not in self.config:
            raise ValueError("Configuration must contain 'server' section")
        
        # Validate model paths
        for model_name, model_config in self.config['models'].items():
            if 'path' not in model_config:
                raise ValueError(f"Model '{model_name}' must have 'path' specified")
            
            model_path = model_config['path']
            if not os.path.exists(model_path):
                raise FileNotFoundError(f"Model file not found: {model_path}")

    def get_models(self) -> Dict[str, Any]:
        """Get all configured models."""
        return self.config.get('models', {})

    def get_model(self, model_name: str) -> Optional[Dict[str, Any]]:
        """Get specific model configuration."""
        return self.config.get('models', {}).get(model_name)

    def get_server_config(self) -> Dict[str, Any]:
        """Get server configuration."""
        return self.config.get('server', {})

    def get_server_host(self) -> str:
        """Get server host."""
        return self.get_server_config().get('host', '0.0.0.0')

    def get_server_port(self) -> int:
        """Get server port."""
        return self.get_server_config().get('port', 11434)


# Global config instance
config = Config() 