import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, User } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { toast } from 'sonner@2.0.3';
import { AuthLayout } from '../molecules/AuthLayout';
import { UserService, CategoryService } from '../../services/localStorage';

interface SignUpProps {
  onSignUp: (name: string, email: string, password: string) => void;
  onSwitchToLogin: () => void;
  onBack?: () => void;
}

export function SignUp({
  onSignUp,
  onSwitchToLogin,
  onBack,
}: SignUpProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Format username to display name: john.doe -> John Doe
  const formatDisplayName = (username: string): string => {
    return username
      .split(/[.\-_]/) // Split by dot, dash, or underscore
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!email || !password || !confirmPassword) {
      toast.error('Please fill in all fields.');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    // Attempt to create user
    try {
      // Username is the full email address
      const username = email;
      
      // Extract email prefix for display name formatting
      const emailPrefix = email.split('@')[0];
      
      const newUser = UserService.create({
        username: username, // Full email as username
        password: password,
        nickname: formatDisplayName(emailPrefix), // Formatted display name
        emailAddress: email,
        role: 'user',
      });

      // Set as current user
      UserService.setCurrentUser(newUser.id);
      
      // Success
      toast.success(`Welcome to CashLenX, ${formatDisplayName(emailPrefix)}! 🎉`);
      console.log(`User created successfully! Username: ${username}, User ID: ${newUser.id}, Default categories: ${CategoryService.getByUserId(newUser.id).length}`);
      
      onSignUp(formatDisplayName(emailPrefix), email, password);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('already exists')) {
          toast.error('An account with this email already exists.');
        } else {
          toast.error('Failed to create account. Please try again.');
        }
      }
    }
  };

  const isFormValid = email && password && confirmPassword;

  return (
    <AuthLayout onBack={onBack} subtitle="Create your account">
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
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

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Input
              value={password}
              onChange={setPassword}
              placeholder="At least 6 characters"
              type={showPassword ? 'text' : 'password'}
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

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Input
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Re-enter your password"
              type={showConfirmPassword ? 'text' : 'password'}
              icon={<Lock className="w-5 h-5" />}
              className="w-full"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          variant="primary"
          className="w-full mt-6"
          disabled={!isFormValid}
        >
          Create Account
        </Button>
      </form>

      {/* Sign In Link */}
      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account?{' '}
        <button
          onClick={onSwitchToLogin}
          className="font-medium hover:underline"
          style={{ color: 'var(--theme-color)' }}
        >
          Sign In
        </button>
      </p>
    </AuthLayout>
  );
}