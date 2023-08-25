import { type Toast, type ToasterToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { checkIsEduEmail } from "@/utils/checkIsEduEmail";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

async function handleSubmit(
  event: React.FormEvent,
  toast: ({ ...props }: Toast) => {
    id: string;
    dismiss: () => void;
    update: (props: ToasterToast) => void;
  },
  router: AppRouterInstance,
  setSending: (sending: boolean) => void
) {
  try {
    setSending(true);
    const csrfTokenRes = await fetch("/api/auth/csrf");
    const { csrfToken } = (await csrfTokenRes.json()) as {
      csrfToken: string;
    };

    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get("email") as string;

    let isEdu = checkIsEduEmail(email);

    if (!isEdu) {
      toast({
        variant: "destructive",
        title: "Solo se permiten correos institucionales.",
        description: "Por favor, ingresa un correo institucional.",
      });
      setSending(false);
      return;
    }

    let searchParams = new URLSearchParams({
      email,
      csrfToken,
      json: "true",
    });

    const signInRes = await fetch(`/api/auth/signin/email?${searchParams}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: searchParams,
    });

    if (signInRes.ok) {
      toast({
        description: "Encontrarás el enlace de inicio de sesión en tu correo.",
      });

      router.push("/auth/verify?email=" + email);
    }
  } catch (error) {
    console.error(error);
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description: "There was a problem with your request.",
      action: <ToastAction altText="Try again">Try again</ToastAction>,
    });
    setSending(false);
  }
}

export { handleSubmit };
