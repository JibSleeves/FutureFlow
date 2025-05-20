
export interface Prediction {
  id: string;
  query: string;
  prediction: string; // This is the journalSummaryForUser from AstraKairosInsight
  date: string;
  visualizationHint?: string; // From AstraKairosInsight.emergentArchetypeVisualizationSeed
  symbolicSeedUsed?: string; // The symbolic seed active when this prediction was made
  chronoSymbolicMomentDate?: string; // ISO string if provided
  chronoSymbolicMomentFeeling?: string; // Text if provided
}

    