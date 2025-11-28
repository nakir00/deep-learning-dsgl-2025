import { useAuth } from './useAuth'
import type { UpdateProfileRequest } from '@/api/queries/profile'
import type { UserModel } from '@/api/queries/user'
import { profileQueries } from '@/api/queries/profile'

export const useProfile = () => {
  const { user: authUser, setUser } = useAuth()

  // Query pour récupérer le profil
  const profileQuery = profileQueries.getProfile()

  // Mutation pour mettre à jour le profil
  const updateMutation = profileQueries.updateProfile()

  /**
   * Récupérer le profil depuis le serveur
   */
  const fetchProfile = (
    onSuccess?: (data: UserModel) => void,
    onError?: (message: string) => void,
  ) => {
    profileQuery.refetch().then((result) => {
      if (result.isSuccess) {
        if (onSuccess) {
          onSuccess(result.data.data.data)
        }
      } else if (result.isError) {
        const erreur: any = result.error
        if (onError) {
          const message =
            erreur?.response?.data?.message ||
            'Erreur lors de la récupération du profil'
          onError(message)
        }
      }
    })
  }

  /**
   * Mettre à jour le profil
   */
  const updateProfile = (
    data: UpdateProfileRequest,
    onSuccess?: (data: { user: UserModel; message: string }) => void,
    onError?: (message: string) => void,
  ) => {
    updateMutation.mutate(data, {
      onSuccess({ data: response }) {
        if (response.success) {
          // Mettre à jour l'utilisateur dans le contexte auth
          setUser(response.data)

          if (onSuccess) {
            onSuccess({
              user: response.data,
              message: response.message,
            })
          }
        }
      },
      onError(error) {
        const erreur: any = error
        if (onError) {
          const message =
            erreur?.response?.data?.message ||
            'Erreur lors de la mise à jour du profil'
          onError(message)
        }
      },
    })
  }

  // Utiliser les données du cache ou de l'auth context
  const user = profileQuery.data?.data.data || authUser

  return {
    // État
    user,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,

    // Actions
    fetchProfile,
    updateProfile,
    refetchProfile: profileQuery.refetch,

    // États de chargement
    isFetching: profileQuery.isFetching,
    isUpdating: updateMutation.isPending,
  }
}
