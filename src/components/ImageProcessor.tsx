import React, { useEffect } from 'react';
import { ProcessingOption, ProcessingParams, ProcessingStep } from '../types';

interface ImageProcessorProps {
  image: string;
  steps: ProcessingStep[];
  setProcessedImage: (image: string) => void;
}

declare global {
  interface Window {
    cv: any;
  }
}

const ImageProcessor: React.FC<ImageProcessorProps> = ({ image, steps, setProcessedImage }) => {
  useEffect(() => {
    const processImage = async () => {
      if (!window.cv) {
        console.error('OpenCV.js is not loaded');
        return;
      }

      const img = await loadImage(image);
      let src = window.cv.imread(img);
      let dst = new window.cv.Mat();

      for (const step of steps) {
        const { option, params } = step;
        dst = await applyProcessingStep(src, option, params);
        src.delete();
        src = dst.clone();
      }

      window.cv.imshow(document.createElement('canvas'), dst);
      const dataUrl = document.createElement('canvas').toDataURL();
      setProcessedImage(dataUrl);

      src.delete();
      dst.delete();
    };

    processImage();
  }, [image, steps, setProcessedImage]);

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const applyProcessingStep = async (src: any, option: ProcessingOption, params: ProcessingParams): Promise<any> => {
    let dst = new window.cv.Mat();

    switch (option) {
      case 'Histogram Equalization':
        window.cv.cvtColor(src, src, window.cv.COLOR_RGBA2GRAY);
        window.cv.equalizeHist(src, dst);
        break;
      case 'Adaptive Histogram Equalization':
        window.cv.cvtColor(src, src, window.cv.COLOR_RGBA2GRAY);
        const clahe = new window.cv.CLAHE(params.clipLimit, new window.cv.Size(params.tileSize, params.tileSize));
        clahe.apply(src, dst);
        break;
      case 'Edge Detection':
        window.cv.cvtColor(src, src, window.cv.COLOR_RGBA2GRAY);
        window.cv.Canny(src, dst, params.threshold1, params.threshold2, 3, false);
        break;
      case 'Unsharp Masking':
        let blurred = new window.cv.Mat();
        window.cv.GaussianBlur(src, blurred, new window.cv.Size(0, 0), params.sigma, params.sigma);
        window.cv.addWeighted(src, 1 + params.amount, blurred, -params.amount, 0, dst);
        blurred.delete();
        break;
      case 'High-Pass Filtering':
        let lowPass = new window.cv.Mat();
        window.cv.GaussianBlur(src, lowPass, new window.cv.Size(params.kernelSize, params.kernelSize), 0, 0);
        window.cv.subtract(src, lowPass, dst);
        lowPass.delete();
        break;
      case 'Laplacian Filtering':
        window.cv.cvtColor(src, src, window.cv.COLOR_RGBA2GRAY);
        window.cv.Laplacian(src, dst, window.cv.CV_8U, params.kernelSize, params.scale, 0, window.cv.BORDER_DEFAULT);
        break;
      case 'Color Inversion':
        window.cv.bitwise_not(src, dst);
        break;
      case 'Thresholding':
        window.cv.cvtColor(src, src, window.cv.COLOR_RGBA2GRAY);
        window.cv.threshold(src, dst, params.threshold, 255, window.cv.THRESH_BINARY);
        break;
      case 'Pseudocolor Mapping':
        window.cv.cvtColor(src, src, window.cv.COLOR_RGBA2GRAY);
        window.cv.applyColorMap(src, dst, params.colorMap);
        break;
      case 'Fourier Transform':
        window.cv.cvtColor(src, src, window.cv.COLOR_RGBA2GRAY);
        let planes = new window.cv.MatVector();
        let complexI = new window.cv.Mat();
        let padded = new window.cv.Mat();
        let mag = new window.cv.Mat();
        let paddedSize = new window.cv.Size(window.cv.getOptimalDFTSize(src.cols), window.cv.getOptimalDFTSize(src.rows));
        window.cv.copyMakeBorder(src, padded, 0, paddedSize.height - src.rows, 0, paddedSize.width - src.cols, window.cv.BORDER_CONSTANT, new window.cv.Scalar(0));
        planes.push_back(padded);
        planes.push_back(new window.cv.Mat.zeros(padded.rows, padded.cols, window.cv.CV_32F));
        window.cv.merge(planes, complexI);
        window.cv.dft(complexI, complexI);
        window.cv.split(complexI, planes);
        window.cv.magnitude(planes.get(0), planes.get(1), mag);
        mag.convertTo(mag, window.cv.CV_8U);
        window.cv.normalize(mag, dst, 0, 255, window.cv.NORM_MINMAX);
        planes.delete(); complexI.delete(); padded.delete(); mag.delete();
        break;
      case 'Color Boosting':
        let channels = new window.cv.MatVector();
        window.cv.split(src, channels);
        for (let i = 0; i < 3; i++) {
          channels.get(i).convertTo(channels.get(i), -1, params.boostFactor[i], 0);
        }
        window.cv.merge(channels, dst);
        channels.delete();
        break;
      case 'Channel Mixing Simulation':
        let mixedChannels = new window.cv.MatVector();
        window.cv.split(src, mixedChannels);
        for (let i = 0; i < 3; i++) {
          let mixed = new window.cv.Mat();
          window.cv.addWeighted(mixedChannels.get(0), params.mixFactors[i][0],
                                mixedChannels.get(1), params.mixFactors[i][1],
                                0, mixed);
          window.cv.addWeighted(mixed, 1, mixedChannels.get(2), params.mixFactors[i][2], 0, mixed);
          mixedChannels.set(i, mixed);
        }
        window.cv.merge(mixedChannels, dst);
        mixedChannels.delete();
        break;
      case 'Manual Colorization':
        window.cv.cvtColor(src, src, window.cv.COLOR_RGBA2GRAY);
        window.cv.cvtColor(src, dst, window.cv.COLOR_GRAY2BGR);
        dst.convertTo(dst, -1, 1, 0);
        let colorMask = new window.cv.Mat(src.rows, src.cols, src.type(), new window.cv.Scalar(...params.colorTint));
        window.cv.add(dst, colorMask, dst);
        colorMask.delete();
        break;
      case 'Multi-Scale Retinex':
        let msr = new window.cv.Mat();
        let sum = new window.cv.Mat(src.rows, src.cols, window.cv.CV_32F, new window.cv.Scalar(0));
        for (let scale of params.retinexScales) {
          let blur = new window.cv.Mat();
          window.cv.GaussianBlur(src, blur, new window.cv.Size(0, 0), scale, scale);
          let log = new window.cv.Mat();
          window.cv.log(blur, log);
          window.cv.subtract(sum, log, sum);
          blur.delete();
          log.delete();
        }
        window.cv.normalize(sum, msr, 0, 255, window.cv.NORM_MINMAX);
        msr.convertTo(dst, window.cv.CV_8U);
        sum.delete();
        msr.delete();
        break;
      case 'Gabor Filter':
        window.cv.cvtColor(src, src, window.cv.COLOR_RGBA2GRAY);
        let kernel = window.cv.getGaborKernel(
          new window.cv.Size(params.gaborKernelSize, params.gaborKernelSize),
          params.gaborSigma,
          params.gaborTheta,
          params.gaborLambda,
          params.gaborGamma,
          params.gaborPsi,
          window.cv.CV_32F
        );
        window.cv.filter2D(src, dst, window.cv.CV_8U, kernel, new window.cv.Point(-1, -1), 0, window.cv.BORDER_DEFAULT);
        kernel.delete();
        break;
      default:
        console.error('Unknown processing option:', option);
        dst = src.clone();
    }

    return dst;
  };

  return null;
};

export default ImageProcessor;