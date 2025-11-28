// src/hooks/useSystem.ts
import type {
  HealthResponse,
  ModelStatusResponse,
  PresentationResponse,
} from '@/api/queries/system'
import { systemQueries } from '@/api/queries/system'

export const useSystem = () => {
  // Queries
  const presentationQuery = systemQueries.getPresentation()
  const healthQuery = systemQueries.getHealth()
  const modelStatusQuery = systemQueries.getModelStatus()

  // === Helpers basés sur les réponses réelles ===
  const healthData = healthQuery.data?.data
  const modelStatusData = modelStatusQuery.data?.data

  const isFraudModelLoaded = modelStatusData?.fraud_model.loaded === true
  const isImageModelLoaded = modelStatusData?.image_model.loaded === true

  const isFraudModelReady = healthData?.models.fraud_detection.status === 'ready'
  const isImageModelReady = healthData?.models.image_classification.status === 'ready'

  // === Actions manuelles (refetch avec callbacks) ===
  const fetchPresentation = (
    onSuccess?: (data: PresentationResponse) => void,
    onError?: (message: string) => void,
  ) => {
    presentationQuery.refetch().then((result) => {
      if (result.isSuccess ) {
        onSuccess?.(result.data.data)
      } else if (result.isError) {
        const err: any = result.error
        const message = err?.response?.data?.message || 'Erreur présentation'
        onError?.(message)
      }
    })
  }

  const checkHealth = (
    onSuccess?: (data: HealthResponse) => void,
    onError?: (message: string) => void,
  ) => {
    healthQuery.refetch().then((result) => {
      if (result.isSuccess) {
        onSuccess?.(result.data.data)
      } else if (result.isError) {
        const err: any = result.error
        const message = err?.response?.data?.message || 'Erreur santé API'
        onError?.(message)
      }
    })
  }

  const fetchModelStatus = (
    onSuccess?: (data: ModelStatusResponse) => void,
    onError?: (message: string) => void,
  ) => {
    modelStatusQuery.refetch().then((result) => {
      if (result.isSuccess) {
        onSuccess?.(result.data.data)
      } else if (result.isError) {
        const err: any = result.error
        const message = err?.response?.data?.message || 'Erreur statut modèle'
        onError?.(message)
      }
    })
  }

  return {
    // === Données brutes ===
    presentation: presentationQuery.data?.data,
    health: healthData,
    modelStatus: modelStatusData,

    // === États de chargement ===
    isPresentationLoading: presentationQuery.isLoading,
    isHealthLoading: healthQuery.isLoading,
    isModelStatusLoading: modelStatusQuery.isLoading,

    isPresentationFetching: presentationQuery.isFetching,
    isHealthFetching: healthQuery.isFetching,
    isModelStatusFetching: modelStatusQuery.isFetching,

    // === États d'erreur ===
    isPresentationError: presentationQuery.isError,
    isHealthError: healthQuery.isError,
    isModelStatusError: modelStatusQuery.isError,

    presentationError: presentationQuery.error,
    healthError: healthQuery.error,
    modelStatusError: modelStatusQuery.error,

    // === Actions manuelles ===
    fetchPresentation,
    checkHealth,
    fetchModelStatus,
    refetchPresentation: presentationQuery.refetch,
    refetchHealth: healthQuery.refetch,
    refetchModelStatus: modelStatusQuery.refetch,

    // === Helpers intelligents (les plus utiles dans ton app) ===
    isApiHealthy: healthData?.status === 'healthy',
    isDatabaseConnected: healthData?.database.status === 'success',

    // Modèle de fraude
    isFraudModelLoaded,
    isFraudModelReady,
    fraudModelInfo: modelStatusData?.fraud_model,

    // Modèle d'images (Happy/Sad)
    isImageModelLoaded,
    isImageModelReady,
    imageModelInfo: modelStatusData?.image_model,

    // Version globale
    apiVersion:
      presentationQuery.data?.data.version ||
      healthData?.api.version ||
      'inconnue',

    // Chemins utiles
    modelPaths: {
      fraud: modelStatusData?.fraud_model.paths,
      image: modelStatusData?.image_model.path
        ? { model: modelStatusData.image_model.path }
        : undefined,
    },
  }
}

export type UseSystemType = ReturnType<typeof useSystem>