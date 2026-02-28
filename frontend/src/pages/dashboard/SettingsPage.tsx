import { useState } from "react";
import { motion } from "framer-motion";
import { User, Bell, Shield, Palette } from "lucide-react";

const SettingsPage = () => {
  const [name, setName] = useState("John Doe");
  const [email] = useState("john@example.com");
  const [notifications, setNotifications] = useState(true);

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
          <button className="btn-glass px-4 py-2.5 rounded-xl text-sm">Change Password</button>
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
