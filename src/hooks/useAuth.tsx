import { createContext, useContext } from 'react'
import { useLocalStorage } from './useLocalStorage'
import type { ReactNode } from 'react'
import type { ChangePasswordRequest, LoginRequest,  RegisterRequest ,UserModel} from '@/api/queries/user'
import { authQueries } from '@/api/queries/user'

export type AuthTokens = {
  access_token: string
  refresh_token: string
}

export type AuthContextType = {
  user: UserModel | undefined
  tokens: AuthTokens | undefined
  setUser: (user: UserModel | undefined) => void
  setTokens: (tokens: AuthTokens | undefined) => void
  removeUser: () => void
  removeTokens: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useLocalStorage<UserModel | undefined>('user', undefined)
  const [tokens, setTokens] = useLocalStorage<AuthTokens | undefined>('auth_tokens', undefined)

  const removeUser = () => {
    localStorage.removeItem('user')
    setUser(undefined)
  }

  const removeTokens = () => {
    localStorage.removeItem('auth_tokens')
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setTokens(undefined)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        setUser,
        setTokens,
        removeUser,
        removeTokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const authData = useContext(AuthContext)
  
  if (authData === undefined) {
    throw new Error('useAuth must be used within AuthContextProvider')
  }

  const loginMutation = authQueries.login()
  const registerMutation = authQueries.register()
  const logoutMutation = authQueries.logout()
  const refreshMutation = authQueries.refresh()
  const changePasswordMutation = authQueries.changePassword()

  /**
   * Connexion de l'utilisateur
   */
  const login = (
    credentials: LoginRequest,
    onSuccess?: (data: { user: UserModel; tokens: AuthTokens }) => void,
    onError?: (message: string) => void,
  ) => {
    loginMutation.mutate(credentials, {
      onSuccess({data:response}) {
        if (response.success) {
          const { user, access_token, refresh_token } = response.data

          // Stocker l'utilisateur et les tokens
          authData.setUser(user)
          authData.setTokens({ access_token, refresh_token })

          // Stocker aussi dans localStorage pour compatibilité
          localStorage.setItem('access_token', access_token)
          localStorage.setItem('refresh_token', refresh_token)

          if (onSuccess) {
            onSuccess({
              user,
              tokens: { access_token, refresh_token },
            })
          }
        }
      },
      onError(error) {
        const erreur: any = error
        if (onError) {
          const message = erreur?.response?.data?.message || 'Erreur de connexion'
          onError(message)
        }
      },
    })
  }

  /**
   * Inscription d'un nouvel utilisateur
   */
  const register = (
    userData: RegisterRequest,
    onSuccess?: (data: { user: UserModel }) => void,
    onError?: (message: string) => void,
  ) => {
    registerMutation.mutate(userData, {
      onSuccess({data: response}) {
        if (response.success) {
          authData.setUser(response.data)

          if (onSuccess) {
            onSuccess({ user: response.data })
          }
        }
      },
      onError(error) {
        const erreur = error as any
        if (onError) {
          const message = erreur?.response?.data?.message || "Erreur d'inscription"
          onError(message)
        }
      },
    })
  }

  /**
   * Déconnexion de l'utilisateur
   */
  const logout = (
    onSuccess?: (message: string) => void,
    onError?: (message: string) => void,
  ) => {
    logoutMutation.mutate(undefined, {
      onSuccess({data: response}) {
        // Nettoyer toutes les données
        authData.removeUser()
        authData.removeTokens()

        if (onSuccess) {
          const message = response.message || 'Déconnexion réussie'
          onSuccess(message)
        }
      },
      onError(error) {
        // Même en cas d'erreur, on nettoie localement
        authData.removeUser()
        authData.removeTokens()

        const erreur: any = error
        if (onError) {
          const message = erreur?.response?.data?.message || 'Erreur de déconnexion'
          onError(message)
        }
      },
    })
  }

  /**
   * Rafraîchir le token d'accès
   */
  const refreshToken = (
    onSuccess?: (data: { access_token: string }) => void,
    onError?: (message: string) => void,
  ) => {
    refreshMutation.mutate(undefined, {
      onSuccess({data: response}) {
        if (response.success) {
          const { access_token } = response.data

          // Mettre à jour uniquement l'access_token
          if (authData.tokens) {
            authData.setTokens({
              ...authData.tokens,
              access_token,
            })
          }

          localStorage.setItem('access_token', access_token)

          if (onSuccess) {
            onSuccess({ access_token })
          }
        }
      },
      onError(error) {
        const erreur: any = error
        if (onError) {
          const message = erreur?.response?.data?.message || 'Erreur de rafraîchissement du token'
          onError(message)
        }
      },
    })
  }

  /**
   * Changer le mot de passe
   */
  const changePassword = (
    passwords: ChangePasswordRequest,
    onSuccess?: (message: string) => void,
    onError?: (message: string) => void,
  ) => {
    changePasswordMutation.mutate(passwords, {
      onSuccess({ message }) {
        if (onSuccess) {
          const successMessage = message || 'Mot de passe modifié avec succès'
          onSuccess(successMessage)
        }
      },
      onError(error) {
        const erreur: any = error
        if (onError) {
          const message = erreur?.response?.data?.message || 'Erreur lors du changement de mot de passe'
          onError(message)
        }
      },
    })
  }

  /**
   * Vérifier si l'utilisateur est authentifié
   */
  const isAuthenticated = (): boolean => {
    return !!(authData.user && authData.tokens?.access_token)
  }

  /**
   * Obtenir le token d'accès
   */
  const getAccessToken = (): string | null => {
    return authData.tokens?.access_token || localStorage.getItem('access_token')
  }

  /**
   * Obtenir le refresh token
   */
  const getRefreshToken = (): string | null => {
    return authData.tokens?.refresh_token || localStorage.getItem('refresh_token')
  }

  const getCurrentUser = (): UserModel | undefined  => {
    return localStorage.getItem('user') === null ? undefined : JSON.parse(localStorage.getItem('user') as string)
  }

  return {
    // État
    user: getCurrentUser(),
    tokens: authData.tokens,
    isAuthenticated: isAuthenticated(),

    // Actions
    login,
    register,
    logout,
    refreshToken,
    changePassword,

    // Utilitaires
    getAccessToken,
    getRefreshToken,
    setUser: authData.setUser,
    setTokens: authData.setTokens,
    removeUser: authData.removeUser,
    removeTokens: authData.removeTokens,
    // États de chargement
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isRefreshing: refreshMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
  }
}

export type UseAuthType = ReturnType<typeof useAuth>