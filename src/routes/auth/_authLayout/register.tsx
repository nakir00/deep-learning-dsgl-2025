import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import type { UserModel } from "@/api/queries/user";
import { RegisterForm } from "@/components/forms/register-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth/_authLayout/register")({
  component: RouteComponent,
  errorComponent: () => <div>Error loading register route</div>,
});

function RouteComponent() {
  const { register, login } = useAuth();
  const navigate = useNavigate({ from: '/auth/register' })

  const handleRegister = ({
    username,
    email,
    first_name,
    last_name,
    password,
  }: {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    confirmPassword: string;
  }) => {
    register(
      {
        username,
        email,
        first_name,
        last_name,
        password,
      },
      (data: { user: UserModel }) => {
        toast.success("l'inscription réussie!", {
          description: `nous allons essayer de vous connecter: ${data.user.email}`,
        });
        tryingLogin({ email, password });
      },
      (error) => {
        toast.error(`Registration failed: ${error}`, {
          description: "Please try again.",
        });
      }
    );
  };

  const tryingLogin = ({ email, password }: { email: string; password: string }) => {
    login(
      {
        email,
        password,
      },
      () => {
        console.log("Login successful");
        navigate({
          to:"/dashboard"
        });
      },
      (erreur) => {
        console.error("Login failed",erreur);
      }
    );
  }
  return (
    <div className={"flex flex-col gap-6"}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm
            onSubmit={(data) => {
             handleRegister(data);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
