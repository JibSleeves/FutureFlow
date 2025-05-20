
import type { Prediction } from '@/types';
import type { SimplifiedPredictionData } from '@/ai/flows/link-karmic-echoes';

/**
 * Adapts a full Prediction object to the simplified structure needed for the
 * linkKarmicEchoes AI flow.
 * @param prediction The full Prediction object.
 * @returns A simplified prediction object.
 */
export function adaptPredictionForKarmicLink(prediction: Prediction): SimplifiedPredictionData {
  return {
    query: prediction.query,
    prediction: prediction.prediction, // This should be the journalSummaryForUser
    date: prediction.date,
  };
}
