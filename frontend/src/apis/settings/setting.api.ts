import { apiClient } from "@/lib/api-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { IAppSettings, IUpdateSettingsPayload } from "./setting.type";

const URI = "/settings";

export const settingUri = {
  base: `${URI}`,
};

export const settingApis = {
  get: () => apiClient.get<IAppSettings, IAppSettings>(settingUri.base),
  update: (payload: IUpdateSettingsPayload) =>
    apiClient.patch<IUpdateSettingsPayload, IAppSettings>(
      settingUri.base,
      payload
    ),
};

export const useGetSettings = () =>
  useQuery({
    queryKey: ["settings"],
    queryFn: () => settingApis.get(),
  });

export const useUpdateSettings = (props?: {
  onSuccess?: (
    settings: IAppSettings,
    variables: IUpdateSettingsPayload
  ) => void;
  onError?: (error: AxiosError) => void;
}) => {
  const { onSuccess, onError } = props ?? {};
  return useMutation({
    mutationFn: (payload: IUpdateSettingsPayload) =>
      settingApis.update(payload),
    onSuccess: (settings, variables) => onSuccess?.(settings, variables),
    onError,
  });
};
