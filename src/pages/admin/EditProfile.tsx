import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, ArrowLeft, User } from 'lucide-react';
import { useStore } from '../../store';
import { Profile } from '../../types';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  bio: z.string().min(1, 'Bio is required'),
  photoUrl: z.string().url('Must be a valid URL').or(z.string().length(0)),
  bannerUrl: z.string().url('Must be a valid URL').or(z.string().length(0)),
  email: z.string().email('Must be a valid email').or(z.string().length(0)),
  linkedin: z.string().url('Must be a valid URL').or(z.string().length(0)),
  github: z.string().url('Must be a valid URL').or(z.string().length(0)),
  twitter: z.string().url('Must be a valid URL').or(z.string().length(0)),
  location: z.string(),
});

export default function EditProfile() {
  const { profile, updateProfile } = useStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<Profile>({
    resolver: zodResolver(profileSchema),
    defaultValues: profile,
  });

  useEffect(() => {
    reset(profile);
  }, [profile, reset]);

  const onSubmit = (data: Profile) => {
    updateProfile(data);
    navigate('/admin');
  };

  const fields = [
    { name: 'name' as const, label: 'Full Name', type: 'text', placeholder: 'Alex Johnson' },
    { name: 'title' as const, label: 'Professional Title', type: 'text', placeholder: 'Senior Software Engineer & Tech Speaker' },
    { name: 'email' as const, label: 'Email', type: 'email', placeholder: 'alex@example.com' },
    { name: 'location' as const, label: 'Location', type: 'text', placeholder: 'San Francisco, CA' },
    { name: 'photoUrl' as const, label: 'Photo URL', type: 'url', placeholder: 'https://...' },
    { name: 'bannerUrl' as const, label: 'Banner Image URL', type: 'url', placeholder: 'https://...' },
    { name: 'linkedin' as const, label: 'LinkedIn URL', type: 'url', placeholder: 'https://linkedin.com/in/...' },
    { name: 'github' as const, label: 'GitHub URL', type: 'url', placeholder: 'https://github.com/...' },
    { name: 'twitter' as const, label: 'Twitter URL', type: 'url', placeholder: 'https://twitter.com/...' },
  ];

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors text-sm"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center">
              <User size={20} className="text-teal-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-slate-800 border border-slate-700 rounded-2xl p-6">
            {fields.map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
                <input
                  {...register(name)}
                  type={type}
                  placeholder={placeholder}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors text-sm"
                />
                {errors[name] && (
                  <p className="mt-1 text-xs text-red-400">{errors[name]?.message}</p>
                )}
              </div>
            ))}

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Bio</label>
              <textarea
                {...register('bio')}
                rows={4}
                placeholder="Tell the world about yourself..."
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors text-sm resize-none"
              />
              {errors.bio && (
                <p className="mt-1 text-xs text-red-400">{errors.bio.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isDirty}
              className="w-full flex items-center justify-center gap-2 py-3 bg-teal-500 hover:bg-teal-600 disabled:opacity-40 text-white font-semibold rounded-xl transition-all"
            >
              <Save size={18} />
              Save Profile
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
