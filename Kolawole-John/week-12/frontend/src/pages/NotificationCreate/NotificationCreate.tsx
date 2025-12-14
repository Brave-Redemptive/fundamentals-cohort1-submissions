import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { notificationService } from '../../services/api';
import { NotificationType, Priority } from '../../types/notification';
import { Send, AlertCircle, CheckCircle } from 'lucide-react';

const NotificationCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: NotificationType.EMAIL,
    recipient: '',
    subject: '',
    message: '',
    priority: Priority.MEDIUM,
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: notificationService.create,
    onSuccess: (response) => {
      // Navigate to the notification detail page
      navigate(`/notifications/${response.data.id}`);
    },
  });

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.recipient.trim()) {
      errors.recipient = 'Recipient is required';
    } else if (formData.type === NotificationType.EMAIL) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.recipient)) {
        errors.recipient = 'Invalid email address';
      }
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.length > 5000) {
      errors.message = 'Message must not exceed 5000 characters';
    }

    if (formData.type === NotificationType.EMAIL && !formData.subject?.trim()) {
      errors.subject = 'Subject is required for email notifications';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    mutation.mutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Notification</h1>
        <p className="text-gray-600 mt-2">Send a new notification to your users</p>
      </div>

      <div className="card">
        {mutation.isSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-green-800 font-medium">Notification created successfully!</p>
              <p className="text-green-700 text-sm mt-1">Redirecting to details page...</p>
            </div>
          </div>
        )}

        {mutation.isError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-red-800 font-medium">Failed to create notification</p>
              <p className="text-red-700 text-sm mt-1">
                {(mutation.error as any)?.response?.data?.error?.message || 'Please try again'}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Notification Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Notification Type *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={mutation.isPending}
            >
              <option value={NotificationType.EMAIL}>Email</option>
              <option value={NotificationType.SMS}>SMS</option>
              <option value={NotificationType.PUSH}>Push Notification</option>
            </select>
          </div>

          {/* Recipient */}
          <div>
            <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-2">
              Recipient *
            </label>
            <input
              type="text"
              id="recipient"
              name="recipient"
              value={formData.recipient}
              onChange={handleChange}
              placeholder={
                formData.type === NotificationType.EMAIL
                  ? 'user@example.com'
                  : formData.type === NotificationType.SMS
                  ? '+1234567890'
                  : 'device_token_here'
              }
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                validationErrors.recipient ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={mutation.isPending}
            />
            {validationErrors.recipient && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.recipient}</p>
            )}
          </div>

          {/* Subject (Email only) */}
          {formData.type === NotificationType.EMAIL && (
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Enter email subject"
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  validationErrors.subject ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={mutation.isPending}
              />
              {validationErrors.subject && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.subject}</p>
              )}
            </div>
          )}

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              placeholder="Enter your message here..."
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                validationErrors.message ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={mutation.isPending}
            />
            <div className="flex justify-between items-center mt-1">
              {validationErrors.message && (
                <p className="text-sm text-red-600">{validationErrors.message}</p>
              )}
              <p className="text-sm text-gray-500 ml-auto">
                {formData.message.length} / 5000 characters
              </p>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={mutation.isPending}
            >
              <option value={Priority.LOW}>Low</option>
              <option value={Priority.MEDIUM}>Medium</option>
              <option value={Priority.HIGH}>High</option>
              <option value={Priority.CRITICAL}>Critical</option>
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Higher priority notifications are processed first
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Notification
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              disabled={mutation.isPending}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationCreate;