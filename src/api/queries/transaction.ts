import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instance } from "../api";
import type { AxiosResponse } from "axios";

// Types
export type TransactionModel = {
  id: number;
  user_id: number;
  gender: number;
  age: number;
  house_type_id: number;
  contact_avaliability_id: number;
  home_country: number;
  account_no: number;
  card_expiry_date: number;
  cif: number;
  transaction_amount: number;
  transaction_country: number;
  transaction_currency_code: number;
  large_purchase: number;
  product_id: number;
  potential_fraud: number;
  prediction: number | null;
  prediction_proba: number | null;
  created_at: string;
  updated_at: string;
};

export type CreateTransactionRequest = Omit<
  TransactionModel,
  | "id"
  | "user_id"
  | "potential_fraud"
  | "prediction"
  | "prediction_proba"
  | "created_at"
  | "updated_at"
>;

export type UpdateTransactionRequest = Partial<CreateTransactionRequest>;

export type PaginationParams = {
  page?: number;
  per_page?: number;
};

export type PaginationMeta = {
  page: number;
  pages: number;
  per_page: number;
  total: number;
  has_next: boolean;
  has_prev: boolean;
};

export type TransactionsListResponse = {
  success: boolean;
  data: Array<TransactionModel>;
  count: number;
  pagination: PaginationMeta;
};

export type TransactionResponse = {
  success: boolean;
  data: TransactionModel;
  message?: string;
};

export type TransactionStats = {
  total_transactions: number;
  total_amount: number;
  average_amount: number;
  max_amount: number;
  fraudulent: number;
  legitimate: number;
  fraud_rate: number;
};

export type TransactionStatsResponse = {
  success: boolean;
  stats: TransactionStats;
};

export type SearchParams = PaginationParams & {
  min_amount?: number;
  max_amount?: number;
};

export type SearchResponse = TransactionsListResponse & {
  filters: {
    min_amount: number;
    max_amount: number;
  };
};

export type AccountTransactionsResponse = TransactionsListResponse & {
  account_no: number;
};

export type MarkFraudRequest = {
  is_fraud: boolean;
};

// Query Keys
export const transactionsKeys = {
  all: ["transactions"] as const,
  lists: () => [...transactionsKeys.all, "list"] as const,
  list: (params?: PaginationParams) =>
    [...transactionsKeys.lists(), params] as const,
  myTransactions: (params?: PaginationParams) =>
    [...transactionsKeys.all, "my", params] as const,
  myStats: () => [...transactionsKeys.all, "my", "stats"] as const,
  fraud: (params?: PaginationParams) =>
    [...transactionsKeys.all, "fraud", params] as const,
  byAccount: (accountNo: number, params?: PaginationParams) =>
    [...transactionsKeys.all, "account", accountNo, params] as const,
  detail: (id: number) => [...transactionsKeys.all, "detail", id] as const,
  stats: () => [...transactionsKeys.all, "stats"] as const,
  search: (params: SearchParams) =>
    [...transactionsKeys.all, "search", params] as const,
};

