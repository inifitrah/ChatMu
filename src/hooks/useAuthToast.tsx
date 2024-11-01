import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useToast } from "./use-toast";
import { redirect } from "next/navigation";

export const useAuthToast = () => {
  const { data: session, status } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    if (status === "authenticated" && session) {
      toast({
        description:
          "Wellcome back " + session.user.username || session.user.email,
      });
      redirect("/");
    }
  }, [status, session]);
};
