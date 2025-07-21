import React from 'react';
import { useModelStore } from '../store/modelStore';
import LoadingSpinner from './LoadingSpinner';
import { LOADING_MESSAGES } from '../constants';
import '../styles/ModelSelector.css';

const ModelSelector: React.FC = () => {
  const { models, selectedModel, isLoading, error, loadModels, setSelectedModel } = useModelStore();

  React.useEffect(() => {
    loadModels();
  }, [loadModels]);

  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(event.target.value);
  };

  if (isLoading) {
    return (
      <div className="model-selector">
        <LoadingSpinner size="small" />
        <span>{LOADING_MESSAGES.LOADING_MODELS}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="model-selector model-selector--error">
        <span>Error loading models: {error}</span>
        <button onClick={loadModels} className="model-selector__retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="model-selector">
      <label htmlFor="model-select" className="model-selector__label">
        Model:
      </label>
      <select
        id="model-select"
        value={selectedModel}
        onChange={handleModelChange}
        className="model-selector__select"
      >
        {models.map((model) => (
          <option key={model.name} value={model.name}>
            {model.name}
          </option>
        ))}
      </select>
      {selectedModel && (
        <div className="model-selector__info">
          <span className="model-selector__model-name">{selectedModel}</span>
        </div>
      )}
    </div>
  );
};

export default ModelSelector; 