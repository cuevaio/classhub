import { Button } from "@/components/ui/button";
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col h-screen items-center justify-center font-bold text-3xl gap-4">
      <h1>ClassHub</h1>
      <div>
        <Button asChild>
          <Link href="auth/signin">Iniciar sesión</Link>
        </Button>
      </div>
    </div>
  );
}
