export interface Prediction {
  id: string;
  query: string;
  prediction: string;
  date: string;
  visualizationHint?: string; // For the astrological visualization
}
