import { errorLogger } from "@/lib/axios";
import { authService } from "@/services/authService";
import { LoginPayload, LoginResponse } from "@/types/auth.types";
import { AppError } from "@/types/errors.types";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function useLogin() {
  const { replace } = useRouter();
  const {
    mutate: login,
    isPending: isLoginPending,
    isError: isLoginError,
  } = useMutation<LoginResponse, AppError, LoginPayload>({
    mutationFn: authService.login,
    mutationKey: ["login"],
    onSuccess: (data) => {
      if (!data.success) return;

      const role = data.data.data.role;

      if (role === "STUDENT") {
        toast.success(data.message);
        replace("/dashboard");
        return;
      }

      toast.success(data.message);
      replace("/admin/dashboard");
    },

    onError: (err) => errorLogger(err),
  });

  return { login, isLoginPending, isLoginError };
}
