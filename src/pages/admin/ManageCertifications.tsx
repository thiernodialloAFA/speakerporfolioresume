import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2, ArrowLeft, X, Save, Award } from 'lucide-react';
import { useStore } from '../../store';
import { Certification } from '../../types';
import { format, parseISO } from 'date-fns';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  issuingOrg: z.string().min(1, 'Issuing org is required'),
  issueDate: z.string().regex(/^\d{4}-\d{2}$/, 'Use YYYY-MM'),
  expiryDate: z.string().regex(/^\d{4}-\d{2}$/, 'Use YYYY-MM').or(z.literal('')),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url('Must be a valid URL').or(z.string().length(0)),
  logoUrl: z.string().url('Must be a valid URL').or(z.string().length(0)),
});

type FormData = z.infer<typeof schema>;

export default function ManageCertifications() {
  const { certifications, addCertification, updateCertification, deleteCertification } = useStore();
  const navigate = useNavigate();
  const [editing, setEditing] = useState<Certification | null>(null);
  const [showForm, setShowForm] = useState(false);

  const sorted = [...certifications].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const openAdd = () => {
    setEditing(null);
    reset({ name: '', issuingOrg: '', issueDate: '', expiryDate: '', credentialId: '', credentialUrl: '', logoUrl: '' });
    setShowForm(true);
  };

  const openEdit = (cert: Certification) => {
    setEditing(cert);
    reset({
      name: cert.name,
      issuingOrg: cert.issuingOrg || cert.issuer || '',
      issueDate: cert.issueDate || cert.date || '',
      expiryDate: cert.expiryDate || '',
      credentialId: cert.credentialId || '',
      credentialUrl: cert.credentialUrl || '',
      logoUrl: cert.logoUrl || '',
    });
    setShowForm(true);
  };

  const onSubmit = (data: FormData) => {
    const base = {
      ...data,
      issuer: data.issuingOrg,
      date: data.issueDate,
      expiryDate: data.expiryDate || undefined,
      credentialId: data.credentialId || undefined,
      credentialUrl: data.credentialUrl || undefined,
      logoUrl: data.logoUrl || undefined,
    };
    if (editing) {
      updateCertification({ ...editing, ...base });
    } else {
      addCertification({ id: crypto.randomUUID(), ...base });
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
            <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <Award size={20} className="text-yellow-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Certifications</h1>
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-xl text-sm transition-all">
            <Plus size={16} /> Add Cert
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
                  <h2 className="text-lg font-bold text-white">{editing ? 'Edit Certification' : 'Add Certification'}</h2>
                  <button onClick={() => setShowForm(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700">
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {[
                    { name: 'name' as const, label: 'Certification Name', type: 'text', placeholder: undefined },
                    { name: 'issuingOrg' as const, label: 'Issuing Organization', type: 'text', placeholder: undefined },
                    { name: 'issueDate' as const, label: 'Issue Date (YYYY-MM)', type: 'text', placeholder: '2024-01' },
                    { name: 'expiryDate' as const, label: 'Expiry Date (YYYY-MM, optional)', type: 'text', placeholder: '2027-01' },
                    { name: 'credentialId' as const, label: 'Credential ID (optional)', type: 'text', placeholder: undefined },
                    { name: 'credentialUrl' as const, label: 'Credential URL (optional)', type: 'url', placeholder: undefined },
                    { name: 'logoUrl' as const, label: 'Logo URL (optional)', type: 'url', placeholder: undefined },
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

                  <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl transition-all text-sm">
                    <Save size={16} />
                    {editing ? 'Save Changes' : 'Add Certification'}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sorted.map((cert) => (
            <motion.div
              key={cert.id}
              layout
              className="flex items-start gap-4 p-5 bg-slate-800 border border-slate-700 rounded-2xl hover:border-slate-600 transition-all"
            >
              {cert.logoUrl ? (
                <img src={cert.logoUrl} alt={cert.issuingOrg || cert.issuer} className="w-12 h-12 object-contain rounded-lg bg-white p-1 flex-shrink-0" />
              ) : (
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award size={22} className="text-yellow-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white text-sm leading-snug">{cert.name}</h3>
                <p className="text-teal-400 text-xs mt-0.5">{cert.issuingOrg || cert.issuer}</p>
                <p className="text-slate-500 text-xs mt-0.5">
                  {formatDate(cert.issueDate || cert.date)}{cert.expiryDate ? ` – ${formatDate(cert.expiryDate)}` : ''}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => openEdit(cert)} className="p-2 text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 rounded-lg transition-all">
                  <Pencil size={15} />
                </button>
                <button onClick={() => deleteCertification(cert.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                  <Trash2 size={15} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
