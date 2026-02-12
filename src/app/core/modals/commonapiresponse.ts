
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string | null;
  error?: string;
  statusCode?: number;
  timestamp?: Date;
}