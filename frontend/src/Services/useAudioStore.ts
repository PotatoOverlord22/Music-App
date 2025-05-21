import { create } from 'zustand';

interface AudioState {
  // Original audio file
  originalFile: File | null;
  
  // Processed audio URL
  processedAudioUrl: string | null;
  
  // Processing status
  isProcessing: boolean;
  processingProgress: number;
  
  // Transformation settings
  settings: {
    timeOfDay: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
    mood: string;
    intensity: number;
    segmentLength: number;
    contextBias: number;
    overlapLength: number;
  };
  
  // Actions
  setOriginalFile: (file: File | null) => void;
  setProcessedAudioUrl: (url: string | null) => void;
  setIsProcessing: (processing: boolean) => void;
  setProcessingProgress: (progress: number) => void;
  updateSettings: (settings: Partial<AudioState['settings']>) => void;
  resetState: () => void;
}

// Initial state for the store
const initialState = {
  originalFile: null,
  processedAudioUrl: null,
  isProcessing: false,
  processingProgress: 0,
  settings: {
    timeOfDay: 'Afternoon' as const,
    mood: 'Happy',
    intensity: 8,
    segmentLength: 20,
    contextBias: 0.5,
    overlapLength: 2.5,
  },
};

// Create the store
const useAudioStore = create<AudioState>((set) => ({
  ...initialState,
  
  // Set original file
  setOriginalFile: (file) => set({ originalFile: file }),
  
  // Set processed audio URL
  setProcessedAudioUrl: (url) => set({ processedAudioUrl: url }),
  
  // Set processing status
  setIsProcessing: (processing) => set({ isProcessing: processing }),
  
  // Set processing progress
  setProcessingProgress: (progress) => set({ processingProgress: progress }),
  
  // Update settings
  updateSettings: (newSettings) => 
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),
  
  // Reset the state
  resetState: () => set(initialState),
}));

export default useAudioStore;