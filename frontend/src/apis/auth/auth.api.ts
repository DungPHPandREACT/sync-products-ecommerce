import { apiClient } from "@/lib/api-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { IAuth, IAuthResponse, IAuthUser } from "./auth.type";

const URI = "/api/v1/auth";

export const authUri = {
  login: `${URI}/login`,
  profile: `${URI}/profile`,
};

export const authApis = {
  login: (payload: IAuth) =>
    apiClient.post<IAuth, IAuthResponse>(authUri.login, payload),
  logout: async () => {
    // Xóa cookie phía server nếu có route; tạm thời chỉ clear local state client
    return Promise.resolve();
  },
  getCurrentUser: () => apiClient.get<unknown, IAuthUser>(authUri.profile),
  refresh: () => {
    const refreshToken = localStorage.getItem("refresh_token");
    return apiClient.post<{ refreshToken: string }, { accessToken: string }>(
      `${URI}/refresh`,
      { refreshToken: refreshToken ?? "" }
    );
  },
};

export const useLogin = (props?: {
  onSuccess?: (response: IAuthResponse, data: IAuth) => void;
  onError?: (error: AxiosError<null>) => void;
}) => {
  const { onSuccess, onError } = props ?? {};

  return useMutation({
    mutationFn: (payload: IAuth) => authApis.login(payload),
    onSuccess: (response, variables) => {
      if (response?.accessToken) {
        localStorage.setItem("access_token", response.accessToken);
      }
      if ((response as any)?.refreshToken) {
        localStorage.setItem("refresh_token", (response as any).refreshToken);
      }
      onSuccess?.(response, variables);
    },
    onError,
  });
};

export const useGetCurrentUser = (props?: { enabled?: boolean }) => {
  const { enabled } = props ?? {};

  return useQuery({
    queryKey: ["auth", "currentUser"],
    queryFn: () => authApis.getCurrentUser(),
    staleTime: 0,
    enabled,
  });
};

export const useLogout = (props?: {
  onSuccess?: () => void;
  onError?: (error: AxiosError) => void;
}) => {
  const { onSuccess } = props ?? {};

  return useMutation({
    mutationFn: () => authApis.logout(),
    onSuccess,
  });
};
