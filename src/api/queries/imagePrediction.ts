// src/api/queries/imagePrediction.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { instance } from '../api'
import type { AxiosResponse } from 'axios'

// ========================
// TYPES (basés sur tes réponses Postman réelles)
// ========================

export type ImageModelInfo = {
  loaded: boolean
  model_type: string
  input_shape: string
  output_shape: string
  path: string
}

export type ImageModelStatusResponse = {
  success: boolean
  model: ImageModelInfo
}

export type ImageReloadResponse = {
  success: boolean
  message: string
  model: ImageModelInfo
}

export type ImagePredictionResult = {
  success: boolean
  prediction: number
  class: 'parasited' | 'uninfected'
  confidence: number
  threshold: number
  probabilities: {
    happy: number
    sad: number
  }
}

export type ImagePredictResponse = {
  success: boolean
  data: ImagePredictionResult
  filename: string
  file_size: number
}

// Batch (quand tu envoies plusieurs fichiers via form-data "images[]")
export type BatchImageResult = ImagePredictionResult & {
  index: number
  filename: string
}

export type BatchImageResponse = {
  success: boolean
  total: number
  sad_count: number
  happy_count: number
  predictions: Array<BatchImageResult>
}

// ========================
// QUERY KEYS
// ========================

export const imagePredictionKeys = {
  all: ['image-prediction'] as const,
  status: () => [...imagePredictionKeys.all, 'status'] as const,
}

// ========================
// QUERIES & MUTATIONS
// ========================

export const imagePredictionQueries = {
  /**
   * Vérifier le statut du modèle d'images (Happy/Sad)
   *
 200 → { success: true, model: { loaded: true, ... } }
   */
  getModelStatus: () =>
    useQuery<AxiosResponse<ImageModelStatusResponse>, Error>({
      queryKey: imagePredictionKeys.status(),
      queryFn: () => instance.get('/predict/image/status'),
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchInterval: 30_000, // toutes les 30s en arrière-plan
    }),

  /**
   * Recharger le modèle d'images
   POST /predict/image/reload
   Body: { "model_path": "./ml/imageclassifier.h5" }
   */
  reloadModel: () => {
    const queryClient = useQueryClient()

    return useMutation<
      AxiosResponse<ImageReloadResponse>,
      Error,
      { model_path?: string }
    >({
      mutationFn: (data = { model_path: './ml/imageclassifier.h5' }) =>
        instance.post('/predict/image/reload', data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: imagePredictionKeys.status() })
      },
    })
  },

  /**
   * Prédire une seule image (upload fichier)
   POST /predict/image/predict
   FormData: image (file) + threshold (optionnel)
   */
  predictImage: () =>
    useMutation<
      AxiosResponse<ImagePredictResponse>,
      Error,
      { image: File; threshold?: number }
    >({
      mutationFn: ({ image, threshold = 0.5 }) => {
        const formData = new FormData()
        formData.append('image', image)
        if (threshold !== 0.5) {
          formData.append('threshold', threshold.toString())
        }

        return instance.post('/predict/image/predict', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      },
    }),

  /**
   * Prédiction en batch (plusieurs images)
   POST /predict/image/predict/batch
   FormData: images[] (multiple files) + threshold
   */
  predictBatch: () =>
    useMutation<
      AxiosResponse<BatchImageResponse>,
      Error,
      { images: Array<File>; threshold?: number }
    >({
      mutationFn: ({ images, threshold = 0.5 }) => {
        const formData = new FormData()
        images.forEach((file) => {
          formData.append('images', file) // clé "images" répétée → Flask lit avec request.files.getlist('images')
        })
        formData.append('threshold', threshold.toString())

        return instance.post('/predict/image/predict/batch', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      },
    }),

  /**
   * Prédire depuis un chemin fichier sur le serveur (débug)
   POST /predict/image/predict/file
   Body: { "path": "/tmp/monimage.jpg" }
   */
  predictFromPath: () =>
    useMutation<
      AxiosResponse<ImagePredictResponse>,
      Error,
      { path: string; threshold?: number }
    >({
      mutationFn: ({ path, threshold = 0.5 }) =>
        instance.post('/predict/image/predict/file', { path, threshold }),
    }),
}