import { apiClient } from "@/lib/api-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  IResolveConflictPayload,
  IStartSyncPayload,
  ISyncConflict,
  ISyncLog,
  ISyncStats,
  ISyncStatus,
} from "./sync.type";

const URI = "/api/v1/sync";

export const syncUri = {
  logs: `${URI}/logs`,
  conflicts: `${URI}/conflicts`,
  stats: `${URI}/stats`,
  status: `${URI}/status`,
  start: `${URI}/start`,
  stop: `${URI}/stop`,
  resolveConflict: (id: number | string) => `${URI}/conflicts/${id}/resolve`,
};

export const syncApis = {
  getLogs: () => apiClient.get<ISyncLog[], ISyncLog[]>(syncUri.logs),
  getConflicts: () =>
    apiClient.get<ISyncConflict[], ISyncConflict[]>(syncUri.conflicts),
  getStats: () => apiClient.get<ISyncStats, ISyncStats>(syncUri.stats),
  getStatus: () => apiClient.get<ISyncStatus, ISyncStatus>(syncUri.status),
  start: (payload: IStartSyncPayload) =>
    apiClient.post<IStartSyncPayload, { job: any }>(syncUri.start, payload),
  stop: () => apiClient.post<unknown, unknown>(syncUri.stop, {}),
  resolveConflict: (id: number | string, payload: IResolveConflictPayload) =>
    apiClient.patch<IResolveConflictPayload, { success: boolean }>(
      syncUri.resolveConflict(id),
      payload
    ),
};

export const useGetSyncLogs = () =>
  useQuery({
    queryKey: ["sync", "logs"],
    queryFn: () => syncApis.getLogs(),
  });

export const useGetSyncConflicts = () =>
  useQuery({
    queryKey: ["sync", "conflicts"],
    queryFn: () => syncApis.getConflicts(),
  });

export const useGetSyncStats = () =>
  useQuery({
    queryKey: ["sync", "stats"],
    queryFn: () => syncApis.getStats(),
  });

export const useGetSyncStatus = () =>
  useQuery({
    queryKey: ["sync", "status"],
    queryFn: () => syncApis.getStatus(),
    refetchInterval: 5000,
  });

export const useStartSync = (props?: {
  onSuccess?: () => void;
  onError?: (error: AxiosError) => void;
}) => {
  const { onSuccess, onError } = props ?? {};
  return useMutation({
    mutationFn: (payload: IStartSyncPayload) => syncApis.start(payload),
    onSuccess: () => onSuccess?.(),
    onError,
  });
};

export const useStopSync = (props?: {
  onSuccess?: () => void;
  onError?: (error: AxiosError) => void;
}) => {
  const { onSuccess, onError } = props ?? {};
  return useMutation({
    mutationFn: () => syncApis.stop(),
    onSuccess: () => onSuccess?.(),
    onError,
  });
};

export const useResolveConflict = (props?: {
  onSuccess?: (
    result: { success: boolean },
    ctx: { id: number | string; payload: IResolveConflictPayload }
  ) => void;
  onError?: (error: AxiosError) => void;
}) => {
  const { onSuccess, onError } = props ?? {};
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number | string;
      payload: IResolveConflictPayload;
    }) => syncApis.resolveConflict(id, payload),
    onSuccess: (result, variables) => onSuccess?.(result, variables),
    onError,
  });
};
