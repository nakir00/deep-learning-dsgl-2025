import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LoginForm } from '@/components/forms/Login-form'
import { useAuth } from '@/hooks/useAuth'

export const Route = createFileRoute('/auth/_authLayout/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const handleLogin = ({
    email,
    password,
  }: {
    email: string
    password: string
  }) => {
    login(
      {
        email,
        password,
      },
      (data) => {
        toast.success('connection réussie!', {
          description: `bonjour ${data.user.first_name} !`,
        })
        navigate({
          to: '/dashboard',
        })
      },
      (erreur) => {
        toast.error(`Échec de la connexion: ${erreur}`, {
          description: 'Veuillez réessayer.',
        })
      },
    )
  }
  return (
    <div className={'flex flex-col gap-6'}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm
            onSubmit={(data) => {
              handleLogin(data)
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
