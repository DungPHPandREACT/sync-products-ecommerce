import { apiClient } from "@/lib/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Types
export interface IPlatform {
  id: number;
  name: string;
  display_name: string;
  status: string;
  api_config?: {
    apiKey?: string;
    apiSecret?: string;
    baseUrl?: string;
    webhookUrl?: string;
    webhookSecret?: string;
    partnerId?: string;
    shopId?: string;
    username?: string;
    password?: string;
  };
  webhook_url?: string;
  created_at: string;
  updated_at: string;
}

export interface PlatformStats {
  platform_id: number;
  platform_name: string;
  total_products: number;
  total_orders: number;
  last_sync: string;
  sync_status: string;
}

export interface TestConnectionResult {
  success: boolean;
  message: string;
  platformId: number;
}

export interface SyncResult {
  success: boolean;
  message: string;
  platformId: number;
  jobId?: string;
}

// API functions
const platformApi = {
  getPlatforms: async (): Promise<IPlatform[]> => {
    const response = await apiClient.get(`/platforms`);
    return response.data;
  },

  createPlatform: async (data: Partial<IPlatform>): Promise<IPlatform> => {
    const response = await apiClient.post(`/platforms`, data);
    return response.data;
  },

  getPlatform: async (id: number): Promise<IPlatform> => {
    const response = await apiClient.get(`/platforms/${id}`);
    return response.data;
  },

  updatePlatform: async ({
    id,
    data,
  }: {
    id: number;
    data: Partial<IPlatform>;
  }): Promise<IPlatform> => {
    const response = await apiClient.patch(`/platforms/${id}`, data);
    return response.data;
  },

  testConnection: async ({
    id,
  }: {
    id: number;
  }): Promise<TestConnectionResult> => {
    const response = await apiClient.post(`/platforms/${id}/test-connection`);
    return response.data;
  },

  syncPlatform: async ({ id }: { id: number }): Promise<SyncResult> => {
    const response = await apiClient.post(`/platforms/${id}/sync`);
    return response.data;
  },

  getPlatformStats: async (): Promise<PlatformStats[]> => {
    const response = await apiClient.get(`/platforms/stats`);
    return response.data;
  },
};

// React Query hooks
export const useGetPlatforms = () => {
  return useQuery({
    queryKey: ["platforms"],
    queryFn: platformApi.getPlatforms,
  });
};

export const useGetPlatform = (id: number) => {
  return useQuery({
    queryKey: ["platforms", id],
    queryFn: () => platformApi.getPlatform(id),
    enabled: !!id,
  });
};

export const useUpdatePlatform = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: platformApi.updatePlatform,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platforms"] });
    },
  });
};

export const useCreatePlatform = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: platformApi.createPlatform,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platforms"] });
    },
  });
};

export const useTestConnection = () => {
  return useMutation({
    mutationFn: platformApi.testConnection,
  });
};

export const useSyncPlatform = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: platformApi.syncPlatform,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platforms"] });
      queryClient.invalidateQueries({ queryKey: ["sync"] });
    },
  });
};

export const useGetPlatformStats = () => {
  return useQuery({
    queryKey: ["platforms", "stats"],
    queryFn: platformApi.getPlatformStats,
  });
};
