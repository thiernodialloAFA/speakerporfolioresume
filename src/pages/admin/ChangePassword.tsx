import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Lock,
  KeyRound,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Download,
  Upload,
  RotateCcw,
} from 'lucide-react';
import { useStore, AuthData } from '../../store';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters long'),
    confirmPassword: z.string().min(1, 'Please confirm the new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    path: ['newPassword'],
    message: 'New password must be different from the current password',
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ChangePassword() {
  const {
    setPassword,
    resetPasswordToBundled,
    exportAuth,
    importAuth,
    passwordHash,
    getAdminEmail,
  } = useStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    window.setTimeout(() => setFeedback(null), 6000);
  };

  const onSubmit = async (data: PasswordFormData) => {
    const ok = await setPassword(data.currentPassword, data.newPassword);
    if (!ok) {
      showFeedback('error', 'Current password is incorrect.');
      return;
    }
    reset();
    showFeedback(
      'success',
      'Password updated for this browser. Use "Export auth.json" below and commit the file to git so the change persists across deployments.'
    );
  };

  const handleExportAuth = () => {
    try {
      const json = exportAuth();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'auth.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showFeedback(
        'success',
        'auth.json downloaded. Replace src/data/auth.json with it, then commit & push to git.'
      );
    } catch {
      showFeedback('error', 'Failed to export auth credentials.');
    }
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as Partial<AuthData>;
      if (
        !parsed ||
        typeof parsed !== 'object' ||
        typeof parsed.passwordHash !== 'string' ||
        !/^[a-f0-9]{64}$/i.test(parsed.passwordHash)
      ) {
        showFeedback(
          'error',
          'Invalid auth.json: missing or malformed "passwordHash" (expected a 64-char hex SHA-256 digest).'
        );
        return;
      }
      importAuth({
        email: typeof parsed.email === 'string' ? parsed.email : getAdminEmail(),
        passwordHash: parsed.passwordHash,
      });
      showFeedback('success', 'Auth credentials imported successfully.');
    } catch {
      showFeedback('error', 'Failed to import file: not valid JSON.');
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Reset the admin password back to the value bundled in src/data/auth.json? Any password change saved in this browser will be discarded.'
      )
    ) {
      resetPasswordToBundled();
      showFeedback('success', 'Password reset to the bundled default from auth.json.');
    }
  };

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-teal-400 transition-colors mb-6 text-sm"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-indigo-500 rounded-xl flex items-center justify-center">
              <KeyRound size={20} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Change Password</h1>
          </div>
          <p className="text-slate-400">
            Signed in as <span className="text-teal-400">{getAdminEmail()}</span>
          </p>
        </motion.div>

        {/* Change form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Current password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  {...register('currentPassword')}
                  type="password"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
              {errors.currentPassword && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.currentPassword.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">New password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  {...register('newPassword')}
                  type="password"
                  autoComplete="new-password"
                  className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
              {errors.newPassword && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Confirm new password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  {...register('confirmPassword')}
                  type="password"
                  autoComplete="new-password"
                  className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-teal-500/25"
            >
              <KeyRound size={18} />
              {isSubmitting ? 'Updating...' : 'Update password'}
            </button>
          </form>

          {feedback && (
            <div
              className={`mt-5 flex items-start gap-2 p-3 rounded-xl text-sm border ${
                feedback.type === 'success'
                  ? 'bg-teal-500/10 border-teal-500/30 text-teal-300'
                  : 'bg-red-500/10 border-red-500/30 text-red-300'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
              ) : (
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}
        </motion.div>

        {/* Persistence */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8 p-6 bg-slate-800 border border-slate-700 rounded-2xl"
        >
          <h2 className="font-semibold text-white mb-2">Persist password across deployments</h2>
          <p className="text-slate-400 text-sm mb-4">
            Password changes made above are saved in this browser only. To make the new password
            the default for every visitor and every future deployment, export
            <code className="mx-1 px-1.5 py-0.5 rounded bg-slate-900 text-teal-300">auth.json</code>
            and replace
            <code className="mx-1 px-1.5 py-0.5 rounded bg-slate-900 text-teal-300">
              src/data/auth.json
            </code>
            with it, then commit and push to git. Only the SHA-256 hash is stored — never the
            plain-text password.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleExportAuth}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-teal-500/25"
            >
              <Download size={16} />
              Export auth.json
            </button>
            <button
              type="button"
              onClick={handleImportClick}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-all"
            >
              <Upload size={16} />
              Import auth.json
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-semibold rounded-xl transition-all"
            >
              <RotateCcw size={16} />
              Reset to auth.json
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={handleImportFile}
            />
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Status:{' '}
            {passwordHash
              ? 'this browser is using a locally-changed password (export it to make it the deployment default).'
              : 'this browser is using the default password from src/data/auth.json.'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
