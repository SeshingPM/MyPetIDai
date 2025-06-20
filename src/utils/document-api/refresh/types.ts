
export interface RefreshOptions {
  petId?: string;
  showToast?: boolean;
  forceRefetch?: boolean;
  optimisticData?: any;
}

export interface RefreshResult {
  success: boolean;
  error?: any;
}
