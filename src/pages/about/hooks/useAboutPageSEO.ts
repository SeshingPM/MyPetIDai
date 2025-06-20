import { useMemo } from 'react';

export const useAboutPageSEO = (pathname: string) => {
  return useMemo(() => {
    const baseUrl = 'https://mypetid.vercel.app';
    const canonicalUrl = `${baseUrl}${pathname}`;
    
    return {
      title: 'Meet the Team Behind My Pet ID | Founders, Vision & Mission',
      description: 'Meet the innovative team of pet industry experts, tech leaders, and entrepreneurs building the future of pet document management. Learn about our mission, vision, and commitment to pet families worldwide.',
      keywords: 'My Pet ID team, pet tech founders, pet document management leaders, pet healthcare innovation, digital pet records team, pet ID platform founders',
      canonicalUrl,
      ogType: 'website' as const,
      ogImage: `${baseUrl}/images/about-team-og.jpg`,
      structuredData: [
        {
          type: 'AboutPage',
          data: {
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'About My Pet ID',
            description: 'Learn about My Pet ID\'s mission to revolutionize pet care through comprehensive digital identity management.',
            url: canonicalUrl,
            mainEntity: {
              '@type': 'Organization',
              name: 'My Pet ID',
              description: 'Secure pet document management and reminder platform',
              url: baseUrl,
              logo: `${baseUrl}/logo.png`,
              founder: [
                {
                  '@type': 'Person',
                  name: 'Corey',
                  jobTitle: 'Founder & CEO',
                  description: 'Tech executive with 20+ years experience, founded My Pet ID to solve real-world pet health record management problems.'
                },
                {
                  '@type': 'Person',
                  name: 'Nicolas Chereque',
                  jobTitle: 'Co-Founder',
                  description: 'Seasoned entrepreneur and pet industry innovator with expertise in strategic partnerships and business development.'
                },
                {
                  '@type': 'Person',
                  name: 'Vinny Merugumala',
                  jobTitle: 'CTO',
                  description: 'Software systems expert with 7+ years experience in scalable infrastructure and AI-driven automation.'
                }
              ],
              sameAs: [
                'https://www.linkedin.com/company/mypetid',
                'https://twitter.com/mypetid'
              ]
            }
          }
        },
        {
          type: 'BreadcrumbList',
          data: {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: baseUrl
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'About',
                item: canonicalUrl
              }
            ]
          }
        },
        {
          type: 'FAQPage',
          data: {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Who founded My Pet ID?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'My Pet ID was founded by Corey, a tech executive with 20+ years of experience, along with co-founder Nicolas Chereque, a pet industry innovator, and CTO Vinny Merugumala, a software systems expert.'
                }
              },
              {
                '@type': 'Question',
                name: 'What is My Pet ID\'s mission?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Our mission is to revolutionize pet care by providing every pet with a comprehensive digital identity that simplifies health record management, enhances veterinary care, and gives pet families peace of mind.'
                }
              }
            ]
          }
        }
      ],
      breadcrumbs: [
        { name: 'Home', url: baseUrl },
        { name: 'About', url: canonicalUrl }
      ]
    };
  }, [pathname]);
};