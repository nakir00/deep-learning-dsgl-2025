// TransactionsList.tsx
import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  TrendingUp,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

import type { TransactionModel } from '@/api/queries/transaction'
import { Button } from '@/components/ui/button'

import { Badge } from '@/components/ui/badge'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { useTransactions } from '@/hooks/useTransactions'

type Props = {
  title?: string
  showPagination?: boolean
  perPage?: number
  onTransactionClick?: (transaction: TransactionModel) => void
}

export const TransactionsList = ({
  title = 'Mes Transactions',
  showPagination = true,
  perPage = 10,
  onTransactionClick,
}: Props) => {
  const [currentPage, setCurrentPage] = useState(1)

  const { myTransactions, isLoadingTransactions } = useTransactions({
    page: currentPage,
    per_page: perPage,
  })

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: fr,
      })
    } catch {
      return dateString
    }
  }

  // Fonction pour formater le montant
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(amount)
  }

  // Fonction pour obtenir la couleur du badge de prédiction
  const getPredictionBadge = (transaction: TransactionModel) => {
    if (transaction.prediction === null) {
      return (
        <Badge variant="outline" className="gap-1">
          <Loader2 className="w-3 h-3 animate-spin" />
          En attente
        </Badge>
      )
    }

    const isFraud = transaction.prediction === 1
    const proba = transaction.prediction_proba || 0

    return (
      <Badge variant={isFraud ? 'destructive' : 'default'} className="gap-1">
        {isFraud ? (
          <>
            <AlertTriangle className="w-3 h-3" />
            Fraude {(proba * 100).toFixed(1)}%
          </>
        ) : (
          <>
            <CheckCircle2 className="w-3 h-3" />
            Légitime {(proba * 100).toFixed(1)}%
          </>
        )}
      </Badge>
    )
  }

  // Fonction pour obtenir le badge du statut réel
  const getActualStatusBadge = (potentialFraud: number) => {
    return potentialFraud === 1 ? (
      <Badge variant="destructive" className="text-xs">
        Frauduleuse
      </Badge>
    ) : (
      <Badge variant="secondary" className="text-xs">
        Légitime
      </Badge>
    )
  }

  const handlePageChange = (newPage: number) => {
    if (myTransactions?.pagination) {
      const { pages } = myTransactions.pagination
      if (newPage >= 1 && newPage <= pages) {
        setCurrentPage(newPage)
      }
    }
  }

  if (isLoadingTransactions) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (!myTransactions || myTransactions.data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-10 text-muted-foreground">
          Aucune transaction trouvée
        </CardContent>
      </Card>
    )
  }

  const { data: transactions, pagination, count } = myTransactions

  return (
    <div className="divide-y">
      {transactions.map((trx) => (
        <div
          key={trx.id}
          onClick={() => onTransactionClick?.(trx)}
          className="hover:bg-accent hover:cursor-pointer transition-colors p-4"
        >
          <Link to={`/dashboard/transaction/$transactionId`} params={{ transactionId: trx.id.toString()}} className="flex items-start justify-between gap-4">
            {/* Colonne gauche : Infos principales */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono text-muted-foreground">
                  #{trx.id}
                </span>
                {getPredictionBadge(trx)}
                {getActualStatusBadge(trx.potential_fraud)}
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold">
                    {formatAmount(trx.transaction_amount)}
                  </span>
                </div>
                <div className="text-muted-foreground">
                  Compte: {trx.account_no}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(trx.updated_at)}
              </div>
            </div>

          </Link>
        </div>
      ))}
      {showPagination && pagination.pages > 1 && (
        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Page {pagination.page} sur {pagination.pages}
              <span className="ml-2">
                ({count} résultat{count > 1 ? 's' : ''})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(1)}
                disabled={!pagination.has_prev}
              >
                <ChevronsLeft className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.has_prev}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="flex items-center gap-1 min-w-[100px] justify-center">
                {Array.from(
                  { length: Math.min(5, pagination.pages) },
                  (_, i) => {
                    // Logique pour afficher 5 pages autour de la page actuelle
                    let pageNum
                    if (pagination.pages <= 5) {
                      pageNum = i + 1
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1
                    } else if (pagination.page >= pagination.pages - 2) {
                      pageNum = pagination.pages - 4 + i
                    } else {
                      pageNum = pagination.page - 2 + i
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          pagination.page === pageNum ? 'default' : 'ghost'
                        }
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    )
                  },
                )}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.has_next}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(pagination.pages)}
                disabled={!pagination.has_next}
              >
                <ChevronsRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TransactionsList
