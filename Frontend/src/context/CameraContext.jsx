import React, { createContext, useContext } from 'react';
import { useCamera } from '../hooks/useCamera';

const CameraContext = createContext(null);

export function CameraProvider({ children }) {
  const camera = useCamera();
  return (
    <CameraContext.Provider value={camera}>
      {children}
    </CameraContext.Provider>
  );
}

export function useCameraContext() {
  const ctx = useContext(CameraContext);
  if (!ctx) throw new Error('useCameraContext must be used within CameraProvider');
  return ctx;
}
