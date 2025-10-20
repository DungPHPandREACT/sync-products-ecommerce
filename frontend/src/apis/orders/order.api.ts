import { apiClient } from "@/lib/api-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  ICreateOrderPayload,
  IOrder,
  ISyncOrdersPayload,
  IUpdateOrderPayload,
  IUpdateOrderStatusPayload,
} from "./order.type";

const URI = "/api/v1/orders";

export const orderUri = {
  base: `${URI}`,
  byId: (id: number | string) => `${URI}/${id}`,
  sync: `${URI}/sync`,
  updateStatus: (id: number | string) => `${URI}/${id}/status`,
};

export const orderApis = {
  getAll: () => apiClient.get<IOrder[], IOrder[]>(orderUri.base),
  getById: (id: number | string) =>
    apiClient.get<IOrder, IOrder>(orderUri.byId(id)),
  create: (payload: ICreateOrderPayload) =>
    apiClient.post<ICreateOrderPayload, IOrder>(orderUri.base, payload),
  update: (id: number | string, payload: IUpdateOrderPayload) =>
    apiClient.patch<IUpdateOrderPayload, IOrder>(orderUri.byId(id), payload),
  sync: (payload: ISyncOrdersPayload) =>
    apiClient.post<ISyncOrdersPayload, unknown>(orderUri.sync, payload),
  updateStatus: (id: number | string, payload: IUpdateOrderStatusPayload) =>
    apiClient.patch<IUpdateOrderStatusPayload, IOrder>(
      orderUri.updateStatus(id),
      payload
    ),
};

export const useGetOrders = () =>
  useQuery({
    queryKey: ["orders"],
    queryFn: () => orderApis.getAll(),
  });

export const useGetOrderById = (
  id: number | string,
  options?: { enabled?: boolean }
) =>
  useQuery({
    queryKey: ["orders", id],
    queryFn: () => orderApis.getById(id),
    enabled: options?.enabled ?? true,
  });

export const useCreateOrder = (props?: {
  onSuccess?: (order: IOrder, variables: ICreateOrderPayload) => void;
  onError?: (error: AxiosError) => void;
}) => {
  const { onSuccess, onError } = props ?? {};
  return useMutation({
    mutationFn: (payload: ICreateOrderPayload) => orderApis.create(payload),
    onSuccess: (created, variables) => onSuccess?.(created, variables),
    onError,
  });
};

export const useUpdateOrder = (props?: {
  onSuccess?: (
    order: IOrder,
    ctx: { id: number | string; payload: IUpdateOrderPayload }
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
      payload: IUpdateOrderPayload;
    }) => orderApis.update(id, payload),
    onSuccess: (updated, variables) => onSuccess?.(updated, variables),
    onError,
  });
};

export const useSyncOrders = (props?: {
  onSuccess?: () => void;
  onError?: (error: AxiosError) => void;
}) => {
  const { onSuccess, onError } = props ?? {};
  return useMutation({
    mutationFn: (payload: ISyncOrdersPayload) => orderApis.sync(payload),
    onSuccess: () => onSuccess?.(),
    onError,
  });
};

export const useUpdateOrderStatus = (props?: {
  onSuccess?: (
    order: IOrder,
    ctx: { id: number | string; payload: IUpdateOrderStatusPayload }
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
      payload: IUpdateOrderStatusPayload;
    }) => orderApis.updateStatus(id, payload),
    onSuccess: (updated, variables) => onSuccess?.(updated, variables),
    onError,
  });
};
