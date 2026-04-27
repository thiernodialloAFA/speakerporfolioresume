import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2, ArrowLeft, X, Save, Mic } from 'lucide-react';
import { useStore } from '../../store';
import { SpeakerExperience } from '../../types';
import { format, parseISO } from 'date-fns';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  eventName: z.string().min(1, 'Event name is required'),
  date: z.string().regex(/^\d{4}-\d{2}$/, 'Use YYYY-MM format'),
  description: z.string().min(1, 'Description is required'),
  eventLink: z.string().url('Must be a valid URL').or(z.string().length(0)),
  videoLink: z.string().url('Must be a valid URL').or(z.string().length(0)),
  imageUrl: z.string().url('Must be a valid URL').or(z.string().length(0)),
  tags: z.string(),
});

type FormData = z.infer<typeof schema>;

export default function ManageSpeaking() {
  const { speakerExperiences, addSpeakerExperience, updateSpeakerExperience, deleteSpeakerExperience } = useStore();
  const navigate = useNavigate();
  const [editing, setEditing] = useState<SpeakerExperience | null>(null);
  const [showForm, setShowForm] = useState(false);

  const sorted = [...speakerExperiences].sort((a, b) => b.date.localeCompare(a.date));

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const openAdd = () => {
    setEditing(null);
    reset({ title: '', eventName: '', date: '', description: '', eventLink: '', videoLink: '', imageUrl: '', tags: '' });
    setShowForm(true);
  };

  const openEdit = (exp: SpeakerExperience) => {
    setEditing(exp);
    reset({
      title: exp.title,
      eventName: exp.eventName,
      date: exp.date,
      description: exp.description,
      eventLink: exp.eventLink || '',
      videoLink: exp.videoLink || '',
      imageUrl: exp.imageUrl || '',
      tags: exp.tags.join(', '),
    });
    setShowForm(true);
  };

  const onSubmit = (data: FormData) => {
    const tags = data.tags.split(',').map((t) => t.trim()).filter(Boolean);
    if (editing) {
      updateSpeakerExperience({
        ...editing,
        ...data,
        tags,
        eventLink: data.eventLink || undefined,
        videoLink: data.videoLink || undefined,
        imageUrl: data.imageUrl || undefined,
      });
    } else {
      addSpeakerExperience({
        id: crypto.randomUUID(),
        ...data,
        tags,
        eventLink: data.eventLink || undefined,
        videoLink: data.videoLink || undefined,
        imageUrl: data.imageUrl || undefined,
      });
    }
    setShowForm(false);
  };

  const formatDate = (d: string) => {
    try { return format(parseISO(d + '-01'), 'MMM yyyy'); } catch (_e) { return d; }
  };

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
              <Mic size={20} className="text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Speaking Experiences</h1>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-xl text-sm transition-all"
          >
            <Plus size={16} /> Add Talk
          </button>
        </div>

        {/* Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white">{editing ? 'Edit Talk' : 'Add New Talk'}</h2>
                  <button onClick={() => setShowForm(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700">
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {[
                    { name: 'title' as const, label: 'Talk Title', type: 'text', placeholder: undefined },
                    { name: 'eventName' as const, label: 'Event Name', type: 'text', placeholder: undefined },
                    { name: 'date' as const, label: 'Date (YYYY-MM)', type: 'text', placeholder: '2024-11' },
                    { name: 'eventLink' as const, label: 'Event Link (optional)', type: 'url', placeholder: undefined },
                    { name: 'videoLink' as const, label: 'Video Link (optional)', type: 'url', placeholder: undefined },
                    { name: 'imageUrl' as const, label: 'Image URL (optional)', type: 'url', placeholder: undefined },
                    { name: 'tags' as const, label: 'Tags (comma-separated)', type: 'text', placeholder: 'React, TypeScript, Web Dev' },
                  ].map(({ name, label, type, placeholder }) => (
                    <div key={name}>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">{label}</label>
                      <input
                        {...register(name)}
                        type={type}
                        placeholder={placeholder}
                        className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-teal-500"
                      />
                      {errors[name] && <p className="mt-1 text-xs text-red-400">{errors[name]?.message}</p>}
                    </div>
                  ))}

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Description</label>
                    <textarea
                      {...register('description')}
                      rows={3}
                      className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-teal-500 resize-none"
                    />
                    {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl transition-all text-sm"
                  >
                    <Save size={16} />
                    {editing ? 'Save Changes' : 'Add Talk'}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* List */}
        <div className="space-y-4">
          {sorted.map((exp) => (
            <motion.div
              key={exp.id}
              layout
              className="flex items-center gap-4 p-5 bg-slate-800 border border-slate-700 rounded-2xl hover:border-slate-600 transition-all"
            >
              {exp.imageUrl && (
                <img src={exp.imageUrl} alt={exp.title} className="w-16 h-14 object-cover rounded-xl flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white truncate">{exp.title}</h3>
                <p className="text-teal-400 text-sm">{exp.eventName}</p>
                <p className="text-slate-500 text-xs mt-0.5">{formatDate(exp.date)}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => openEdit(exp)}
                  className="p-2 text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 rounded-lg transition-all"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => deleteSpeakerExperience(exp.id)}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
