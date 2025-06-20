import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { UserIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AdminUsers = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      // First fetch user profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, created_at");

      if (profilesError) throw profilesError;

      // Get emails from auth users for each profile
      const userIds = profiles.map((profile) => profile.id);
      const emails = new Map();

      // Get emails for each user individually
      for (const userId of userIds) {
        const { data: email } = await supabase.rpc("get_user_email", {
          user_id: userId,
        });

        if (email) {
          emails.set(userId, email);
        }
      }

      // Combine the data
      const users = profiles.map((profile) => ({
        ...profile,
        email: emails.get(profile.id) || "Email not available",
      }));

      return users;
    },
  });

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">User Management</h1>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load user data. Please try again later.
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-muted rounded-lg p-6 animate-pulse h-24"
              ></div>
            ))}
          </div>
        ) : (
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Joined</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <UserIcon className="h-4 w-4" />
                        </div>
                        {user.full_name || "Anonymous User"}
                      </div>
                    </td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {data?.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="p-8 text-center text-muted-foreground"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;
