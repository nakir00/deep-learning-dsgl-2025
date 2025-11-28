// src/hooks/useImagePrediction.ts
import { imagePredictionQueries } from '@/api/queries/imagePrediction'

export const useImagePrediction = () => {
  const statusQuery = imagePredictionQueries.getModelStatus()
  const predict = imagePredictionQueries.predictImage()
  const predictBatch = imagePredictionQueries.predictBatch()
  const reload = imagePredictionQueries.reloadModel()

  return {
    // États
    isModelLoaded: statusQuery.data?.data.model.loaded ?? false,
    modelInfo: statusQuery.data?.data.model,

    // Chargements
    isStatusLoading: statusQuery.isLoading,
    isPredicting: predict.isPending,
    isBatchPredicting: predictBatch.isPending,

    // Actions
    predictImage: predict.mutate,
    predictBatch: predictBatch.mutate,
    reloadModel: reload.mutate,

    // Données
    lastPrediction: predict.data?.data,
  }
}