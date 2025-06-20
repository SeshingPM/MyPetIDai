
export interface TeamMember {
    name: string;
    role: string;
    summary: string;
    image: string;
    credentials: string;
    specialty: string;
    colorTheme: string;
    gradientBg: string;
    borderColor: string;
    keyHighlights: string[];
    expertise: string[];
    achievements: string[];
    delay: number;
  }
  
  export const teamMembers: TeamMember[] = [
    {
      name: 'Corey Pierson',
      role: 'Co-Founder',
      summary: 'Tech executive who founded My Pet ID to solve real-world pet health record management problems.',
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=80&h=80&fit=crop&crop=face',
      credentials: 'Tech Executive & Serial Entrepreneur',
      specialty: 'Pet Healthcare Technology & Product Vision',
      colorTheme: 'from-blue-500 to-indigo-600',
      gradientBg: 'from-blue-50 to-indigo-100',
      borderColor: 'border-blue-200',
      keyHighlights: [
        'Founded My Pet ID to solve pet health record challenges',
        'Serial entrepreneur with multiple successful ventures',
        'Expert in product strategy and team scaling'
      ],
      expertise: [
        'Tech industry leadership',
        'Product strategy and vision',
        'Pet healthcare innovation',
        'Team building and scaling'
      ],
      achievements: [
        'Founded multiple successful tech ventures',
        'Led digital transformation initiatives',
        'Pet industry thought leader'
      ],
      delay: 100
    },
    {
      name: 'Nicolas Chereque',
      role: 'Co-Founder',
      summary: 'Seasoned entrepreneur and pet industry innovator with expertise in strategic partnerships and business development.',
      image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=80&h=80&fit=crop&crop=face',
      credentials: 'Entrepreneur & Pet Industry Innovator',
      specialty: 'Strategic Partnerships & Business Development',
      colorTheme: 'from-emerald-500 to-teal-600',
      gradientBg: 'from-emerald-50 to-teal-100',
      borderColor: 'border-emerald-200',
      keyHighlights: [
        'Built multiple pet-focused ventures from ground up',
        'Extensive network across the pet industry ecosystem',
        'Strategic partnerships that drive growth'
      ],
      expertise: [
        'Pet industry ecosystem expertise',
        'Strategic partnership development',
        'Business scaling and growth',
        'Market expansion strategies'
      ],
      achievements: [
        'Built multiple pet-focused ventures',
        'Established key industry partnerships',
        'Pet care innovation advocate'
      ],
      delay: 200
    },
    {
      name: 'Vinny Merugumala',
      role: 'Co-Founder',
      summary: 'Software systems expert with expertise in scalable infrastructure and AI-driven automation.',
      image: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=80&h=80&fit=crop&crop=face',
      credentials: 'Software Systems Expert & Technical Visionary',
      specialty: 'Scalable Infrastructure & AI-Driven Automation',
      colorTheme: 'from-purple-500 to-violet-600',
      gradientBg: 'from-purple-50 to-violet-100',
      borderColor: 'border-purple-200',
      keyHighlights: [
        'Architected the secure, scalable My Pet ID platform',
        'Expert in AI integration and machine learning',
        'Cloud infrastructure and security specialist'
      ],
      expertise: [
        'Full-stack system architecture',
        'AI and machine learning integration',
        'Cloud infrastructure and security',
        'Scalable platform development'
      ],
      achievements: [
        'Architected enterprise-scale platforms',
        'AI integration specialist',
        'Cloud security expert'
      ],
      delay: 300
    }
  ];