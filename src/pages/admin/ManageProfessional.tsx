import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2, ArrowLeft, X, Save, Briefcase } from 'lucide-react';
import { useStore } from '../../store';
import { ProfessionalExperience } from '../../types';
import { format, parseISO } from 'date-fns';

const schema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  location: z.string().min(1, 'Location is required'),
  startDate: z.string().regex(/^\d{4}-\d{2}$/, 'Use YYYY-MM'),
  endDate: z.string().regex(/^\d{4}-\d{2}$/, 'Use YYYY-MM').or(z.literal('')),
  description: z.string().min(1, 'Description is required'),
  achievements: z.array(z.object({ value: z.string() })),
  skills: z.string(),
  companyLogo: z.string().url('Must be a valid URL').or(z.string().length(0)),
});

type FormData = z.infer<typeof schema>;

export default function ManageProfessional() {
  const { professionalExperiences, addProfessionalExperience, updateProfessionalExperience, deleteProfessionalExperience } = useStore();
  const navigate = useNavigate();
  const [editing, setEditing] = useState<ProfessionalExperience | null>(null);
  const [showForm, setShowForm] = useState(false);

  const sorted = [...professionalExperiences].sort((a, b) => b.startDate.localeCompare(a.startDate));

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { fields: achievementFields, append, remove } = useFieldArray({ control, name: 'achievements' });

  const openAdd = () => {
    setEditing(null);
    reset({ company: '', role: '', location: '', startDate: '', endDate: '', description: '', achievements: [{ value: '' }], skills: '', companyLogo: '' });
    setShowForm(true);
  };

  const openEdit = (exp: ProfessionalExperience) => {
    setEditing(exp);
    reset({
      company: exp.company,
      role: exp.role,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate || '',
      description: exp.description,
      achievements: exp.achievements.map((a) => ({ value: a })),
      skills: (exp.skills || []).join(', '),
      companyLogo: exp.companyLogo || '',
    });
    setShowForm(true);
  };

  const onSubmit = (data: FormData) => {
    const achievements = data.achievements.map((a) => a.value).filter(Boolean);
    const skills = data.skills.split(',').map((s) => s.trim()).filter(Boolean);
    const base = {
      ...data,
      achievements,
      skills,
      location: data.location,
      endDate: data.endDate || undefined,
      companyLogo: data.companyLogo || undefined,
    };
    if (editing) {
      updateProfessionalExperience({ ...editing, ...base });
    } else {
      addProfessionalExperience({ id: crypto.randomUUID(), ...base });
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
            <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center">
              <Briefcase size={20} className="text-violet-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Professional Experience</h1>
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-xl text-sm transition-all">
            <Plus size={16} /> Add Role
          </button>
        </div>

        {/* Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white">{editing ? 'Edit Role' : 'Add New Role'}</h2>
                  <button onClick={() => setShowForm(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700">
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {[
                    { name: 'company' as const, label: 'Company', type: 'text', placeholder: undefined },
                    { name: 'role' as const, label: 'Job Title / Role', type: 'text', placeholder: undefined },
                    { name: 'location' as const, label: 'Location', type: 'text', placeholder: 'San Francisco, CA' },
                    { name: 'startDate' as const, label: 'Start Date (YYYY-MM)', type: 'text', placeholder: '2020-03' },
                    { name: 'endDate' as const, label: 'End Date (YYYY-MM, leave blank if current)', type: 'text', placeholder: '2023-11' },
                    { name: 'companyLogo' as const, label: 'Company Logo URL (optional)', type: 'url', placeholder: undefined },
                    { name: 'skills' as const, label: 'Skills (comma-separated)', type: 'text', placeholder: 'React, TypeScript, Node.js' },
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

                  {/* Achievements */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Key Achievements</label>
                    <div className="space-y-2">
                      {achievementFields.map((field, idx) => (
                        <div key={field.id} className="flex gap-2">
                          <input
                            {...register(`achievements.${idx}.value`)}
                            placeholder={`Achievement ${idx + 1}`}
                            className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-teal-500"
                          />
                          {achievementFields.length > 1 && (
                            <button type="button" onClick={() => remove(idx)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg">
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => append({ value: '' })}
                        className="text-teal-400 hover:text-teal-300 text-xs flex items-center gap-1 mt-1"
                      >
                        <Plus size={14} /> Add Achievement
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl transition-all text-sm">
                    <Save size={16} />
                    {editing ? 'Save Changes' : 'Add Role'}
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
              {exp.companyLogo && (
                <img src={exp.companyLogo} alt={exp.company} className="w-12 h-12 object-contain rounded-lg flex-shrink-0 bg-white p-1" />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white">{exp.role}</h3>
                <p className="text-teal-400 text-sm">{exp.company}</p>
                <p className="text-slate-500 text-xs mt-0.5">
                  {formatDate(exp.startDate)} – {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(exp)} className="p-2 text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 rounded-lg transition-all">
                  <Pencil size={16} />
                </button>
                <button onClick={() => deleteProfessionalExperience(exp.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
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
