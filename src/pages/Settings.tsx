
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { UserPreferencesProvider } from "@/contexts/userPreferences";
import NotificationsSettings from "@/components/settings/NotificationsSettings";
import { Bell, Shield, User } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";

const Settings = () => {
  const { user, changePassword } = useAuth();
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  // Get user's initials for avatar fallback
  const getInitials = () => {
    if (!user) return '?';
    
    const fullName = user.user_metadata?.full_name;
    if (fullName) {
      const names = fullName.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return fullName[0].toUpperCase();
    }
    
    return user.email?.[0].toUpperCase() || '?';
  };
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile updated",
      description: "Your profile settings have been saved successfully."
    });
  };

  const onChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New password and confirm password do not match.",
        variant: "destructive",
      });
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await changePassword(newPassword);

      if (result.success) {
        toast({
          title: "Success",
          description: "Password updated successfully.",
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast({
          title: "Error",
          description: result.error?.message || "Failed to update password.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <DashboardLayout>
      <UserPreferencesProvider>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="relative isolate overflow-hidden">
            {/* Background blurs */}
            <div className="absolute -top-40 -right-20 w-80 h-80 bg-primary/10 rounded-full filter blur-3xl opacity-20 -z-10"></div>
            <div className="absolute top-60 -left-20 w-80 h-80 bg-pet-purple/20 rounded-full filter blur-3xl opacity-30 -z-10"></div>
            <div className="absolute bottom-0 right-10 w-60 h-60 bg-pet-blue/20 rounded-full filter blur-3xl opacity-20 -z-10"></div>
            
            <FadeIn delay={100}>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                  Manage your account settings and preferences
                </p>
              </div>
            </FadeIn>
            
            <FadeIn delay={200}>
              <Tabs defaultValue="profile" className="w-full mt-6">
                {/* Mobile view - only visible on small screens */}
                <TabsList className="flex w-full justify-between px-1 md:hidden">
                  <div className="flex-1 flex justify-center">
                    <TabsTrigger value="profile" className="flex items-center gap-2 min-w-fit">
                      <User size={16} />
                      <span>Profile</span>
                    </TabsTrigger>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <TabsTrigger value="notifications" className="flex items-center gap-2 min-w-fit">
                      <Bell size={16} />
                      <span>Notifications</span>
                    </TabsTrigger>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <TabsTrigger value="security" className="flex items-center gap-2 min-w-fit">
                      <Shield size={16} />
                      <span>Security</span>
                    </TabsTrigger>
                  </div>
                </TabsList>
                
                {/* Desktop view - only visible on medium screens and up */}
                <TabsList className="hidden md:grid w-full md:w-auto md:grid-cols-3">
                  <TabsTrigger value="profile" className="flex items-center gap-2">
                    <User size={16} />
                    <span>Profile</span>
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-2">
                    <Bell size={16} />
                    <span>Notifications</span>
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex items-center gap-2">
                    <Shield size={16} />
                    <span>Security</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Settings</CardTitle>
                      <CardDescription>
                        Update your personal information and how it appears on your account
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSaveProfile} className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex flex-col items-center gap-3">
                            <Avatar className="h-24 w-24 border-2 border-primary/10">
                              <AvatarImage src={user?.user_metadata?.avatar_url} />
                              <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                                {getInitials()}
                              </AvatarFallback>
                            </Avatar>
                            <Button variant="outline" size="sm">
                              Change Avatar
                            </Button>
                          </div>
                          
                          <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input 
                                  id="firstName" 
                                  defaultValue={user?.user_metadata?.full_name?.split(' ')[0] || ''}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input 
                                  id="lastName" 
                                  defaultValue={user?.user_metadata?.full_name?.split(' ')[1] || ''}
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input 
                                id="email" 
                                type="email" 
                                defaultValue={user?.email || ''}
                                disabled
                              />
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex justify-end">
                          <Button type="submit">Save Changes</Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="notifications" className="mt-6">
                  <NotificationsSettings />
                </TabsContent>
                
                <TabsContent value="security" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Security Settings</CardTitle>
                      <CardDescription>
                        Manage your password and security preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Change Password</h3>
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input 
                              id="currentPassword" 
                              type="password" 
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input 
                              id="newPassword" 
                              type="password" 
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input 
                              id="confirmPassword" 
                              type="password" 
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex justify-end">
                          <Button onClick={onChangePassword}>Update Password</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </FadeIn>
          </div>
        </div>
      </UserPreferencesProvider>
    </DashboardLayout>
  );
};

export default Settings;
