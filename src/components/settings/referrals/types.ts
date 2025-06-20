
export interface ReferralCode {
  id: string;
  user_id: string;
  code: string;
  unique_code: string | null;
  created_at: string;
  is_active: boolean;
  used_count: number;
}
