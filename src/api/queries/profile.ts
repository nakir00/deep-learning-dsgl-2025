import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { instance } from '../api'
import type { UserModel } from './user'
import type { AxiosResponse } from 'axios'

// Types
export type UpdateProfileRequest = {
  first_name?: string
  last_name?: string
  username?: string
}

export type ProfileResponse = {
  success: boolean
  data: UserModel
}

export type UpdateProfileResponse = {
  success: boolean
  message: string
  data: UserModel
}

// Query Keys
export const profileKeys = {
  all: ['profile'] as const,
  detail: () => [...profileKeys.all, 'detail'] as const,
}

// Queries
export const profileQueries = {
  /**
   * Récupérer le profil de l'utilisateur connecté
   */
  getProfile: () =>
    useQuery<AxiosResponse<ProfileResponse>, Error>({
      queryKey: profileKeys.detail(),
      queryFn: () => instance.get('/auth/me'),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    }),

  /**
   * Mettre à jour le profil
   */
  updateProfile: () => {
    const queryClient = useQueryClient()
    
    return useMutation<AxiosResponse<UpdateProfileResponse>, Error, UpdateProfileRequest>({
      mutationFn: (data) => instance.put('/auth/me', data),
      onSuccess: ({data}) => {
        // Invalider et mettre à jour le cache du profil
        queryClient.setQueryData(profileKeys.detail(), {
          success: true,
          data: data.data,
        })
        // Optionnel: invalider pour forcer un refetch
        queryClient.invalidateQueries({ queryKey: profileKeys.detail() })
      },
    })
  },
}
