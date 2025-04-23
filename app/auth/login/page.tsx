"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import Image from "next/image";
import { ChromeIcon } from "lucide-react";
import { signIn } from "@/lib/auth";
import { login } from "@/app/actions";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleLogin = async () => {
    setLoading(true);

    try {
      await login();
    } catch (error: any) {
      setError(error.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Image
            src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=542,fit=crop,q=95/m5Kb0gjDb4cqW1br/realizando-sonhos-logo-site-02-dWxbKV0z7VfNODJ9.png"
            alt="Associação Realizando Sonhos"
            width={300}
            height={100}
            priority
            className="h-auto"
          />
        </div>
        <Card className="border-none shadow-lg overflow-hidden animate-fadeIn">
          <div className="h-2 bg-gradient-to-r from-yellow-400 via-green-500 to-blue-500"></div>
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-green-600">
              Bem-vindo
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <form action={handleLogin}>
            {/* <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive" className="animate-shake">
                  <AlertDescription>Credenciais de Login inválidas</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu.email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 py-6 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label
                    htmlFor="password"
                    className="text-gray-700 font-medium"
                  >
                    Senha
                  </Label>
                </div>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 py-6 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
            </CardContent> */}
            <CardFooter className="pt-0">
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                name="provider"
                value="google"
              >
                <ChromeIcon size={20} />
                {loading ? "Entrando com o Google..." : "Entrar com o Google"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-gray-500 text-sm mt-8">
          © {new Date().getFullYear()} Associação Realizando Sonhos. Todos os
          direitos reservados.
        </p>
      </div>
    </main>
  );
}