// Queries
export const transactionsQueries = {
  /**
   * Liste de toutes les transactions (paginée)
   */
  getTransactions: (params?: PaginationParams) =>
    useQuery<AxiosResponse<TransactionsListResponse>, Error>({
      queryKey: transactionsKeys.list(params),
      queryFn: () => instance.get("/transactions", { params }),
      staleTime: 30 * 1000, // 30 secondes
    }),

  /**
   * Mes transactions (paginées)
   */
  getMyTransactions: (params?: PaginationParams) =>
    useQuery<AxiosResponse<TransactionsListResponse>, Error>({
      queryKey: transactionsKeys.myTransactions(params),
      queryFn: () => instance.get("/transactions/my", { params }),
      staleTime: 30 * 1000,
    }),

  /**
   * Statistiques de mes transactions
   */
  getMyStats: () =>
    useQuery<AxiosResponse<TransactionStatsResponse>, Error>({
      queryKey: transactionsKeys.myStats(),
      queryFn: () => instance.get("/transactions/my/stats"),
      staleTime: 60 * 1000, // 1 minute
    }),

  /**
   * Détails d'une transaction
   */
  getTransaction: (id: number) =>
    useQuery<AxiosResponse<TransactionResponse>, Error>({
      queryKey: transactionsKeys.detail(id),
      queryFn: () => instance.get(`/transactions/${id}`),
      enabled: !!id,
    }),

  /**
   * Transactions frauduleuses (paginées)
   */
  getFraudTransactions: (params?: PaginationParams) =>
    useQuery<AxiosResponse<TransactionsListResponse>, Error>({
      queryKey: transactionsKeys.fraud(params),
      queryFn: () => instance.get("/transactions/fraud", { params }),
      staleTime: 30 * 1000,
    }),

  /**
   * Transactions par compte (paginées)
   */
  getTransactionsByAccount: (accountNo: number, params?: PaginationParams) =>
    useQuery<AxiosResponse<AccountTransactionsResponse>, Error>({
      queryKey: transactionsKeys.byAccount(accountNo, params),
      queryFn: () =>
        instance.get(`/transactions/account/${accountNo}`, { params }),
      enabled: !!accountNo,
    }),

  /**
   * Statistiques globales des transactions
   */
  getStats: () =>
    useQuery<AxiosResponse<TransactionStatsResponse>, Error>({
      queryKey: transactionsKeys.stats(),
      queryFn: () => instance.get("/transactions/stats"),
      staleTime: 60 * 1000,
    }),

  /**
   * Rechercher des transactions par montant
   */
  searchTransactions: (params: SearchParams) =>
    useQuery<AxiosResponse<SearchResponse>, Error>({
      queryKey: transactionsKeys.search(params),
      queryFn: () => instance.get("/transactions/search", { params }),
      enabled:
        params.min_amount !== undefined || params.max_amount !== undefined,
    }),

  /**
   * Créer une transaction
   */
  createTransaction: () => {
    const queryClient = useQueryClient();

    return useMutation<AxiosResponse<TransactionResponse>, Error, CreateTransactionRequest>({
      mutationFn: (data) => instance.post("/transactions", data),
      onSuccess: () => {
        // Invalider les listes de transactions
        queryClient.invalidateQueries({ queryKey: transactionsKeys.lists() });
        queryClient.invalidateQueries({
          queryKey: transactionsKeys.myTransactions(),
        });
        queryClient.invalidateQueries({ queryKey: transactionsKeys.myStats() });
        queryClient.invalidateQueries({ queryKey: transactionsKeys.stats() });
      },
    });
  },

  /**
   * Mettre à jour une transaction
   */
  updateTransaction: () => {
    const queryClient = useQueryClient();

    return useMutation<
      AxiosResponse<TransactionResponse>,
      Error,
      { id: number; data: UpdateTransactionRequest }
    >({
      mutationFn: ({ id, data }) => instance.put(`/transactions/${id}`, data),
      onSuccess: ({data}, { id }) => {
        // Mettre à jour le cache de détail
        queryClient.setQueryData(transactionsKeys.detail(id), data);
        // Invalider les listes
        queryClient.invalidateQueries({ queryKey: transactionsKeys.lists() });
        queryClient.invalidateQueries({
          queryKey: transactionsKeys.myTransactions(),
        });
      },
    });
  },

  /**
   * Marquer une transaction comme fraude/légitime
   */
  markAsFraud: () => {
    const queryClient = useQueryClient();

    return useMutation<
      AxiosResponse<TransactionResponse>,
      Error,
      { id: number; is_fraud: boolean }
    >({
      mutationFn: ({ id, is_fraud }) =>
        instance.post(`/transactions/${id}/mark-fraud`, { is_fraud }),
      onSuccess: ({data}, { id }) => {
        queryClient.setQueryData(transactionsKeys.detail(id), data);
        queryClient.invalidateQueries({ queryKey: transactionsKeys.fraud() });
        queryClient.invalidateQueries({ queryKey: transactionsKeys.lists() });
        queryClient.invalidateQueries({
          queryKey: transactionsKeys.myTransactions(),
        });
        queryClient.invalidateQueries({ queryKey: transactionsKeys.stats() });
      },
    });
  },

  /**
   * Supprimer une transaction
   */
  deleteTransaction: () => {
    const queryClient = useQueryClient();

    return useMutation<{ success: boolean; message: string }, Error, number>({
      mutationFn: (id) => instance.delete(`/transactions/${id}`),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: transactionsKeys.lists() });
        queryClient.invalidateQueries({
          queryKey: transactionsKeys.myTransactions(),
        });
        queryClient.invalidateQueries({ queryKey: transactionsKeys.stats() });
        queryClient.invalidateQueries({ queryKey: transactionsKeys.myStats() });
      },
    });
  },
};
