import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const LoginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'L\'email est obligatoire' })
    .email({ message: 'Email invalide' }),
  password: z
    .string()
    .min(1, { message: 'Le mot de passe est obligatoire' }),
  rememberMe: z.boolean().default(false).optional(),
})

export type LoginFormType = z.infer<typeof LoginSchema>

interface LoginFormProps {
  onSubmit: (values: LoginFormType) => void
  isLoading?: boolean
  defaultValues?: Partial<LoginFormType>
}

export function LoginForm({ 
  onSubmit, 
  isLoading = false,
  defaultValues 
}: LoginFormProps) {
  const form = useForm<LoginFormType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: defaultValues?.email || '',
      password: '',
      rememberMe: defaultValues?.rememberMe || false,
    },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  type="email"
                  placeholder="ex: naby@mbaye.com" 
                  {...field}
                  disabled={isLoading}
                  autoComplete="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Mot de passe */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="••••••••"
                  {...field}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        

        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Connexion en cours...' : 'Se connecter'}
        </Button>
      </form>
    </Form>
  )
}
