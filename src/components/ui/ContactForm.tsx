import { useState, FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './Button';
import { Card } from './Card';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface ContactFormProps {
  onSubmit?: (data: FormData) => Promise<void>;
  className?: string;
}

export const ContactForm = ({ onSubmit, className = '' }: ContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmitForm = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        // Default: Send to backend API
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
      }

      setSubmitStatus('success');
      reset();

      // Clear success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');

      // Clear error message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card variant="elevated" className={className}>
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-text-primary font-semibold mb-2"
          >
            Name <span className="text-accent">*</span>
          </label>
          <input
            {...register('name', {
              required: 'Name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
              },
              maxLength: {
                value: 100,
                message: 'Name must be less than 100 characters',
              },
            })}
            type="text"
            id="name"
            placeholder="Your name"
            className={`w-full px-4 py-3 bg-primary-dark border-2 rounded-lg 
                     text-text-primary placeholder-text-secondary/50
                     focus:outline-none focus:border-accent transition-colors
                     ${errors.name ? 'border-red-500' : 'border-accent/20'}`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-text-primary font-semibold mb-2"
          >
            Email <span className="text-accent">*</span>
          </label>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            type="email"
            id="email"
            placeholder="your.email@example.com"
            className={`w-full px-4 py-3 bg-primary-dark border-2 rounded-lg 
                     text-text-primary placeholder-text-secondary/50
                     focus:outline-none focus:border-accent transition-colors
                     ${errors.email ? 'border-red-500' : 'border-accent/20'}`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <label
            htmlFor="message"
            className="block text-text-primary font-semibold mb-2"
          >
            Message <span className="text-accent">*</span>
          </label>
          <textarea
            {...register('message', {
              required: 'Message is required',
              minLength: {
                value: 10,
                message: 'Message must be at least 10 characters',
              },
              maxLength: {
                value: 5000,
                message: 'Message must be less than 5000 characters',
              },
            })}
            id="message"
            rows={6}
            placeholder="Your message..."
            className={`w-full px-4 py-3 bg-primary-dark border-2 rounded-lg 
                     text-text-primary placeholder-text-secondary/50
                     focus:outline-none focus:border-accent transition-colors
                     resize-none
                     ${errors.message ? 'border-red-500' : 'border-accent/20'}`}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-400">{errors.message.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isSubmitting}
          icon={isSubmitting ? undefined : '📧'}
          iconPosition="right"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-green-400 text-center font-semibold">
              ✓ Message sent successfully! I'll get back to you soon.
            </p>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-center font-semibold">
              ✗ Failed to send message. Please try again or contact me directly.
            </p>
          </div>
        )}
      </form>
    </Card>
  );
};

export default ContactForm;
