import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Bell, Shield, Loader2 } from "lucide-react";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { toAuthMessage } from "@/lib/authErrors";

const SettingsPage = () => {
  const { user, isConfigured } = useAuth();
  const [name, setName] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  useEffect(() => {
    setName(user?.displayName ?? "");
  }, [user]);

  const email = user?.email ?? "No email found";
  const hasPasswordProvider =
    user?.providerData?.some((provider) => provider.providerId === "password") ?? false;

  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!isConfigured) {
      setPasswordError("Firebase auth is not configured.");
      return;
    }

    if (!user) {
      setPasswordError("You must be signed in to change your password.");
      return;
    }

    if (!hasPasswordProvider) {
      setPasswordError(
        "This account uses social sign-in. Set a password by linking an email/password account first.",
      );
      return;
    }

    if (!user.email) {
      setPasswordError("No email is associated with this account.");
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    setIsChangingPassword(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSuccess("Password changed successfully.");
    } catch (error) {
      setPasswordError(toAuthMessage(error));
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-xl p-6 space-y-4"
        >
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Profile</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Display Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="input-glass w-full px-4 py-3 rounded-xl text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Email</label>
              <input value={email} disabled className="input-glass w-full px-4 py-3 rounded-xl text-sm opacity-60 cursor-not-allowed" />
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-xl p-6 space-y-4"
        >
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Notifications</h3>
          </div>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm">Email notifications for completed papers</span>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${notifications ? "bg-primary" : "bg-secondary"}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-background transition-transform duration-200 ${notifications ? "left-6" : "left-1"}`} />
            </button>
          </label>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel rounded-xl p-6 space-y-4"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Security</h3>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="input-glass w-full px-4 py-3 rounded-xl text-sm"
                placeholder="Enter current password"
                disabled={isChangingPassword || !hasPasswordProvider}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input-glass w-full px-4 py-3 rounded-xl text-sm"
                placeholder="Enter new password"
                disabled={isChangingPassword || !hasPasswordProvider}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-glass w-full px-4 py-3 rounded-xl text-sm"
                placeholder="Re-enter new password"
                disabled={isChangingPassword || !hasPasswordProvider}
              />
            </div>

            {!hasPasswordProvider && (
              <p className="text-sm text-amber-300/90">
                Password change is available for email/password accounts only.
              </p>
            )}
            {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
            {passwordSuccess && <p className="text-sm text-primary">{passwordSuccess}</p>}

            <button
              type="submit"
              className="btn-glass px-4 py-2.5 rounded-xl text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isChangingPassword || !hasPasswordProvider}
            >
              {isChangingPassword ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </span>
              ) : (
                "Change Password"
              )}
            </button>
          </form>
        </motion.div>

        <motion.button
          className="btn-neon px-6 py-3 rounded-xl text-sm font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Save Changes
        </motion.button>
      </div>
    </div>
  );
};

export default SettingsPage;
