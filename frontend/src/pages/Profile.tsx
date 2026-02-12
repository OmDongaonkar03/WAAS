import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/Avatar";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Mail,
  Calendar,
  Clock,
  ArrowRight,
  Edit2,
  Save,
  X,
  Lock,
  LogOut,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import profileService from "@/services/profileService";

const runHistory = [
  {
    id: "1",
    prompt: "Analyze whether we should launch a SaaS for developers in 2026",
    template: "Startup Workforce",
    status: "completed",
    duration: "2m 34s",
    date: "2 hours ago",
  },
  {
    id: "2",
    prompt: "Evaluate competitive landscape for AI code assistants",
    template: "Startup Workforce",
    status: "completed",
    duration: "3m 12s",
    date: "Yesterday",
  },
  {
    id: "3",
    prompt: "Risk assessment for cloud migration strategy",
    template: "Startup Workforce",
    status: "completed",
    duration: "4m 05s",
    date: "3 days ago",
  },
  {
    id: "4",
    prompt: "Market analysis for developer productivity tools",
    template: "Startup Workforce",
    status: "completed",
    duration: "2m 48s",
    date: "1 week ago",
  },
];

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  
  // Profile fields
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [stats, setStats] = useState({
    totalRuns: 0,
    averageDuration: "0m",
  });
  
  // Email change
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  
  // Password change
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { toast } = useToast();
  const { user, logout, getValidToken, updateUser, token } = useAuth();
  const navigate = useNavigate();

  // Fetch profile data on mount
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBio(user.bio || "");
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const validToken = await getValidToken();
      if (!validToken) {
        console.log("No valid token for stats");
        setStatsLoading(false);
        return;
      }

      const result = await profileService.getStats(validToken);
      if (result.ok && result.data.success) {
        setStats(result.data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // IMPORTANT: Get a valid token before making the request
      const validToken = await getValidToken();
      
      if (!validToken) {
        toast({
          title: "Session Expired",
          description: "Please log in again",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      console.log("Using valid token for profile update");

      const result = await profileService.updateProfile(validToken, {
        name: name.trim(),
        bio: bio.trim() || null,
      });

      if (result.ok && result.data.success) {
        updateUser(result.data.user);
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      } else {
        toast({
          title: "Update Failed",
          description: result.data.message || "Failed to update profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setName(user?.name || "");
    setBio(user?.bio || "");
    setIsEditing(false);
  };

  const handleRequestEmailChange = async () => {
    if (!newEmail.trim() || !emailPassword) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const validToken = await getValidToken();
      
      if (!validToken) {
        toast({
          title: "Session Expired",
          description: "Please log in again",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const result = await profileService.requestEmailChange(
        validToken,
        newEmail.trim(),
        emailPassword
      );

      if (result.ok && result.data.success) {
        toast({
          title: "Verification Sent",
          description: result.data.message,
        });
        setIsChangingEmail(false);
        setNewEmail("");
        setEmailPassword("");
      } else {
        toast({
          title: "Request Failed",
          description: result.data.message || "Failed to request email change",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Validation Error",
        description: "All password fields are required",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Validation Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const validToken = await getValidToken();
      
      if (!validToken) {
        toast({
          title: "Session Expired",
          description: "Please log in again",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const result = await profileService.changePassword(
        validToken,
        currentPassword,
        newPassword
      );

      if (result.ok && result.data.success) {
        toast({
          title: "Success",
          description: result.data.message,
        });
        setIsChangingPassword(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        // Log out user after password change
        setTimeout(() => {
          logout();
          navigate("/login");
        }, 2000);
      } else {
        toast({
          title: "Change Failed",
          description: result.data.message || "Failed to change password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-light tracking-tight mb-1">Profile</h1>
          <p className="text-sm text-muted-foreground font-light">
            Manage your account and view run history
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* User Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-4"
          >
            {/* Profile Card */}
            <div className="p-6 rounded-xl border border-border bg-card/50">
              <div className="flex items-center gap-4 mb-6">
                <Avatar user={user} size="md" />
                <div className="flex-1">
                  {isEditing ? (
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="font-medium mb-1"
                      placeholder="Your name"
                    />
                  ) : (
                    <>
                      <h2 className="font-medium">{user?.name}</h2>
                      <p className="text-sm text-muted-foreground">Free Plan</p>
                    </>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="mb-6">
                  <Label htmlFor="bio" className="text-sm mb-2 block">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="resize-none"
                    rows={3}
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {bio.length}/500 characters
                  </p>
                </div>
              )}

              {!isEditing && bio && (
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground">{bio}</p>
                </div>
              )}

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{user?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Joined{" "}
                    {user?.createdAt ? formatDate(user.createdAt) : "Recently"}
                  </span>
                </div>
              </div>

              {isEditing ? (
                <div className="pt-4 border-t border-border space-y-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full justify-start gap-2"
                    onClick={handleSaveProfile}
                    disabled={loading}
                  >
                    <Save className="w-4 h-4" />
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2"
                    onClick={handleCancelEdit}
                    disabled={loading}
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="pt-4 border-t border-border space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </Button>
                  {/*<Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2"
                    onClick={() => setIsChangingEmail(true)}
                  >
                    <Mail className="w-4 h-4" />
                    Change Email
                  </Button>*/}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2"
                    onClick={() => setIsChangingPassword(true)}
                  >
                    <Lock className="w-4 h-4" />
                    Change Password
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </div>
              )}
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="p-6 rounded-xl border border-border bg-card/50"
            >
              <h3 className="text-sm font-medium mb-4">Usage</h3>
              {statsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="loader w-6 h-6" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-light">{stats.totalRuns}</p>
                    <p className="text-xs text-muted-foreground">Total Runs</p>
                  </div>
                  <div>
                    <p className="text-2xl font-light">
                      {stats.averageDuration}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Avg. Duration
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-4"
          >
            {/* Change Email Card */}
            <AnimatePresence>
              {isChangingEmail && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-6 rounded-xl border border-border bg-card/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Change Email</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsChangingEmail(false);
                        setNewEmail("");
                        setEmailPassword("");
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                    <div className="flex gap-2">
                      <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        You'll receive a verification email at your new address.
                        Your email will be updated after verification.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentEmail">Current Email</Label>
                      <Input
                        id="currentEmail"
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="bg-secondary/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newEmail">New Email</Label>
                      <Input
                        id="newEmail"
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="Enter new email address"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emailPassword">
                        Password (for verification)
                      </Label>
                      <Input
                        id="emailPassword"
                        type="password"
                        value={emailPassword}
                        onChange={(e) => setEmailPassword(e.target.value)}
                        placeholder="Enter your password"
                      />
                    </div>

                    <Button
                      className="w-full"
                      onClick={handleRequestEmailChange}
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send Verification Email"}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Change Password Card */}
            <AnimatePresence>
              {isChangingPassword && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-6 rounded-xl border border-border bg-card/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Change Password</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setCurrentPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        minLength={8}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        minLength={8}
                      />
                    </div>

                    <Button
                      className="w-full"
                      onClick={handleChangePassword}
                      disabled={loading}
                    >
                      {loading ? "Changing..." : "Change Password"}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Run History */}
            <div className="p-6 rounded-xl border border-border bg-card/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Run History</h3>
                <Link to="/history">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    View All
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-2">
                {runHistory.map((run, index) => (
                  <motion.div
                    key={run.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + index * 0.05 }}
                    className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-light truncate mb-1">
                        {run.prompt}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{run.template}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {run.duration}
                        </span>
                        <span>·</span>
                        <span>{run.date}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}