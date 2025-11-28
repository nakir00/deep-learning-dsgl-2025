import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const RegisterSchema = z
  .object({
    username: z
      .string()
      .min(3, {
        message: "Le nom d'utilisateur doit contenir au moins 3 caractères",
      })
      .max(50, {
        message: "Le nom d'utilisateur ne peut pas dépasser 50 caractères",
      }),
    email: z
      .string()
      .min(1, { message: "L'email est obligatoire" })
      .email({ message: 'Email invalide' }),
    first_name: z
      .string()
      .min(2, { message: 'Le prénom doit contenir au moins 2 caractères' })
      .max(50, { message: 'Le prénom ne peut pas dépasser 50 caractères' }),
    last_name: z
      .string()
      .min(2, { message: 'Le nom doit contenir au moins 2 caractères' })
      .max(50, { message: 'Le nom ne peut pas dépasser 50 caractères' }),
    password: z
      .string()
      .min(8, {
        message: 'Le mot de passe doit contenir au moins 8 caractères',
      })
      .regex(/[A-Z]/, {
        message: 'Le mot de passe doit contenir au moins une majuscule',
      })
      .regex(/[a-z]/, {
        message: 'Le mot de passe doit contenir au moins une minuscule',
      })
      .regex(/[0-9]/, {
        message: 'Le mot de passe doit contenir au moins un chiffre',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  })

export type RegisterFormType = z.infer<typeof RegisterSchema>

interface RegisterFormProps {
  onSubmit: (values: RegisterFormType) => void
  isLoading?: boolean
  defaultValues?: Partial<RegisterFormType>
}

export function RegisterForm({
  onSubmit,
  isLoading = false,
  defaultValues,
}: RegisterFormProps) {
  const form = useForm<RegisterFormType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: defaultValues?.username || '',
      email: defaultValues?.email || '',
      first_name: defaultValues?.first_name || '',
      last_name: defaultValues?.last_name || '',
      password: '',
      confirmPassword: '',
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Nom d'utilisateur et Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom d&rsquo;utilisateur</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ex: naby"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>Votre identifiant unique</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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
                  />
                </FormControl>
                <FormDescription>Votre adresse email</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Prénom et Nom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ex: Mouhamed Naby"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ex: Mbaye"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Mot de passe */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  />
                </FormControl>
                <FormDescription>
                  Min. 8 caractères, 1 majuscule, 1 chiffre
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmer le mot de passe</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>Retapez votre mot de passe</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Inscription en cours...' : "S'inscrire"}
        </Button>
      </form>
    </Form>
  )
}
