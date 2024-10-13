import React from 'react';
import { ProcessingOption, ProcessingParams, ProcessingStep } from '../types';

interface ProcessingOptionsProps {
  selectedOption: ProcessingOption | null;
  setSelectedOption: (option: ProcessingOption) => void;
  params: ProcessingParams;
  setParams: (params: ProcessingParams) => void;
  addStep: (step: ProcessingStep) => void;
}

const ProcessingOptions: React.FC<ProcessingOptionsProps> = ({
  selectedOption,
  setSelectedOption,
  params,
  setParams,
  addStep,
}) => {
  const options: ProcessingOption[] = [
    'Histogram Equalization',
    'Adaptive Histogram Equalization',
    'Edge Detection',
    'Unsharp Masking',
    'High-Pass Filtering',
    'Laplacian Filtering',
    'Color Inversion',
    'Thresholding',
    'Pseudocolor Mapping',
    'Fourier Transform',
    'Color Boosting',
    'Channel Mixing Simulation',
    'Manual Colorization',
    'Multi-Scale Retinex',
    'Gabor Filter'
  ];

  const handleParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams({ ...params, [name]: parseFloat(value) });
  };

  const handleAddStep = () => {
    if (selectedOption) {
      addStep({ option: selectedOption, params });
    }
  };

  const renderParams = () => {
    switch (selectedOption) {
      case 'Histogram Equalization':
        return null;
      case 'Adaptive Histogram Equalization':
        return (
          <>
            <label>Clip Limit: <input type="number" name="clipLimit" value={params.clipLimit} onChange={handleParamChange} min="0" max="10" step="0.1" /></label>
            <label>Tile Size: <input type="number" name="tileSize" value={params.tileSize} onChange={handleParamChange} min="2" max="16" step="1" /></label>
          </>
        );
      case 'Edge Detection':
        return (
          <>
            <label>Threshold 1: <input type="number" name="threshold1" value={params.threshold1} onChange={handleParamChange} min="0" max="255" step="1" /></label>
            <label>Threshold 2: <input type="number" name="threshold2" value={params.threshold2} onChange={handleParamChange} min="0" max="255" step="1" /></label>
          </>
        );
      case 'Unsharp Masking':
        return (
          <>
            <label>Sigma: <input type="number" name="sigma" value={params.sigma} onChange={handleParamChange} min="0.1" max="10" step="0.1" /></label>
            <label>Amount: <input type="number" name="amount" value={params.amount} onChange={handleParamChange} min="0" max="5" step="0.1" /></label>
          </>
        );
      case 'High-Pass Filtering':
      case 'Laplacian Filtering':
        return (
          <label>Kernel Size: <input type="number" name="kernelSize" value={params.kernelSize} onChange={handleParamChange} min="1" max="31" step="2" /></label>
        );
      case 'Color Inversion':
        return null;
      case 'Thresholding':
        return (
          <label>Threshold: <input type="number" name="threshold" value={params.threshold} onChange={handleParamChange} min="0" max="255" step="1" /></label>
        );
      case 'Pseudocolor Mapping':
        return (
          <label>Color Map: <input type="number" name="colorMap" value={params.colorMap} onChange={handleParamChange} min="0" max="21" step="1" /></label>
        );
      case 'Fourier Transform':
        return null;
      case 'Color Boosting':
        return (
          <>
            <label>Red Boost: <input type="number" name="boostFactor[0]" value={params.boostFactor[0]} onChange={handleParamChange} min="0" max="3" step="0.1" /></label>
            <label>Green Boost: <input type="number" name="boostFactor[1]" value={params.boostFactor[1]} onChange={handleParamChange} min="0" max="3" step="0.1" /></label>
            <label>Blue Boost: <input type="number" name="boostFactor[2]" value={params.boostFactor[2]} onChange={handleParamChange} min="0" max="3" step="0.1" /></label>
          </>
        );
      case 'Channel Mixing Simulation':
        return (
          <>
            <label>R to R: <input type="number" name="mixFactors[0][0]" value={params.mixFactors[0][0]} onChange={handleParamChange} min="-2" max="2" step="0.1" /></label>
            <label>G to R: <input type="number" name="mixFactors[0][1]" value={params.mixFactors[0][1]} onChange={handleParamChange} min="-2" max="2" step="0.1" /></label>
            <label>B to R: <input type="number" name="mixFactors[0][2]" value={params.mixFactors[0][2]} onChange={handleParamChange} min="-2" max="2" step="0.1" /></label>
            <label>R to G: <input type="number" name="mixFactors[1][0]" value={params.mixFactors[1][0]} onChange={handleParamChange} min="-2" max="2" step="0.1" /></label>
            <label>G to G: <input type="number" name="mixFactors[1][1]" value={params.mixFactors[1][1]} onChange={handleParamChange} min="-2" max="2" step="0.1" /></label>
            <label>B to G: <input type="number" name="mixFactors[1][2]" value={params.mixFactors[1][2]} onChange={handleParamChange} min="-2" max="2" step="0.1" /></label>
            <label>R to B: <input type="number" name="mixFactors[2][0]" value={params.mixFactors[2][0]} onChange={handleParamChange} min="-2" max="2" step="0.1" /></label>
            <label>G to B: <input type="number" name="mixFactors[2][1]" value={params.mixFactors[2][1]} onChange={handleParamChange} min="-2" max="2" step="0.1" /></label>
            <label>B to B: <input type="number" name="mixFactors[2][2]" value={params.mixFactors[2][2]} onChange={handleParamChange} min="-2" max="2" step="0.1" /></label>
          </>
        );
      case 'Manual Colorization':
        return (
          <>
            <label>Red Tint: <input type="number" name="colorTint[0]" value={params.colorTint[0]} onChange={handleParamChange} min="0" max="255" step="1" /></label>
            <label>Green Tint: <input type="number" name="colorTint[1]" value={params.colorTint[1]} onChange={handleParamChange} min="0" max="255" step="1" /></label>
            <label>Blue Tint: <input type="number" name="colorTint[2]" value={params.colorTint[2]} onChange={handleParamChange} min="0" max="255" step="1" /></label>
          </>
        );
      case 'Multi-Scale Retinex':
        return (
          <>
            <label>Scale 1: <input type="number" name="retinexScales[0]" value={params.retinexScales[0]} onChange={handleParamChange} min="1" max="100" step="1" /></label>
            <label>Scale 2: <input type="number" name="retinexScales[1]" value={params.retinexScales[1]} onChange={handleParamChange} min="1" max="100" step="1" /></label>
            <label>Scale 3: <input type="number" name="retinexScales[2]" value={params.retinexScales[2]} onChange={handleParamChange} min="1" max="100" step="1" /></label>
          </>
        );
      case 'Gabor Filter':
        return (
          <>
            <label>Kernel Size: <input type="number" name="gaborKernelSize" value={params.gaborKernelSize} onChange={handleParamChange} min="3" max="31" step="2" /></label>
            <label>Sigma: <input type="number" name="gaborSigma" value={params.gaborSigma} onChange={handleParamChange} min="0.1" max="10" step="0.1" /></label>
            <label>Theta: <input type="number" name="gaborTheta" value={params.gaborTheta} onChange={handleParamChange} min="0" max="6.28" step="0.1" /></label>
            <label>Lambda: <input type="number" name="gaborLambda" value={params.gaborLambda} onChange={handleParamChange} min="0.1" max="10" step="0.1" /></label>
            <label>Gamma: <input type="number" name="gaborGamma" value={params.gaborGamma} onChange={handleParamChange} min="0.1" max="1" step="0.1" /></label>
            <label>Psi: <input type="number" name="gaborPsi" value={params.gaborPsi} onChange={handleParamChange} min="0" max="6.28" step="0.1" /></label>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Processing Options</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
        {options.map((option) => (
          <button
            key={option}
            className={`px-4 py-2 rounded-md text-sm ${
              selectedOption === option
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
            onClick={() => setSelectedOption(option)}
          >
            {option}
          </button>
        ))}
      </div>
      {selectedOption && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Parameters</h3>
          <div className="flex flex-wrap gap-4 mb-4">
            {renderParams()}
          </div>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            onClick={handleAddStep}
          >
            Add Processing Step
          </button>
        </div>
      )}
    </div>
  );
};

export default ProcessingOptions;