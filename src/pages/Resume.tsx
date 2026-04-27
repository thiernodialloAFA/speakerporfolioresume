import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Briefcase, Award, MapPin, Calendar, ExternalLink, CheckCircle } from 'lucide-react';
import { useStore } from '../store';
import { format, parseISO } from 'date-fns';
import jsPDF from 'jspdf';
// @ts-ignore
import html2canvas from 'html2canvas';

export default function Resume() {
  const { profile, professionalExperiences, certifications } = useStore();
  const resumeRef = useRef<HTMLDivElement>(null);

  const sortedProfessional = [...professionalExperiences].sort((a, b) =>
    b.startDate.localeCompare(a.startDate)
  );
  const sortedCerts = [...certifications].sort((a, b) => b.date.localeCompare(a.date));

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr + '-01'), 'MMM yyyy');
    } catch (_e) {
      return dateStr;
    }
  };

  const handleDownloadPDF = async () => {
    if (!resumeRef.current) return;

    const btn = document.getElementById('pdf-download-btn');
    if (btn) btn.style.display = 'none';

    try {
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0F172A',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const pageHeight = pdf.internal.pageSize.getHeight();

      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${profile.name.replace(/\s+/g, '_')}_Resume.pdf`);
    } finally {
      if (btn) btn.style.display = '';
    }
  };

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-white">Resume</h1>
            <p className="text-slate-400 mt-1">Professional experience & qualifications</p>
          </motion.div>
          <motion.button
            id="pdf-download-btn"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-5 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-teal-500/25 shrink-0"
          >
            <Download size={18} />
            Download PDF
          </motion.button>
        </div>

        {/* Resume content */}
        <div ref={resumeRef} className="space-y-8">
          {/* Profile header for PDF */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50 rounded-2xl"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <img
                src={profile.photoUrl}
                alt={profile.name}
                className="w-24 h-24 rounded-2xl object-cover ring-2 ring-teal-500/30"
              />
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white">{profile.name}</h2>
                <p className="text-teal-400 text-lg font-medium mt-1">{profile.title}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-400">
                  {profile.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={14} className="text-teal-400" />
                      {profile.location}
                    </span>
                  )}
                  {profile.email && (
                    <span className="flex items-center gap-1">
                      <span className="text-teal-400">✉</span>
                      {profile.email}
                    </span>
                  )}
                </div>
                {profile.bio && (
                  <p className="text-slate-300 text-sm mt-4 leading-relaxed max-w-2xl">{profile.bio}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Professional Experience */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center">
                <Briefcase size={20} className="text-teal-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Professional Experience</h2>
            </div>

            <div className="relative pl-6 space-y-0">
              <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-gradient-to-b from-teal-500 via-indigo-500 to-transparent" />

              {sortedProfessional.map((exp, idx) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="relative pb-8 last:pb-0"
                >
                  <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-teal-500 border-2 border-slate-900 shadow-lg shadow-teal-500/50" />

                  <div className="p-6 bg-slate-800/60 border border-slate-700/50 rounded-2xl ml-4 hover:border-teal-500/20 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{exp.role}</h3>
                        <p className="text-teal-400 font-medium">{exp.company}</p>
                      </div>
                      <div className="flex flex-col sm:items-end gap-1 shrink-0">
                        <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                          <Calendar size={13} />
                          <span>
                            {formatDate(exp.startDate)} – {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                          <MapPin size={13} />
                          <span>{exp.location}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-slate-400 text-sm mb-4">{exp.description}</p>

                    {exp.achievements.length > 0 && (
                      <ul className="space-y-2">
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                            <CheckCircle size={15} className="text-teal-400 mt-0.5 shrink-0" />
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Certifications */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                <Award size={20} className="text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Certifications & Learning</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sortedCerts.map((cert, idx) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.05 }}
                  className="p-5 bg-slate-800/60 border border-slate-700/50 rounded-2xl hover:border-indigo-500/20 transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-sm group-hover:text-indigo-400 transition-colors">
                        {cert.name}
                      </h3>
                      <p className="text-indigo-400 text-xs mt-1">{cert.issuer}</p>
                    </div>
                    <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center shrink-0">
                      <Award size={16} className="text-indigo-400" />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-3">
                    <Calendar size={11} />
                    <span>{formatDate(cert.date)}</span>
                  </div>

                  {cert.description && (
                    <p className="text-slate-400 text-xs mt-2 line-clamp-2">{cert.description}</p>
                  )}

                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-teal-400 hover:text-teal-300 text-xs mt-3 transition-colors"
                    >
                      <ExternalLink size={11} />
                      View Credential
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
