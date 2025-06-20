
// Map from database column names to camelCase
export const mapDatabaseToUserPreferences = (data: any) => {
  return {
    id: data.id,
    userId: data.user_id,
    emailNotifications: data.email_notifications,
    reminderAdvanceNotice: data.reminder_advance_notice,
    reminderTime: data.reminder_time,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};
