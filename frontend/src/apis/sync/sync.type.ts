export interface ISyncLog {
  id: number;
  platform_id: number | null;
  sync_type: string;
  sync_direction: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  records_processed: number;
  records_success: number;
  records_failed: number;
  error_message: string | null;
  sync_data: Record<string, any> | null;
}

export interface ISyncConflict {
  id: number;
  product_mapping_id: number;
  conflict_type: string;
  local_value: Record<string, any>;
  platform_value: Record<string, any>;
  resolution: string;
  resolved_by: number | null;
  resolved_at: string | null;
  created_at: string;
}

export interface ISyncStats {
  total_jobs: number;
  successful_jobs: number;
  failed_jobs: number;
  pending_jobs: number;
  total_conflicts: number;
  resolved_conflicts: number;
  pending_conflicts: number;
  lastRunAt?: string | null;
}

export interface ISyncStatus {
  status: string;
  running: boolean;
  lastRunAt: string | null;
}

export interface IStartSyncPayload {
  sync_type?: string;
  sync_direction?: string;
  platform_id?: number;
  options?: Record<string, any>;
}

export interface IResolveConflictPayload {
  resolution: string;
  resolvedBy: number;
}
