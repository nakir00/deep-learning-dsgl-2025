import type {
  BatchPredictionResponse,
  ModelStatus,
  PredictTransactionRequest,
  PredictionResult,
  ReloadModelRequest,
  RiskAnalysis,
} from '@/api/queries/predictions'
import { predictionsQueries } from '@/api/queries/predictions'


export const usePredictions = () => {
  // Query
  const statusQuery = predictionsQueries.getStatus()

  // Mutations
  const reloadMutation = predictionsQueries.reloadModel()
  const predictMutation = predictionsQueries.predictTransaction()
  const explainMutation = predictionsQueries.explainTransaction()
  const batchMutation = predictionsQueries.predictBatch()
  const existingMutation = predictionsQueries.predictExisting()
  const pendingMutation = predictionsQueries.predictAllPending()

  /**
   * Recharger le modèle ML
   */
  const reloadModel = (
    paths?: ReloadModelRequest,
    onSuccess?: (data: { message: string; model: ModelStatus }) => void,
    onError?: (message: string) => void,
  ) => {
    reloadMutation.mutate(paths, {
      onSuccess({ data: response }) {
        if (response.success) {
          if (onSuccess) {
            onSuccess({
              message: response.message,
              model: response.model,
            })
          }
        }
      },
      onError(error) {
        const erreur: any = error
        if (onError) {
          const message =
            erreur?.response?.data?.message ||
            'Erreur lors du rechargement du modèle'
          onError(message)
        }
      },
    })
  }

  /**
   * Prédire une transaction
   */
  const predictTransaction = (
    data: PredictTransactionRequest,
    onSuccess?: (prediction: PredictionResult) => void,
    onError?: (message: string) => void,
  ) => {
    predictMutation.mutate(data, {
      onSuccess({ data: response }) {
        if (response.success) {
          if (onSuccess) {
            onSuccess(response.data)
          }
        }
      },
      onError(error) {
        const erreur: any = error
        if (onError) {
          const message =
            erreur?.response?.data?.message || 'Erreur lors de la prédiction'
          onError(message)
        }
      },
    })
  }

  /**
   * Expliquer une prédiction (avec analyse de risque)
   */
  const explainTransaction = (
    data: PredictTransactionRequest,
    onSuccess?: (result: {
      prediction: PredictionResult
      analysis: RiskAnalysis
    }) => void,
    onError?: (message: string) => void,
  ) => {
    explainMutation.mutate(data, {
      onSuccess({ data: response }) {
        if (response.success) {
          if (onSuccess) {
            onSuccess({
              prediction: response.prediction,
              analysis: response.analysis,
            })
          }
        }
      },
      onError(error) {
        const erreur: any = error
        if (onError) {
          const message =
            erreur?.response?.data?.message || "Erreur lors de l'analyse"
          onError(message)
        }
      },
    })
  }

  /**
   * Prédiction en batch
   */
  const predictBatch = (
    transactions: Array<PredictTransactionRequest>,
    onSuccess?: (result: BatchPredictionResponse) => void,
    onError?: (message: string) => void,
  ) => {
    batchMutation.mutate(
      { transactions },
      {
        onSuccess({ data: response }) {
          if (response.success) {
            if (onSuccess) {
              onSuccess(response)
            }
          }
        },
        onError(error) {
          const erreur: any = error
          if (onError) {
            const message =
              erreur?.response?.data?.message ||
              'Erreur lors de la prédiction batch'
            onError(message)
          }
        },
      },
    )
  }

  /**
   * Prédire une transaction existante (par ID)
   */
  const predictExisting = (
    transactionId: number,
    onSuccess?: (data: {
      message: string
      prediction: any
      transaction: any
    }) => void,
    onError?: (message: string) => void,
  ) => {
    existingMutation.mutate(transactionId, {
      onSuccess({ data: response }) {
        if (response.success) {
          if (onSuccess) {
            onSuccess({
              message: response.message,
              prediction: response.prediction,
              transaction: response.transaction,
            })
          }
        }
      },
      onError(error) {
        const erreur: any = error
        if (onError) {
          const message =
            erreur?.response?.data?.message || 'Erreur lors de la prédiction'
          onError(message)
        }
      },
    })
  }

  /**
   * Prédire toutes les transactions en attente
   */
  const predictAllPending = (
    onSuccess?: (data: { message: string; processed: number }) => void,
    onError?: (message: string) => void,
  ) => {
    pendingMutation.mutate(undefined, {
      onSuccess({ data: response }) {
        if (response.success) {
          if (onSuccess) {
            onSuccess({
              message: response.message,
              processed: response.processed,
            })
          }
        }
      },
      onError(error) {
        const erreur: any = error
        if (onError) {
          const message =
            erreur?.response?.data?.message ||
            'Erreur lors du traitement des transactions'
          onError(message)
        }
      },
    })
  }

  return {
    // État du modèle
    modelStatus: statusQuery.data?.data.model,
    isModelLoaded: statusQuery.data?.data.model.loaded === true,
    isLoadingStatus: statusQuery.isLoading,

    // Actions
    reloadModel,
    predictTransaction,
    explainTransaction,
    predictBatch,
    predictExisting,
    predictAllPending,
    refetchStatus: statusQuery.refetch,

    // États de chargement
    isReloading: reloadMutation.isPending,
    isPredicting: predictMutation.isPending,
    isExplaining: explainMutation.isPending,
    isPredictingBatch: batchMutation.isPending,
    isPredictingExisting: existingMutation.isPending,
    isPredictingPending: pendingMutation.isPending,
  }
}

export type UsePredictionsType = ReturnType<typeof usePredictions>
