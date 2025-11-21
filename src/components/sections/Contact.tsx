import { useRef } from 'react';
import { useScrollAnimation, useBatchScrollAnimation } from '@/hooks/useScrollAnimation';
import { TextReveal } from '@/components/animations/TextReveal';
import { ContactForm } from '@/components/ui/ContactForm';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PERSONAL_INFO, SOCIAL_LINKS } from '@/utils/constants';

interface ContactInfo {
  icon: string;
  title: string;
  value: string;
  link: string;
  color: string;
}

const contactInfo: ContactInfo[] = [
  {
    icon: '📧',
    title: 'Email',
    value: PERSONAL_INFO.email,
    link: `mailto:${PERSONAL_INFO.email}`,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: '📱',
    title: 'Phone',
    value: PERSONAL_INFO.phone,
    link: `tel:${PERSONAL_INFO.phone}`,
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: '📍',
    title: 'Location',
    value: 'Sojat City, Rajasthan',
    link: '#',
    color: 'from-purple-500 to-pink-500',
  },
];

export const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Animate section entrance
  useScrollAnimation({
    trigger: sectionRef,
    animation: 'fade',
    start: 'top center+=100',
  });

  // Batch animate contact info cards
  useBatchScrollAnimation('.contact-info-card', 'scale', {
    stagger: 0.1,
    duration: 0.6,
  });

  // Form submission handler
  const handleFormSubmit = async (data: { name: string; email: string; message: string }) => {
    // Submit to your backend API
    const response = await fetch('/api/email/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return response.json();
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="min-h-screen py-20 px-4 bg-primary relative overflow-hidden"
    >
      {/* Background Decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <TextReveal
            splitBy="word"
            trigger="scroll"
            className="text-5xl md:text-6xl font-bold text-text-primary mb-6"
          >
            Get In <span className="text-accent">Touch</span>
          </TextReveal>

          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto">
            I'm always open to discussing new projects, creative ideas, or opportunities to
            be part of your visions. Let's build something amazing together!
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactInfo.map((info) => (
            <a
              key={info.title}
              href={info.link}
              className="contact-info-card block"
            >
              <Card
                variant="elevated"
                hoverable
                className="text-center h-full transform transition-all duration-300"
              >
                <div
                  className={`text-5xl w-20 h-20 flex items-center justify-center 
                           rounded-full bg-gradient-to-br ${info.color} mx-auto mb-4 shadow-lg`}
                >
                  {info.icon}
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {info.title}
                </h3>
                <p className="text-accent hover:text-accent-hover transition-colors break-words px-4">
                  {info.value}
                </p>
              </Card>
            </a>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Form - Takes 3 columns */}
          <div ref={formRef} className="lg:col-span-3">
            <ContactForm onSubmit={handleFormSubmit} />
          </div>

          {/* Sidebar - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Why Contact Me */}
            <Card variant="glass">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
                  <span>💡</span>
                  Why Contact Me?
                </h3>
                <ul className="space-y-3 text-text-secondary">
                  {[
                    'Full-stack development expertise',
                    'Modern tech stack proficiency',
                    'Strong problem-solving skills',
                    'Security-focused approach',
                    'Quick learner & team player',
                  ].map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-accent mt-1">▹</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            {/* Social Links */}
            <Card variant="glass">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
                  <span>🔗</span>
                  Connect With Me
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      name: 'LinkedIn',
                      icon: '💼',
                      link: SOCIAL_LINKS.linkedin,
                      label: 'Professional Network',
                    },
                    {
                      name: 'GitHub',
                      icon: '🐙',
                      link: SOCIAL_LINKS.github,
                      label: 'Code Repository',
                    },
                    {
                      name: 'Email',
                      icon: '📧',
                      link: SOCIAL_LINKS.email,
                      label: 'Direct Message',
                    },
                  ].map((social) => (
                    <a
                      key={social.name}
                      href={social.link}
                      target={social.link.startsWith('http') ? '_blank' : undefined}
                      rel={social.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="flex items-center gap-3 p-3 bg-primary rounded-lg border 
                               border-accent/20 hover:border-accent hover:bg-accent/10 
                               transition-all duration-300 transform hover:translate-x-2 group"
                    >
                      <span className="text-2xl">{social.icon}</span>
                      <div className="flex-1">
                        <div className="text-text-primary font-semibold group-hover:text-accent transition-colors">
                          {social.name}
                        </div>
                        <div className="text-xs text-text-secondary">{social.label}</div>
                      </div>
                      <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </Card>

            {/* Resume Download */}
            {/* <Card variant="glass">
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-text-primary mb-3">
                  📄 Download Resume
                </h3>
                <p className="text-sm text-text-secondary mb-4">
                  View my complete professional profile
                </p>
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  icon="⬇️"
                  iconPosition="right"
                  onClick={() => window.open(PERSONAL_INFO.resume, '_blank')}
                >
                  Download PDF
                </Button>
              </div>
            </Card> */}

            {/* Availability */}
            <Card variant="glass">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <h3 className="text-lg font-bold text-text-primary">
                    Available for Work
                  </h3>
                </div>
                <p className="text-sm text-text-secondary">
                  Currently open to full-time opportunities, freelance projects, and
                  collaborations.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom Social Links */}
        <div className="mt-16 text-center">
          <p className="text-text-secondary mb-6">Follow me on social media</p>
          <div className="flex justify-center gap-4">
            {[
              { icon: '💼', link: SOCIAL_LINKS.linkedin, label: 'LinkedIn' },
              { icon: '🐙', link: SOCIAL_LINKS.github, label: 'GitHub' },
              { icon: '📧', link: SOCIAL_LINKS.email, label: 'Email' },
              { icon: '📱', link: SOCIAL_LINKS.phone, label: 'Phone' },
            ].map((social) => (
              <a
                key={social.label}
                href={social.link}
                target={social.link.startsWith('http') ? '_blank' : undefined}
                rel={social.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="w-14 h-14 flex items-center justify-center bg-primary-light 
                         rounded-full border-2 border-accent/20 hover:border-accent 
                         hover:bg-accent/10 transition-all duration-300 transform 
                         hover:scale-110 hover:-translate-y-1"
                aria-label={social.label}
              >
                <span className="text-2xl">{social.icon}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Thank You Message */}
        <div className="mt-16 text-center">
          <p className="text-lg text-text-secondary italic">
            "Thank you for visiting my portfolio. Looking forward to connecting with you!"
          </p>
          <p className="text-accent font-semibold mt-2">- Lokesh Trivedi</p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
