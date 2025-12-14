import { useState, FormEvent } from 'react';
import { NotificationPayload, NotificationType } from '../types/notification';
import { createNotification } from '../api/notifications';

interface NotificationFormProps {
  onSuccess: () => void;
}

export default function NotificationForm({ onSuccess }: NotificationFormProps): JSX.Element {
  const [type, setType] = useState<NotificationType>('email');
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const payload: NotificationPayload = { type, recipient, message };
    if (type === 'email' && subject) {
      payload.subject = subject;
    }

    try {
      const result = await createNotification(payload);
      setSuccess(`Job created: ${result.jobId}`);
      setRecipient('');
      setSubject('');
      setMessage('');
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="form-group">
        <label htmlFor="type">Notification Type</label>
        <select id="type" value={type} onChange={(e) => setType(e.target.value as NotificationType)}>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="push">Push Notification</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="recipient">
          {type === 'email' ? 'Email Address' : type === 'sms' ? 'Phone Number' : 'Device Token'}
        </label>
        <input
          id="recipient"
          type={type === 'email' ? 'email' : 'text'}
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder={type === 'email' ? 'user@example.com' : type === 'sms' ? '+1234567890' : 'device-token'}
          required
        />
      </div>

      {type === 'email' && (
        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Notification subject"
          />
        </div>
      )}

      <div className="form-group">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your notification message..."
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send Notification'}
      </button>
    </form>
  );
}
