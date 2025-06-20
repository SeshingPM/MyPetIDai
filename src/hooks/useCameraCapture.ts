
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

export interface UseCameraCaptureResult {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  stream: MediaStream | null;
  capturedImage: string | null;
  error: string | null;
  isCapturing: boolean;
  startCamera: () => Promise<void>;
  capturePhoto: () => void;
  resetCapture: () => Promise<void>;
  convertToFile: () => File | null;
}

export const useCameraCapture = (): UseCameraCaptureResult => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    startCamera();
    return () => {
      // Clean up when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setError(null);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please check permissions and try again.');
      toast.error('Could not access camera. Please check permissions and try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !stream) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to data URL
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageDataUrl);
      
      // Stop camera stream after capturing
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const resetCapture = async () => {
    setCapturedImage(null);
    await startCamera();
  };

  const convertToFile = (): File | null => {
    if (!capturedImage || !canvasRef.current) return null;
    
    const canvas = canvasRef.current;
    let file: File | null = null;
    
    canvas.toBlob((blob) => {
      if (blob) {
        file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
      }
    }, 'image/jpeg', 0.9);
    
    return file;
  };

  return {
    videoRef,
    canvasRef,
    stream,
    capturedImage,
    error,
    isCapturing,
    startCamera,
    capturePhoto,
    resetCapture,
    convertToFile
  };
};
