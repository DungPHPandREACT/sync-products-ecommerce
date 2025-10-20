import { apiClient } from "@/lib/api-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  ICreateProductPayload,
  IProduct,
  IProductMapping,
  ISyncProductPayload,
  IUpdateProductPayload,
} from "./product.type";

const URI = "/api/v1/products";

export const productUri = {
  base: `${URI}`,
  byId: (id: number | string) => `${URI}/${id}`,
  sync: (id: number | string) => `${URI}/${id}/sync`,
  mappings: (id: number | string) => `${URI}/${id}/mappings`,
  mappingById: (id: number | string, mappingId: number | string) =>
    `${URI}/${id}/mappings/${mappingId}`,
};

export const productApis = {
  getAll: () => apiClient.get<IProduct[], IProduct[]>(productUri.base),
  getById: (id: number | string) =>
    apiClient.get<IProduct, IProduct>(productUri.byId(id)),
  create: (payload: ICreateProductPayload) =>
    apiClient.post<ICreateProductPayload, IProduct>(productUri.base, payload),
  update: (id: number | string, payload: IUpdateProductPayload) =>
    apiClient.patch<IUpdateProductPayload, IProduct>(
      productUri.byId(id),
      payload
    ),
  remove: (id: number | string) => apiClient.delete(productUri.byId(id)),
  getMappings: (id: number | string) =>
    apiClient.get<IProductMapping[], IProductMapping[]>(
      productUri.mappings(id)
    ),
  createMapping: (id: number | string, payload: Partial<IProductMapping>) =>
    apiClient.post<Partial<IProductMapping>, IProductMapping>(
      productUri.mappings(id),
      payload
    ),
  updateMapping: (
    id: number | string,
    mappingId: number | string,
    payload: Partial<IProductMapping>
  ) =>
    apiClient.patch<Partial<IProductMapping>, IProductMapping>(
      productUri.mappingById(id, mappingId),
      payload
    ),
  deleteMapping: (id: number | string, mappingId: number | string) =>
    apiClient.delete(productUri.mappingById(id, mappingId)),
  sync: (id: number | string, payload: ISyncProductPayload) =>
    apiClient.post<ISyncProductPayload, unknown>(productUri.sync(id), payload),
};

export const useGetProducts = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: () => productApis.getAll(),
  });

export const useGetProductById = (
  id: number | string,
  options?: { enabled?: boolean }
) =>
  useQuery({
    queryKey: ["products", id],
    queryFn: () => productApis.getById(id),
    enabled: options?.enabled ?? true,
  });

export const useCreateProduct = (props?: {
  onSuccess?: (product: IProduct, variables: ICreateProductPayload) => void;
  onError?: (error: AxiosError) => void;
}) => {
  const { onSuccess, onError } = props ?? {};
  return useMutation({
    mutationFn: (payload: ICreateProductPayload) => productApis.create(payload),
    onSuccess: (created, variables) => onSuccess?.(created, variables),
    onError,
  });
};

export const useUpdateProduct = (props?: {
  onSuccess?: (
    product: IProduct,
    ctx: { id: number | string; payload: IUpdateProductPayload }
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
      payload: IUpdateProductPayload;
    }) => productApis.update(id, payload),
    onSuccess: (updated, variables) => onSuccess?.(updated, variables),
    onError,
  });
};

export const useSyncProduct = (props?: {
  onSuccess?: () => void;
  onError?: (error: AxiosError) => void;
}) => {
  const { onSuccess, onError } = props ?? {};
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number | string;
      payload: ISyncProductPayload;
    }) => productApis.sync(id, payload),
    onSuccess: () => onSuccess?.(),
    onError,
  });
};

export const useDeleteProduct = (props?: {
  onSuccess?: () => void;
  onError?: (error: AxiosError) => void;
}) => {
  const { onSuccess, onError } = props ?? {};
  return useMutation({
    mutationFn: (id: number | string) => productApis.remove(id),
    onSuccess: () => onSuccess?.(),
    onError,
  });
};

export const useCreateMapping = () => {
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number | string;
      payload: Partial<IProductMapping>;
    }) => productApis.createMapping(id, payload),
  });
};

export const useUpdateMapping = () => {
  return useMutation({
    mutationFn: ({
      id,
      mappingId,
      payload,
    }: {
      id: number | string;
      mappingId: number | string;
      payload: Partial<IProductMapping>;
    }) => productApis.updateMapping(id, mappingId, payload),
  });
};

export const useDeleteMapping = () => {
  return useMutation({
    mutationFn: ({
      id,
      mappingId,
    }: {
      id: number | string;
      mappingId: number | string;
    }) => productApis.deleteMapping(id, mappingId),
  });
};
