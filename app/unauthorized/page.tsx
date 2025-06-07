import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
export default function Page() {
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
            <CardTitle className="mb-4 text-center text-2xl font-bold text-[#3cb878]">
              Acesso não autorizado
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Desculpe, este app ajuda nossas crianças a realizarem seus
              sonhos e é acessível apenas para membros autorizados da equipe.
            </CardDescription>
          </CardHeader>
          <CardFooter className="pt-0">
            <Button
              className="w-full bg-[#3cb878] hover:bg-[#3cb878]/90"
              asChild
            >
              <Link href="/auth/login">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                Voltar para o login
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <p className="text-center text-gray-500 text-sm mt-8">
          © {new Date().getFullYear()} Associação Realizando Sonhos. Todos os
          direitos reservados.
        </p>
      </div>
    </main>
  );
}
