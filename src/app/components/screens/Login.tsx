import React, { useState, useEffect } from "react";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Globe,
} from "lucide-react";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";
import { toast } from "sonner@2.0.3";
import { AuthLayout } from "../molecules/AuthLayout";
import { UserService } from "../../services/localStorage";
import { LanguageSelector } from "../molecules/LanguageSelector";
import { useSafeI18n } from "../../contexts/I18nContext";

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  onDemoMode: () => void;
  onSwitchToSignUp: () => void;
  onBack?: () => void;
  initialUsername?: string;
  initialPassword?: string;
}

export function Login({
  onLogin,
  onDemoMode,
  onSwitchToSignUp,
  onBack,
  initialUsername,
  initialPassword,
}: LoginProps) {
  const { t } = useSafeI18n();
  const [email, setEmail] = useState(initialUsername || "");
  const [password, setPassword] = useState(initialPassword || "");
  const [showPassword, setShowPassword] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  // Update fields when initial values change (from signup auto-fill)
  useEffect(() => {
    if (initialUsername) {
      setEmail(initialUsername);
    }
    if (initialPassword) {
      setPassword(initialPassword);
    }
  }, [initialUsername, initialPassword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    // Password length validation
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    // Authenticate with full email as username
    const user = UserService.authenticate(email, password);
    
    if (user) {
      // Set as current user
      UserService.setCurrentUser(user.id);
      toast.success(`Welcome back, ${user.nickname || user.username}!`);
      // Success - proceed with login
      onLogin(email, password);
    } else {
      toast.error('Invalid username or password. Please try again.');
    }
  };

  return (
    <AuthLayout onBack={onBack}>
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('email_or_username')}
          </label>
          <Input
            value={email}
            onChange={setEmail}
            placeholder={t('enter_username')}
            type="text"
            icon={<Mail className="w-5 h-5" />}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('password')}
          </label>
          <div className="relative">
            <Input
              value={password}
              onChange={setPassword}
              placeholder={t('enter_password')}
              type={showPassword ? "text" : "password"}
              icon={<Lock className="w-5 h-5" />}
              className="w-full"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-[#008080] focus:ring-[#008080]"
            />
            <span className="text-sm text-gray-600">
              {t('remember_me')}
            </span>
          </label>
          <button
            type="button"
            className="text-sm hover:underline"
            style={{ color: "var(--theme-color)" }}
            onClick={() => toast.info(t('password_reset_coming_soon'))}
          >
            {t('forgot_password')}
          </button>
        </div>

        <Button
          variant="primary"
          className="w-full mt-6"
          disabled={!email || !password}
        >
          {t('sign_in')}
        </Button>
      </form>

      {/* Sign Up */}
      <p className="text-center text-sm text-gray-600 mt-4">
        {t('no_account')}{" "}
        <button
          onClick={onSwitchToSignUp}
          className="font-medium hover:underline"
          style={{ color: "var(--theme-color)" }}
        >
          {t('sign_up')}
        </button>
      </p>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="text-sm text-gray-500">{t('or')}</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {/* Demo Mode - Always available */}
      <button
        onClick={onDemoMode}
        className="w-full py-3 border-2 rounded-lg font-medium transition-colors"
        style={{
          borderColor: "var(--theme-color)",
          color: "var(--theme-color)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor =
            "rgba(0, 128, 128, 0.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor =
            "transparent";
        }}
      >
        {t('continue_demo')}
      </button>

      {/* Change Language */}
      <button
        onClick={() => setShowLanguageSelector(true)}
        className="w-full py-3 border-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mt-3"
        style={{
          borderColor: "var(--theme-color)",
          color: "var(--theme-color)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor =
            "rgba(0, 128, 128, 0.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor =
            "transparent";
        }}
      >
        <Globe className="w-5 h-5" />
        {t('change_language')}
      </button>

      {/* Language Selector Modal */}
      <LanguageSelector
        isOpen={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
      />
    </AuthLayout>
  );
}