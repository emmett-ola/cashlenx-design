import React, { useState, useEffect } from 'react';
import { Lock, Mail, Eye, EyeOff, User, ArrowLeft, AlertCircle, Globe } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { toast } from 'sonner@2.0.3';
import { AuthLayout } from '../molecules/AuthLayout';
import { UserService, CategoryService } from '../../services/localStorage';
import { LanguageSelector } from '../molecules/LanguageSelector';
import { useSafeI18n } from '../../contexts/I18nContext';

interface SignUpProps {
  onSignUp: (name: string, email: string, password: string) => void;
  onSignUpComplete: (email: string, password: string) => void;
  onSwitchToLogin: () => void;
  onBack?: () => void;
}

type SignUpStep = 'email' | 'verify' | 'complete';

export function SignUp({
  onSignUp,
  onSignUpComplete,
  onSwitchToLogin,
  onBack,
}: SignUpProps) {
  const { t } = useSafeI18n();
  const [step, setStep] = useState<SignUpStep>('email');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [registrationToken, setRegistrationToken] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [shakeField, setShakeField] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  // Format username to display name: john.doe -> John Doe
  const formatDisplayName = (username: string): string => {
    return username
      .split(/[.\-_]/) // Split by dot, dash, or underscore
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Step 1: Send verification code
  const handleSendVerificationCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setShakeField('email');
      setTimeout(() => setShakeField(null), 500);
      toast.error('Please enter your email address.');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setShakeField('email');
      setTimeout(() => setShakeField(null), 500);
      toast.error('Please enter a valid email address.');
      return;
    }

    // Mock API call to send verification code
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 800));

      toast.success('Verification code sent to your email!');
      setStep('verify');
      setResendCountdown(60);
    } catch (error) {
      toast.error('Failed to send verification code. Please try again.');
    }
  };

  // Resend verification code
  const handleResendCode = async () => {
    if (resendCountdown > 0) return;

    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 800));

      toast.success('Verification code resent!');
      setResendCountdown(60);
    } catch (error) {
      toast.error('Failed to resend code. Please try again.');
    }
  };

  // Step 2: Verify code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!verificationCode) {
      setShakeField('verificationCode');
      setTimeout(() => setShakeField(null), 500);
      toast.error('Please enter the verification code.');
      return;
    }

    setIsVerifying(true);

    try {
      // Mock API call to verify code
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate successful verification and getting registration token
      const mockToken = `reg_token_${Date.now()}`;
      setRegistrationToken(mockToken);

      toast.success('Email verified successfully!');
      setStep('complete');
    } catch (error) {
      toast.error('Invalid verification code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Step 3: Complete registration
  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!username) {
      setShakeField('username');
      setTimeout(() => setShakeField(null), 500);
      toast.error('Please fill in all required fields.');
      return;
    }

    if (!password) {
      setShakeField('password');
      setTimeout(() => setShakeField(null), 500);
      toast.error('Please fill in all required fields.');
      return;
    }

    if (!confirmPassword) {
      setShakeField('confirmPassword');
      setTimeout(() => setShakeField(null), 500);
      toast.error('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setShakeField('password');
      setTimeout(() => setShakeField(null), 500);
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setShakeField('confirmPassword');
      setTimeout(() => setShakeField(null), 500);
      toast.error('Passwords do not match.');
      return;
    }

    setIsRegistering(true);

    // Attempt to create user
    try {
      // Mock API call with registration token
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newUser = UserService.create({
        username: username,
        password: password,
        nickname: formatDisplayName(username),
        emailAddress: email,
        role: 'user',
      });

      toast.success('Account created successfully! Please sign in to continue.');
      console.log(`User created successfully! Username: ${username}, User ID: ${newUser.id}, Token: ${registrationToken}`);

      // Navigate to login with auto-fill credentials (email and password)
      onSignUpComplete(email, password);
    } catch (error) {
      setIsRegistering(false);

      if (error instanceof Error) {
        // Show error dialog
        const errorMessage = error.message.includes('already exists')
          ? 'An account with this username already exists.'
          : 'Failed to create account. Please try again.';

        toast.error(errorMessage);
      }
    }
  };

  // Go back to email step
  const handleBackToEmail = () => {
    setStep('email');
    setVerificationCode('');
    setResendCountdown(0);
  };

  // Step 1: Email entry
  if (step === 'email') {
    return (
      <AuthLayout onBack={onBack} subtitle={t('create_account')}>
        <form onSubmit={handleSendVerificationCode} className="space-y-4">
          <div className={shakeField === 'email' ? 'animate-shake' : ''}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('email')} <span className="text-red-500">*</span>
            </label>
            <Input
              value={email}
              onChange={setEmail}
              placeholder="email@example.com"
              type="email"
              icon={<Mail className="w-5 h-5" />}
              className="w-full"
            />
          </div>

          <Button variant="primary" className="w-full mt-6" disabled={!email}>
            {t('send_verification_code')}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          {t('have_account')}{' '}
          <button
            onClick={onSwitchToLogin}
            className="font-medium hover:underline"
            style={{ color: 'var(--theme-color)' }}
          >
            {t('sign_in')}
          </button>
        </p>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-sm text-gray-500">{t('or')}</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Change Language */}
        <button
          onClick={() => setShowLanguageSelector(true)}
          className="w-full py-3 border-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          style={{
            borderColor: "var(--theme-color)",
            color: "var(--theme-color)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(0, 128, 128, 0.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
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

  // Step 2: Verify code
  if (step === 'verify') {
    return (
      <AuthLayout onBack={onBack} subtitle={t('verify_email')}>
        <form onSubmit={handleVerifyCode} className="space-y-4">
          {/* Email (disabled) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('email')}
            </label>
            <Input
              value={email}
              onChange={() => {}}
              placeholder="email@example.com"
              type="email"
              icon={<Mail className="w-5 h-5" />}
              className="w-full bg-gray-100 cursor-not-allowed opacity-60"
              disabled
            />
          </div>

          {/* Verification Code */}
          <div className={shakeField === 'verificationCode' ? 'animate-shake' : ''}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('verification_code')} <span className="text-red-500">*</span>
            </label>
            <Input
              value={verificationCode}
              onChange={setVerificationCode}
              placeholder={t('enter_code')}
              type="text"
              icon={<AlertCircle className="w-5 h-5" />}
              className="w-full"
            />
          </div>

          {/* Resend countdown */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendCountdown > 0}
              className="text-sm font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
              style={{ color: resendCountdown > 0 ? '#9CA3AF' : 'var(--theme-color)' }}
            >
              {resendCountdown > 0 ? `${t('resend_in')} ${resendCountdown}s` : t('resend_code')}
            </button>
          </div>

          {/* Buttons */}
          <div className="space-y-3 mt-6">
            <Button variant="primary" className="w-full" disabled={!verificationCode || isVerifying}>
              {isVerifying ? t('verifying') : t('verify_code_button')}
            </Button>

            <button
              type="button"
              onClick={handleBackToEmail}
              className="w-full py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              {t('back_to_email')}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          {t('have_account')}{' '}
          <button
            onClick={onSwitchToLogin}
            className="font-medium hover:underline"
            style={{ color: 'var(--theme-color)' }}
          >
            {t('sign_in')}
          </button>
        </p>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-sm text-gray-500">{t('or')}</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Change Language */}
        <button
          onClick={() => setShowLanguageSelector(true)}
          className="w-full py-3 border-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          style={{
            borderColor: "var(--theme-color)",
            color: "var(--theme-color)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(0, 128, 128, 0.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
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

  // Step 3: Complete profile
  return (
    <AuthLayout onBack={onBack} subtitle={t('complete_profile')}>
      <form onSubmit={handleCompleteRegistration} className="space-y-4">
        {/* Username */}
        <div className={shakeField === 'username' ? 'animate-shake' : ''}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('username')} <span className="text-red-500">*</span>
          </label>
          <Input
            value={username}
            onChange={setUsername}
            placeholder={t('choose_username')}
            type="text"
            icon={<User className="w-5 h-5" />}
            className="w-full"
          />
        </div>

        {/* Password */}
        <div className={shakeField === 'password' ? 'animate-shake' : ''}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('password')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              value={password}
              onChange={setPassword}
              placeholder={t('password_min_chars')}
              type={showPassword ? 'text' : 'password'}
              icon={<Lock className="w-5 h-5" />}
              className="w-full"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className={shakeField === 'confirmPassword' ? 'animate-shake' : ''}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('confirm_password')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder={t('reenter_password')}
              type={showConfirmPassword ? 'text' : 'password'}
              icon={<Lock className="w-5 h-5" />}
              className="w-full"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          variant="primary"
          className="w-full mt-6"
          disabled={!username || !password || !confirmPassword || isRegistering}
        >
          {isRegistering ? t('creating_account') : t('complete_registration')}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-4">
        {t('have_account')}{' '}
        <button
          onClick={onSwitchToLogin}
          className="font-medium hover:underline"
          style={{ color: 'var(--theme-color)' }}
        >
          {t('sign_in')}
        </button>
      </p>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="text-sm text-gray-500">{t('or')}</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {/* Change Language */}
      <button
        onClick={() => setShowLanguageSelector(true)}
        className="w-full py-3 border-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        style={{
          borderColor: "var(--theme-color)",
          color: "var(--theme-color)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(0, 128, 128, 0.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
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