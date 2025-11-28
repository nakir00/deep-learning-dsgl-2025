import { useMutation } from "@tanstack/react-query";
import { instance } from "../api";
import type { AxiosResponse } from "axios";

// Types basés sur la documentation Postman
export type UserModel = {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  created_at: string;
  last_login: string | null;
};

export type RegisterRequest = {
  email: string;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
    user: UserModel;
  };
};

export type RegisterResponse = {
  success: boolean;
  message: string;
  data: UserModel;
};

export type RefreshResponse = {
  success: boolean;
  data: {
    access_token: string;
  };
};

export type ChangePasswordRequest = {
  current_password: string;
  new_password: string;
};

export type LogoutResponse = {
  success: boolean;
  message: string;
};

// Queries d'authentification
export const authQueries = {
  // Inscription d'un nouvel utilisateur
  register: () =>
    useMutation<AxiosResponse<RegisterResponse>, Error, RegisterRequest>({
      mutationFn: (userData) =>
        instance.post<RegisterResponse>("/auth/register", userData),
    }),

  // Connexion
  login: () =>
    useMutation<AxiosResponse<LoginResponse>, Error, LoginRequest>({
      mutationFn: (credentials) =>
        instance.post<LoginResponse>("/auth/login", credentials),
      onSuccess: ({data}) => {
        
        // Stocker les tokens après connexion réussie
        if (data.data.access_token) {
          localStorage.setItem("access_token", data.data.access_token);
        }
        if (data.data.refresh_token) {
          localStorage.setItem("refresh_token", data.data.refresh_token);
        }
        // Stocker les infos utilisateur
        localStorage.setItem("user", JSON.stringify(data.data.user));
      },
    }),

  // Rafraîchir le token d'accès
  refresh: () =>
    useMutation<AxiosResponse<RefreshResponse>, Error, void>({
      mutationFn: () => {
        const refreshToken = localStorage.getItem("refresh_token");
        return instance.post("/auth/refresh", undefined, {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        });
      },
      onSuccess: ({data}) => {
        // Mettre à jour le token d'accès
        if (data.data.access_token) {
          localStorage.setItem("access_token", data.data.access_token);
        }
      },
    }),

  // Déconnexion
  logout: () =>
    useMutation<AxiosResponse<LogoutResponse>, Error, void>({
      mutationFn: () => instance.post("/auth/logout"),
      onSuccess: () => {
        // Supprimer les tokens et les infos utilisateur
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
      },
    }),

  // Changer le mot de passe
  changePassword: () =>
    useMutation<
      { success: boolean; message: string },
      Error,
      ChangePasswordRequest
    >({
      mutationFn: (passwords) =>
        instance.post("/auth/change-password", passwords),
    }),
};

// Hook utilitaire pour obtenir l'utilisateur courant
export const useCurrentUser = (): UserModel | null => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

// Hook utilitaire pour vérifier l'authentification
export const useIsAuthenticated = (): boolean => {
  const accessToken = localStorage.getItem("access_token");
  return !!accessToken;
};

// Fonction utilitaire pour obtenir le token d'accès
export const getAccessToken = (): string | null => {
  return localStorage.getItem("access_token");
};

// Fonction utilitaire pour obtenir le refresh token
export const getRefreshToken = (): string | null => {
  return localStorage.getItem("refresh_token");
};
