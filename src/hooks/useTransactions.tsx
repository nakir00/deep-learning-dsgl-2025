import type {
  CreateTransactionRequest,
  PaginationParams,
  SearchParams,
  TransactionModel,  
  UpdateTransactionRequest,
} from '@/api/queries/transaction'

import { transactionsQueries } from '@/api/queries/transaction'


export const useTransactions = (params?: PaginationParams) => {
  // Queries
  const transactionsQuery = transactionsQueries.getTransactions(params)
  const myTransactionsQuery = transactionsQueries.getMyTransactions(params)
  const myStatsQuery = transactionsQueries.getMyStats()
  const statsQuery = transactionsQueries.getStats()
  const fraudQuery = transactionsQueries.getFraudTransactions(params)

  // Mutations
  const createMutation = transactionsQueries.createTransaction()
  const updateMutation = transactionsQueries.updateTransaction()
  const markFraudMutation = transactionsQueries.markAsFraud()
  const deleteMutation = transactionsQueries.deleteTransaction()

  /**
   * Créer une transaction
   */
  const createTransaction = (
    data: CreateTransactionRequest,
    onSuccess?: (response: { transaction: TransactionModel; message: string }) => void,
    onError?: (message: string) => void,
  ) => {
    createMutation.mutate(data, {
      onSuccess({data: response}) {
        if (response.success) {
          if (onSuccess) {
            onSuccess({
              transaction: response.data,
              message: response.message || 'Transaction créée avec succès',
            })
          }
        }
      },
      onError(error) {
        const erreur: any = error
        if (onError) {
          const message = erreur?.response?.data?.message || 'Erreur lors de la création'
          onError(message)
        }
      },
    })
  }

  /**
   * Mettre à jour une transaction
   */
  const updateTransaction = (
    id: number,
    data: UpdateTransactionRequest,
    onSuccess?: (response: { transaction: TransactionModel; message: string }) => void,
    onError?: (message: string) => void,
  ) => {
    updateMutation.mutate({ id, data }, {
      onSuccess({data: response}) {
        if (response.success) {
          if (onSuccess) {
            onSuccess({
              transaction: response.data,
              message: response.message || 'Transaction mise à jour',
            })
          }
        }
      },
      onError(error) {
        const erreur: any = error
        if (onError) {
          const message = erreur?.response?.data?.message || 'Erreur lors de la mise à jour'
          onError(message)
        }
      },
    })
  }

  /**
   * Marquer comme fraude/légitime
   */
  const markAsFraud = (
    id: number,
    isFraud: boolean,
    onSuccess?: (response: { transaction: TransactionModel; message: string }) => void,
    onError?: (message: string) => void,
  ) => {
    markFraudMutation.mutate({ id, is_fraud: isFraud }, {
      onSuccess({data: response}) {
        if (response.success) {
          if (onSuccess) {
            onSuccess({
              transaction: response.data,
              message: response.message || 'Statut mis à jour',
            })
          }
        }
      },
      onError(error) {
        const erreur: any = error
        if (onError) {
          const message = erreur?.response?.data?.message || 'Erreur lors du marquage'
          onError(message)
        }
      },
    })
  }

  /**
   * Supprimer une transaction
   */
  const deleteTransaction = (
    id: number,
    onSuccess?: (message: string) => void,
    onError?: (message: string) => void,
  ) => {
    deleteMutation.mutate(id, {
      onSuccess() {
        if (onSuccess) {
          onSuccess('Transaction supprimée')
        }
      },
      onError(error) {
        const erreur: any = error
        if (onError) {
          const message = erreur?.response?.data?.message || 'Erreur lors de la suppression'
          onError(message)
        }
      },
    })
  }

  /**
   * Rafraîchir les données
   */
  const refetchAll = () => {
    transactionsQuery.refetch()
    myTransactionsQuery.refetch()
    myStatsQuery.refetch()
    statsQuery.refetch()
  }

  return {
    // Données
    transactions: transactionsQuery.data?.data,
    myTransactions: myTransactionsQuery.data?.data,
    myStats: myStatsQuery.data?.data,
    stats: statsQuery.data?.data,
    fraudTransactions: fraudQuery.data?.data,

    // États de chargement
    isLoadingTransactions: transactionsQuery.isLoading,
    isLoadingMyTransactions: myTransactionsQuery.isLoading,
    isLoadingMyStats: myStatsQuery.isLoading,
    isLoadingStats: statsQuery.isLoading,
    isLoadingFraud: fraudQuery.isLoading,

    // États de fetching
    isFetchingTransactions: transactionsQuery.isFetching,
    isFetchingMyTransactions: myTransactionsQuery.isFetching,

    // États des mutations
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isMarkingFraud: markFraudMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Actions
    createTransaction,
    updateTransaction,
    markAsFraud,
    deleteTransaction,
    refetchAll,
    refetchTransactions: transactionsQuery.refetch,
    refetchMyTransactions: myTransactionsQuery.refetch,
    refetchStats: statsQuery.refetch,
  }
}

