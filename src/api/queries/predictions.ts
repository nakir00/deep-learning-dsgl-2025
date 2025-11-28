import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { instance } from '../api'
import type { TransactionModel } from './transaction'
import type { AxiosResponse } from 'axios'

// Types
export type PredictionProbability = {
  fraud: number
  legitimate: number
}

export type PredictionResult = {
  success: boolean
  prediction: number
  is_fraud: boolean
  label: 'FRAUDE' | 'LÉGITIME'
  probability: PredictionProbability
  confidence: number
}

export type RiskFactor = {
  factor: string
  value: string | number
  risk: 'LOW' | 'MEDIUM' | 'HIGH'
  description: string
}

export type RiskAnalysis = {
  risk_score: number
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH'
  factors_count: number
  risk_factors: Array<RiskFactor>
  recommendation: string
}

export type ModelStatus = {
  loaded: boolean
  model_type?: string
  has_scaler?: boolean
  has_train_stats?: boolean
}

export type ModelStatusResponse = {
  success: boolean
  model: ModelStatus
}

export type ReloadModelRequest = {
  model_path?: string
  scaler_path?: string
  stats_path?: string
}

export type ReloadModelResponse = {
  success: boolean
  message: string
  model: ModelStatus
}

export type PredictTransactionRequest = {
  gender: number
  age: number
  house_type_id: number
  contact_avaliability_id: number
  home_country: number
  account_no: number
  card_expiry_date: number
  cif: number
  transaction_amount: number
  transaction_country: number
  transaction_currency_code: number
  large_purchase: number
  product_id: number
}

export type PredictTransactionResponse = {
  success: boolean
  data: PredictionResult
}

export type ExplainTransactionResponse = {
  success: boolean
  prediction: PredictionResult
  analysis: RiskAnalysis
}

export type BatchPredictionRequest = {
  transactions: Array<PredictTransactionRequest>
}

export type BatchPredictionResult = PredictionResult & {
  index: number
}

export type BatchPredictionResponse = {
  success: boolean
  total: number
  fraud_detected: number
  legitimate: number
  fraud_rate: number
  predictions: Array<BatchPredictionResult>
}

export type PredictExistingResponse = {
  success: boolean
  message: string
  prediction: Omit<PredictionResult, 'success' | 'prediction'>
  transaction: Partial<TransactionModel>
}

export type PredictPendingResponse = {
  success: boolean
  message: string
  processed: number
}

// Query Keys
export const predictionsKeys = {
  all: ['predictions'] as const,
  status: () => [...predictionsKeys.all, 'status'] as const,
}

// Queries
export const predictionsQueries = {
  /**
   * Obtenir le statut du modèle ML
   */
  getStatus: () =>
    useQuery<AxiosResponse<ModelStatusResponse>, Error>({
      queryKey: predictionsKeys.status(),
      queryFn: () => instance.get('/predict/status'),
      staleTime: 2 * 60 * 1000, // 2 minutes
    }),

  /**
   * Recharger le modèle ML
   */
  reloadModel: () => {
    const queryClient = useQueryClient()

    return useMutation<
      AxiosResponse<ReloadModelResponse>,
      Error,
      ReloadModelRequest | void
    >({
      mutationFn: (data = {}) => instance.post('/predict/reload', data),
      onSuccess: () => {
        // Invalider le statut pour forcer un refetch
        queryClient.invalidateQueries({ queryKey: predictionsKeys.status() })
      },
    })
  },

  /**
   * Prédire une transaction (données brutes)
   */
  predictTransaction: () =>
    useMutation<
      AxiosResponse<PredictTransactionResponse>,
      Error,
      PredictTransactionRequest
    >({
      mutationFn: (data) => instance.post('/predict/transaction', data),
    }),

  /**
   * Expliquer une prédiction (avec analyse de risque)
   */
  explainTransaction: () =>
    useMutation<
      AxiosResponse<ExplainTransactionResponse>,
      Error,
      PredictTransactionRequest
    >({
      mutationFn: (data) => instance.post('/predict/transaction/explain', data),
    }),

  /**
   * Prédiction en batch
   */
  predictBatch: () =>
    useMutation<
      AxiosResponse<BatchPredictionResponse>,
      Error,
      BatchPredictionRequest
    >({
      mutationFn: (data) => instance.post('/predict/batch', data),
    }),

  /**
   * Prédire une transaction existante (par ID)
   */
  predictExisting: () => {
    const queryClient = useQueryClient()

    return useMutation<AxiosResponse<PredictExistingResponse>, Error, number>({
      mutationFn: (id) => instance.post(`/predict/transaction/${id}`),
      onSuccess: () => {
        // Invalider les transactions pour refléter la mise à jour
        queryClient.invalidateQueries({ queryKey: ['transactions'] })
      },
    })
  },

  /**
   * Prédire toutes les transactions en attente
   */
  predictAllPending: () => {
    const queryClient = useQueryClient()

    return useMutation<AxiosResponse<PredictPendingResponse>, Error, void>({
      mutationFn: () => instance.post('/predict/transactions/pending'),
      onSuccess: () => {
        // Invalider les transactions
        queryClient.invalidateQueries({ queryKey: ['transactions'] })
      },
    })
  },
}
