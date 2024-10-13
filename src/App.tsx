import React, { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Download, Undo, Redo } from 'lucide-react';
import ImageProcessor from './components/ImageProcessor';
import ProcessingOptions from './components/ProcessingOptions';
import { ProcessingOption, ProcessingParams, ProcessingStep, ProcessingHistory } from './types';

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<ProcessingOption | null>(null);
  const [params, setParams] = useState<ProcessingParams>({
    clipLimit: 2.0,
    tileSize: 8,
    threshold1: 50,
    threshold2: 150,
    sigma: 3,
    amount: 1.5,
    kernelSize: 3,
    scale: 1,
    threshold: 127,
    colorMap: 2,
    boostFactor: [1, 1, 1],
    mixFactors: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
    colorTint: [128, 128, 128],
    retinexScales: [15, 80, 250],
    gaborKernelSize: 31,
    gaborSigma: 5,
    gaborTheta: 0,
    gaborLambda: 10,
    gaborGamma: 0.5,
    gaborPsi: 0
  });
  const [history, setHistory] = useState<ProcessingHistory>({
    past: [],
    present: null,
    future: []
  });
  const [openCvLoaded, setOpenCvLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://docs.opencv.org/4.5.5/opencv.js';
    script.async = true;
    script.onload = () => setOpenCvLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setProcessedImage(null);
        setHistory({ past: [], present: null, future: [] });
      };
      reader.readAsDataURL(file);
    }
  };

  const addStep = (step: ProcessingStep) => {
    setHistory((prevHistory) => ({
      past: [...prevHistory.past, step],
      present: null,
      future: []
    }));
  };

  const undo = () => {
    setHistory((prevHistory) => {
      const newPast = [...prevHistory.past];
      const step = newPast.pop();
      if (step) {
        return {
          past: newPast,
          present: prevHistory.present,
          future: [step, ...prevHistory.future]
        };
      }
      return prevHistory;
    });
  };

  const redo = () => {
    setHistory((prevHistory) => {
      const newFuture = [...prevHistory.future];
      const step = newFuture.shift();
      if (step) {
        return {
          past: [...prevHistory.past, step],
          present: prevHistory.present,
          future: newFuture
        };
      }
      return prevHistory;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Advanced Image Processing App</h1>
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <label htmlFor="imageUpload" className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            <Upload className="mr-2" />
            Upload Image
          </label>
          <input id="imageUpload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </div>

        {image && (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2">
              <h2 className="text-xl font-semibold mb-2">Original Image</h2>
              <img src={image} alt="Original" className="max-w-full h-auto" />
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-xl font-semibold mb-2">Processed Image</h2>
              {processedImage ? (
                <img src={processedImage} alt="Processed" className="max-w-full h-auto" />
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-200 text-gray-500">
                  <ImageIcon size={48} />
                </div>
              )}
            </div>
          </div>
        )}

        {image && (
          <div className="mt-6">
            <ProcessingOptions
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              params={params}
              setParams={setParams}
              addStep={addStep}
            />
          </div>
        )}

        {image && openCvLoaded && history.past.length > 0 && (
          <ImageProcessor
            image={image}
            steps={history.past}
            setProcessedImage={setProcessedImage}
          />
        )}

        {processedImage && (
          <div className="mt-6 flex justify-between">
            <div>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 mr-2"
                onClick={undo}
                disabled={history.past.length === 0}
              >
                <Undo className="inline-block mr-1" /> Undo
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                onClick={redo}
                disabled={history.future.length === 0}
              >
                <Redo className="inline-block mr-1" /> Redo
              </button>
            </div>
            <a
              href={processedImage}
              download="processed_image.png"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              <Download className="inline-block mr-1" /> Download Processed Image
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;