import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Profile, SpeakerExperience, ProfessionalExperience, Certification } from '../types';
import portfolioData from '../data/portfolio.json';

// Default content is loaded from `src/data/portfolio.json`. That file is
// committed to the repository, so the portfolio content is version-controlled
// and "pushable on git": the admin edits content via the /admin UI, exports
// the resulting JSON from the dashboard, replaces `src/data/portfolio.json`
// with it, and commits & pushes.
//
// Admin credentials are read from build-time environment variables so they
// can be defined or overridden when deploying the app:
//   - VITE_ADMIN_EMAIL    (default: admin@portfolio.com)
//   - VITE_ADMIN_PASSWORD (default: Admin@2024)

const defaultProfile: Profile = portfolioData.profile as Profile;
const defaultSpeakerExperiences: SpeakerExperience[] =
  portfolioData.speakerExperiences as SpeakerExperience[];
const defaultProfessionalExperiences: ProfessionalExperience[] =
  portfolioData.professionalExperiences as ProfessionalExperience[];
const defaultCertifications: Certification[] =
  portfolioData.certifications as Certification[];

const ADMIN_EMAIL =
  (import.meta.env.VITE_ADMIN_EMAIL as string | undefined) || 'admin@portfolio.com';
const ADMIN_PASSWORD =
  (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) || 'Admin@2024';

export interface PortfolioData {
  profile: Profile;
  speakerExperiences: SpeakerExperience[];
  professionalExperiences: ProfessionalExperience[];
  certifications: Certification[];
}

interface AppState extends PortfolioData {
  isAuthenticated: boolean;

  login: (email: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (profile: Profile) => void;
  addSpeakerExperience: (exp: SpeakerExperience) => void;
  updateSpeakerExperience: (exp: SpeakerExperience) => void;
  deleteSpeakerExperience: (id: string) => void;
  addProfessionalExperience: (exp: ProfessionalExperience) => void;
  updateProfessionalExperience: (exp: ProfessionalExperience) => void;
  deleteProfessionalExperience: (id: string) => void;
  addCertification: (cert: Certification) => void;
  updateCertification: (cert: Certification) => void;
  deleteCertification: (id: string) => void;

  /** Returns the current portfolio content as a JSON string ready to be
   *  saved as `src/data/portfolio.json` and committed to git. */
  exportData: () => string;
  /** Replaces the in-memory portfolio content with the provided data. */
  importData: (data: PortfolioData) => void;
  /** Reset the portfolio content to the defaults bundled with the app. */
  resetToDefaults: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      profile: defaultProfile,
      speakerExperiences: defaultSpeakerExperiences,
      professionalExperiences: defaultProfessionalExperiences,
      certifications: defaultCertifications,

      login: (email: string, password: string) => {
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => set({ isAuthenticated: false }),

      updateProfile: (profile: Profile) => set({ profile }),

      addSpeakerExperience: (exp: SpeakerExperience) =>
        set((state) => ({
          speakerExperiences: [exp, ...state.speakerExperiences],
        })),

      updateSpeakerExperience: (exp: SpeakerExperience) =>
        set((state) => ({
          speakerExperiences: state.speakerExperiences.map((e) => (e.id === exp.id ? exp : e)),
        })),

      deleteSpeakerExperience: (id: string) =>
        set((state) => ({
          speakerExperiences: state.speakerExperiences.filter((e) => e.id !== id),
        })),

      addProfessionalExperience: (exp: ProfessionalExperience) =>
        set((state) => ({
          professionalExperiences: [exp, ...state.professionalExperiences],
        })),

      updateProfessionalExperience: (exp: ProfessionalExperience) =>
        set((state) => ({
          professionalExperiences: state.professionalExperiences.map((e) =>
            e.id === exp.id ? exp : e
          ),
        })),

      deleteProfessionalExperience: (id: string) =>
        set((state) => ({
          professionalExperiences: state.professionalExperiences.filter((e) => e.id !== id),
        })),

      addCertification: (cert: Certification) =>
        set((state) => ({
          certifications: [cert, ...state.certifications],
        })),

      updateCertification: (cert: Certification) =>
        set((state) => ({
          certifications: state.certifications.map((c) => (c.id === cert.id ? cert : c)),
        })),

      deleteCertification: (id: string) =>
        set((state) => ({
          certifications: state.certifications.filter((c) => c.id !== id),
        })),

      exportData: () => {
        const state = get();
        const data: PortfolioData = {
          profile: state.profile,
          speakerExperiences: state.speakerExperiences,
          professionalExperiences: state.professionalExperiences,
          certifications: state.certifications,
        };
        return JSON.stringify(data, null, 2);
      },

      importData: (data: PortfolioData) =>
        set({
          profile: data.profile,
          speakerExperiences: data.speakerExperiences ?? [],
          professionalExperiences: data.professionalExperiences ?? [],
          certifications: data.certifications ?? [],
        }),

      resetToDefaults: () =>
        set({
          profile: defaultProfile,
          speakerExperiences: defaultSpeakerExperiences,
          professionalExperiences: defaultProfessionalExperiences,
          certifications: defaultCertifications,
        }),
    }),
    {
      name: 'speaker-portfolio-storage',
      // Only persist authentication flag in localStorage. Portfolio content
      // is sourced from the committed `portfolio.json` so updates pushed to
      // git are picked up by every visitor on the next load.
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated }),
    }
  )
);
