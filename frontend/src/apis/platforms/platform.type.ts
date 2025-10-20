export interface IPlatform {
  id: number;
  name: string;
  display_name: string;
  api_config: Record<string, any> | null;
  webhook_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ICreatePlatformPayload {
  name: string;
  display_name: string;
  api_config?: Record<string, any> | null;
  webhook_url?: string | null;
  status?: string;
}

export interface IUpdatePlatformPayload
  extends Partial<ICreatePlatformPayload> {}

export interface IPlatformStats {
  totalPlatforms: number;
  activePlatforms: number;
  inactivePlatforms: number;
}
