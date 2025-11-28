// src/api/queries/system.ts
import { useQuery } from '@tanstack/react-query'
import { instance } from '../api'
import type { AxiosResponse } from 'axios'

// ========================
// TYPES RÉELS (basés sur tes réponses Postman)
// ========================

export type ApiDocumentation = {
  health: Record<string, string>
  image_predictions: Record<string, string>
  predictions: Record<string, string>
  transactions: Record<string, string>
  users: Record<string, string>
}

export type PresentationResponse = {
  status: string
  message: string
  version: string
  documentation: ApiDocumentation
}

export type DatabaseConfig = {
  exists: boolean
  path: string
  size_bytes: number
  size_mb: number
}

export type ModelStatus = {
  loaded: boolean
  status: 'ready' | 'not loaded'
}

export type HealthResponse = {
  status: 'healthy' | 'unhealthy'
  api: {
    environment: string
    version: string
  }
  database: {
    status: 'success' | 'error'
    message: string
    type: 'SQLite'
    config: DatabaseConfig
  }
  models: {
    fraud_detection: ModelStatus
    image_classification: ModelStatus
  }
}

export type FraudModelInfo = {
  loaded: boolean
  model_type: string
  has_scaler: boolean
  has_train_stats: boolean
  paths: {
    model: string
    scaler: string
    stats: string
  }
}

export type ImageModelInfo = {
  loaded: boolean
  exists: boolean
  path: string
  message?: string
}

export type ModelStatusResponse = {
  base_directory: string
  working_directory: string
  ml_directory_exists: boolean
  ml_files: Array<string>
  environment: {
    MODEL_PATH?: string
    SCALER_PATH?: string
    STATS_PATH?: string
    IMAGE_MODEL_PATH?: string
  }
  fraud_model: FraudModelInfo
  image_model: ImageModelInfo
}

// ========================
// QUERY KEYS
// ========================

export const systemKeys = {
  all: ['system'] as const,
  presentation: () => [...systemKeys.all, 'presentation'] as const,
  health: () => [...systemKeys.all, 'health'] as const,
  modelStatus: () => [...systemKeys.all, 'model-status'] as const,
}

// ========================
// QUERIES MISES À JOUR
// ========================

export const systemQueries = {
  /**
   * Page d'accueil / présentation de l'API
   */
  getPresentation: () =>
    useQuery<AxiosResponse<PresentationResponse>, Error>({
      queryKey: systemKeys.presentation(),
      queryFn: () => instance.get('/'),
      staleTime: 30 * 60 * 1000, // 30 min
      gcTime: 60 * 60 * 1000,
    }),

  /**
   * Health check complet (DB + modèles)
   */
  getHealth: () =>
    useQuery<AxiosResponse<HealthResponse>, Error>({
      queryKey: systemKeys.health(),
      queryFn: () => instance.get('/health'),
      staleTime: 1 * 60 * 1000,
      gcTime: 5 * 60 * 1000,
      refetchInterval: 30_000, // toutes les 30s
    }),

  /**
   * Statut détaillé des modèles (fraude + image)
   */
  getModelStatus: () =>
    useQuery<AxiosResponse<ModelStatusResponse>, Error>({
      queryKey: systemKeys.modelStatus(),
      queryFn: () => instance.get('/debug/model-status'),
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    }),
}