export type UseTransactionsType = ReturnType<typeof useTransactions>

// Hook pour une transaction spécifique
export const useTransaction = (id: number) => {
  const transactionQuery = transactionsQueries.getTransaction(id)
  const updateMutation = transactionsQueries.updateTransaction()
  const markFraudMutation = transactionsQueries.markAsFraud()
  const deleteMutation = transactionsQueries.deleteTransaction()

  const updateTransaction = (
    data: UpdateTransactionRequest,
    onSuccess?: (response: { transaction: TransactionModel; message: string }) => void,
    onError?: (message: string) => void,
  ) => {
    updateMutation.mutate({ id, data }, {
      onSuccess({data: response}) {
        if (response.success) {
          if (onSuccess) {
            onSuccess({
              transaction: response.data,
              message: response.message || 'Transaction mise à jour',
            })
          }
        }
      },
      onError(error) {
        const erreur: any = error
        if (onError) {
          const message = erreur?.response?.data?.message || 'Erreur'
          onError(message)
        }
      },
    })
  }

  const markAsFraud = (
    isFraud: boolean,
    onSuccess?: (response: { transaction: TransactionModel; message: string }) => void,
    onError?: (message: string) => void,
  ) => {
    markFraudMutation.mutate({ id, is_fraud: isFraud }, {
      onSuccess({data: response}) {
        if (response.success) {
          if (onSuccess) {
            onSuccess({
              transaction: response.data,
              message: response.message || 'Statut mis à jour',
            })
          }
        }
      },
      onError(error) {
        const erreur: any = error
        if (onError) {
          onError(erreur?.response?.data?.message || 'Erreur')
        }
      },
    })
  }

  const deleteTransaction = (
    onSuccess?: (message: string) => void,
    onError?: (message: string) => void,
  ) => {
    deleteMutation.mutate(id, {
      onSuccess(response) {
        if (onSuccess) {
          onSuccess(response.message || 'Transaction supprimée')
        }
      },
      onError(error) {
        const erreur: any = error
        if (onError) {
          onError(erreur?.response?.data?.message || 'Erreur')
        }
      },
    })
  }

  return {
    transaction: transactionQuery.data?.data,
    isLoading: transactionQuery.isLoading,
    isError: transactionQuery.isError,
    error: transactionQuery.error,
    
    updateTransaction,
    markAsFraud,
    deleteTransaction,
    refetch: transactionQuery.refetch,

    isUpdating: updateMutation.isPending,
    isMarkingFraud: markFraudMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}

// Hook pour recherche de transactions
export const useTransactionSearch = (params: SearchParams) => {
  const searchQuery = transactionsQueries.searchTransactions(params)

  return {
    results: searchQuery.data?.data,
    isLoading: searchQuery.isLoading,
    isFetching: searchQuery.isFetching,
    isError: searchQuery.isError,
    error: searchQuery.error,
    refetch: searchQuery.refetch,
  }
}

// Hook pour transactions par compte
export const useAccountTransactions = (accountNo: number, params?: PaginationParams) => {
  const accountQuery = transactionsQueries.getTransactionsByAccount(accountNo, params)

  return {
    transactions: accountQuery.data?.data,
    isLoading: accountQuery.isLoading,
    isFetching: accountQuery.isFetching,
    isError: accountQuery.isError,
    error: accountQuery.error,
    refetch: accountQuery.refetch,
  }
}