export interface IAppSettings {
  sync_interval_minutes: number;
  batch_size: number;
  max_retries: number;
  default_conflict_resolution: "local" | "platform" | "manual";
  auto_resolve_conflicts: boolean;
  notify_on_conflicts: boolean;
  webhook_base_url: string | null;
  webhook_secret: string | null;
  enable_webhooks: boolean;
}

export interface IUpdateSettingsPayload extends Partial<IAppSettings> {}
