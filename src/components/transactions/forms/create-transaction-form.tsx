import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTransactions } from '@/hooks/useTransactions'

type Props = {
  onCreateTransaction?: () => void
}

const transactionSchema = z.object({
  gender: z.number().min(0).max(1, '0 = Homme, 1 = Femme'),
  age: z
    .number()
    .min(18, "L'âge minimum est 18 ans")
    .max(120, "L'âge maximum est 120 ans"),
  house_type_id: z.number().min(1, 'Type de maison requis'),
  contact_avaliability_id: z
    .number()
    .min(1, 'Disponibilité de contact requise'),
  home_country: z.number().min(1, "Pays d'origine requis"),
  account_no: z.number().min(1, 'Numéro de compte requis'),
  card_expiry_date: z.number().min(1, "Date d'expiration requise"),
  cif: z.number().min(1, 'CIF requis'),
  transaction_amount: z
    .number()
    .min(0.01, 'Le montant doit être supérieur à 0'),
  transaction_country: z.number().min(1, 'Pays de transaction requis'),
  transaction_currency_code: z.number().min(1, 'Code de devise requis'),
  large_purchase: z.number().min(0).max(1, '0 = Non, 1 = Oui'),
  product_id: z.number().min(1, 'Produit requis'),
})

type TransactionFormValues = z.infer<typeof transactionSchema>

const CreateTransactionForm = ({ onCreateTransaction }: Props) => {

  const { createTransaction, refetchAll } = useTransactions()

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      gender: 0,
      age: 30,
      house_type_id: 1,
      contact_avaliability_id: 1,
      home_country: 1,
      account_no: 0,
      card_expiry_date: 0,
      cif: 0,
      transaction_amount: 0,
      transaction_country: 1,
      transaction_currency_code: 1,
      large_purchase: 0,
      product_id: 1,
    },
  })

  const handleSubmit = (values: TransactionFormValues) => {
    // Exemple avec votre API
    
    createTransaction(values, 
      () => {
        toast.success('Transaction créée', {
          description: 'La transaction a été créée avec succès',
        })
        form.reset()
        if (onCreateTransaction) {
          onCreateTransaction()
        }
        refetchAll()
      },
      (errorMessage) => {
        toast.error('Erreur', {
          description:
            "Une erreur s'est produite lors de la création: " + errorMessage,
        })
      },
    )
   

    // Simulation pour l'exemple
    console.log('Création de transaction:', values)
    toast.success('Transaction créée', {
      description: 'La transaction a été créée avec succès',
    })
    form.reset()
    if (onCreateTransaction) {
      onCreateTransaction()
    }
  }

  return (
    <Form {...form}>
      <div onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Section Informations personnelles */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Informations personnelles
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genre</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le genre" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">Homme</SelectItem>
                      <SelectItem value="1">Femme</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Âge</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="30"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="house_type_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de maison</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="1"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    ID du type de maison
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_avaliability_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disponibilité contact</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="1"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    ID de disponibilité
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="home_country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pays d'origine</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="1"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Code pays d'origine
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Section Informations bancaires */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Informations bancaires
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="account_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro de compte</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="123456789"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="card_expiry_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date d'expiration carte</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="1225"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Format: MMAA (ex: 1225 pour 12/25)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cif"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CIF (Customer Information File)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="987654321"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Section Transaction */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Détails de la transaction
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="transaction_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant de la transaction</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="100.00"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transaction_country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pays de transaction</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="1"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Code du pays
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transaction_currency_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code devise</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="1"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Code de la devise (ex: 1=USD, 2=EUR)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="large_purchase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Achat important</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">Non</SelectItem>
                      <SelectItem value="1">Oui</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="product_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produit</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="1"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    ID du produit acheté
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            >
            Annuler
          </Button>
          <Button type="button" onClick={form.handleSubmit(handleSubmit)}>
            Créer la transaction
          </Button>
        </div>
      </div>
    </Form>
  )
}

export default CreateTransactionForm
