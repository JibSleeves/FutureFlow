"use client";

import type { Prediction } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface JournalContextType {
  predictions: Prediction[];
  addPrediction: (prediction: Omit<Prediction, 'id' | 'date'> & { predictionText: string }) => void;
  getPredictions: () => Prediction[];
  clearJournal: () => void;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'futureflow-journal';

export const JournalProvider = ({ children }: { children: ReactNode }) => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  useEffect(() => {
    try {
      const storedPredictions = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedPredictions) {
        setPredictions(JSON.parse(storedPredictions));
      }
    } catch (error) {
      console.error("Failed to load predictions from localStorage", error);
      // Initialize with empty array if localStorage is corrupt or inaccessible
      setPredictions([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(predictions));
    } catch (error) {
      console.error("Failed to save predictions to localStorage", error);
    }
  }, [predictions]);

  const addPrediction = (newPredictionData: Omit<Prediction, 'id' | 'date'> & { predictionText: string }) => {
    const newEntry: Prediction = {
      ...newPredictionData,
      id: new Date().toISOString() + Math.random().toString(36).substring(2,9), // more unique id
      date: new Date().toISOString(),
      prediction: newPredictionData.predictionText, // Ensure 'prediction' field is correctly populated
    };
    setPredictions(prevPredictions => [newEntry, ...prevPredictions]);
  };

  const getPredictions = () => {
    return predictions;
  };

  const clearJournal = () => {
    setPredictions([]);
  }

  return (
    <JournalContext.Provider value={{ predictions, addPrediction, getPredictions, clearJournal }}>
      {children}
    </JournalContext.Provider>
  );
};

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (context === undefined) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
};
