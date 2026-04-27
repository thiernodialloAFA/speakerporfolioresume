import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Profile, SpeakerExperience, ProfessionalExperience, Certification } from '../types';

interface AppState {
  isAuthenticated: boolean;
  profile: Profile;
  speakerExperiences: SpeakerExperience[];
  professionalExperiences: ProfessionalExperience[];
  certifications: Certification[];

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
}

const defaultProfile: Profile = {
  name: 'Alex Johnson',
  title: 'Senior Software Engineer & Tech Speaker',
  bio: 'Passionate technologist with 10+ years of experience building scalable systems. I speak at conferences worldwide about cloud architecture, DevOps practices, and modern web development. My mission is to make complex technical concepts accessible to everyone.',
  photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&h=600&fit=crop',
  email: 'alex.johnson@example.com',
  linkedin: 'https://linkedin.com/in/alexjohnson',
  github: 'https://github.com/alexjohnson',
  twitter: 'https://twitter.com/alexjohnson',
  location: 'San Francisco, CA',
};

const defaultSpeakerExperiences: SpeakerExperience[] = [
  {
    id: '1',
    title: 'Building Resilient Microservices at Scale',
    eventName: 'KubeCon North America',
    date: '2024-11',
    description: 'Delivered a deep-dive session on patterns for building fault-tolerant microservices using Kubernetes, focusing on circuit breakers, retry logic, and observability.',
    eventLink: 'https://kccncna2024.sched.com',
    videoLink: 'https://youtube.com/watch?v=example1',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=450&fit=crop',
    tags: ['Kubernetes', 'Microservices', 'Cloud Native'],
  },
  {
    id: '2',
    title: 'The Future of Web Performance',
    eventName: 'React Summit 2024',
    date: '2024-06',
    description: 'Explored cutting-edge techniques for optimizing React applications, including Server Components, streaming SSR, and the new React compiler.',
    eventLink: 'https://reactsummit.com',
    videoLink: 'https://youtube.com/watch?v=example2',
    imageUrl: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=450&fit=crop',
    tags: ['React', 'Performance', 'Web Development'],
  },
  {
    id: '3',
    title: 'DevOps Culture: Beyond the Tools',
    eventName: 'DevOpsDays Chicago',
    date: '2024-03',
    description: 'A talk about how organizational culture and psychological safety are the real foundations of successful DevOps transformation, with practical frameworks for teams.',
    eventLink: 'https://devopsdays.org/chicago',
    imageUrl: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&h=450&fit=crop',
    tags: ['DevOps', 'Culture', 'Leadership'],
  },
  {
    id: '4',
    title: 'GraphQL Federation in Production',
    eventName: 'GraphQL Summit',
    date: '2023-11',
    description: 'Shared lessons learned from migrating a monolithic API to a federated GraphQL architecture serving 50M+ requests per day.',
    eventLink: 'https://summit.graphql.com',
    videoLink: 'https://youtube.com/watch?v=example4',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop',
    tags: ['GraphQL', 'API Design', 'Architecture'],
  },
];

const defaultProfessionalExperiences: ProfessionalExperience[] = [
  {
    id: '1',
    company: 'TechCorp Inc.',
    role: 'Principal Software Engineer',
    startDate: '2021-03',
    location: 'San Francisco, CA (Remote)',
    description: 'Leading the platform engineering team responsible for the core infrastructure serving 10M+ daily active users.',
    achievements: [
      'Reduced infrastructure costs by 40% through Kubernetes optimization and spot instance adoption',
      'Led migration from monolith to microservices, improving deployment frequency from monthly to multiple times per day',
      'Built internal developer platform adopted by 200+ engineers',
      'Mentored 8 engineers to senior-level promotions',
    ],
  },
  {
    id: '2',
    company: 'StartupXYZ',
    role: 'Senior Software Engineer',
    startDate: '2018-06',
    endDate: '2021-02',
    location: 'New York, NY',
    description: 'Full-stack engineer on a fast-growing fintech startup, scaling the platform from 0 to 1M users.',
    achievements: [
      'Architected and built the real-time transaction processing system handling $50M/day',
      'Improved API response times by 65% through caching strategies and query optimization',
      'Led the technical interview process and grew the engineering team from 5 to 25',
    ],
  },
  {
    id: '3',
    company: 'Digital Agency Co.',
    role: 'Software Engineer',
    startDate: '2015-09',
    endDate: '2018-05',
    location: 'Chicago, IL',
    description: 'Delivered web applications for Fortune 500 clients across healthcare, retail, and finance industries.',
    achievements: [
      'Delivered 12 major client projects on time and within budget',
      'Introduced automated testing practices, reducing post-deployment bugs by 70%',
      'Built a reusable component library used across all client projects',
    ],
  },
  {
    id: '4',
    company: 'FreelanceDevs',
    role: 'Junior Developer',
    startDate: '2014-01',
    endDate: '2015-08',
    location: 'Remote',
    description: 'Freelance web development for small businesses and startups.',
    achievements: [
      'Completed 30+ freelance projects including e-commerce sites, landing pages, and web apps',
      'Maintained 5-star rating on Upwork with 100% job success score',
    ],
  },
];

const defaultCertifications: Certification[] = [
  {
    id: '1',
    name: 'Certified Kubernetes Administrator (CKA)',
    issuer: 'Cloud Native Computing Foundation',
    date: '2023-08',
    credentialUrl: 'https://www.cncf.io/certification/cka/',
    description: 'Demonstrated expertise in Kubernetes administration, cluster management, and troubleshooting.',
  },
  {
    id: '2',
    name: 'AWS Solutions Architect Professional',
    issuer: 'Amazon Web Services',
    date: '2022-11',
    credentialUrl: 'https://aws.amazon.com/certification/',
    description: 'Advanced certification validating expertise in designing distributed systems on AWS.',
  },
  {
    id: '3',
    name: 'Google Cloud Professional Data Engineer',
    issuer: 'Google Cloud',
    date: '2022-04',
    credentialUrl: 'https://cloud.google.com/certification',
    description: 'Expertise in designing and building data processing systems on Google Cloud Platform.',
  },
  {
    id: '4',
    name: 'HashiCorp Certified: Terraform Associate',
    issuer: 'HashiCorp',
    date: '2021-09',
    credentialUrl: 'https://www.hashicorp.com/certification/terraform-associate',
    description: 'Proficiency in Infrastructure as Code using Terraform for multi-cloud environments.',
  },
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      profile: defaultProfile,
      speakerExperiences: defaultSpeakerExperiences,
      professionalExperiences: defaultProfessionalExperiences,
      certifications: defaultCertifications,

      login: (email: string, password: string) => {
        if (email === 'admin@portfolio.com' && password === 'Admin@2024') {
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
          professionalExperiences: state.professionalExperiences.map((e) => (e.id === exp.id ? exp : e)),
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
    }),
    {
      name: 'speaker-portfolio-storage',
    }
  )
);
