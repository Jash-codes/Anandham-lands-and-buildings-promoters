import { useState, useEffect } from 'react';
import { X, CheckCircle2, Calendar, User, Phone, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { whatsappLink, BUSINESS } from '@/lib/constants';
import type { Project } from '@/lib/types';

interface InquiryModalProps {
  open: boolean;
  onClose: () => void;
  project?: Project | null;
}

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '02:00 PM', '03:00 PM',
  '04:00 PM', '05:00 PM', '06:00 PM',
];

function getNextTwoWeeks(): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() !== 0) { // Skip Sundays
      dates.push(d.toISOString().split('T')[0]);
    }
  }
  return dates;
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

export default function InquiryModal({ open, onClose, project }: InquiryModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const dates = getNextTwoWeeks();

  useEffect(() => {
    if (open) {
      setSuccess(false);
      setError('');
    }
  }, [open]);

  if (!open) return null;

  const projectName = project?.name || 'General Inquiry';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    if (!name.trim() || !phone.trim()) {
      setError('Please fill in your name and phone number.');
      setSubmitting(false);
      return;
    }

    if (!/^\+?[0-9]{10,13}$/.test(phone.replace(/[\s-]/g, ''))) {
      setError('Please enter a valid phone number.');
      setSubmitting(false);
      return;
    }

    const preferredDate = selectedDate && selectedSlot
      ? `${formatDateLabel(selectedDate)} at ${selectedSlot}`
      : selectedDate
        ? formatDateLabel(selectedDate)
        : null;

    try {
      const { error: insertError } = await supabase.from('inquiries').insert({
        name: name.trim(),
        phone: phone.trim(),
        preferred_date: selectedDate || null,
        project_id: project?.id || null,
        message: preferredDate ? `Preferred visit: ${preferredDate}` : null,
      });

      if (insertError) throw insertError;
      setSuccess(true);
    } catch {
      setError('Something went wrong. Please try calling or WhatsApp instead.');
    } finally {
      setSubmitting(false);
    }
  };

  const waMessage = success
    ? `Hi, I just booked a site visit${project ? ` for ${project.name}` : ''}. My name is ${name}. Preferred: ${selectedDate ? formatDateLabel(selectedDate) : 'Anytime'} ${selectedSlot || ''}`.trim()
    : `Hi, I'm interested in ${projectName}. My name is ${name || '...'}. Please share details.`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-stone-800 mb-2">Inquiry Received!</h3>
            <p className="text-sm text-stone-600 mb-1">
              Thank you, {name}! Your site visit request for
            </p>
            <p className="text-sm font-semibold text-stone-800 mb-4">{projectName}</p>
            {selectedDate && (
              <p className="text-sm text-stone-600 mb-4">
                We've noted your preferred time: <span className="font-medium">{formatDateLabel(selectedDate)}{selectedSlot ? ` at ${selectedSlot}` : ''}</span>
              </p>
            )}
            <p className="text-sm text-stone-600 mb-6">
              Our team will call you shortly to confirm. For instant response, message us on WhatsApp.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href={whatsappLink(waMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-5 py-3 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Send WhatsApp Confirmation
              </a>
              <button
                onClick={onClose}
                className="w-full px-5 py-3 text-stone-600 text-sm font-medium hover:bg-stone-100 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-bold text-stone-800">Book a Site Visit</h3>
                <p className="text-xs text-stone-500 mt-0.5">{projectName}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-stone-400 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                  <User className="w-3.5 h-3.5 inline mr-1" />
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                  <Phone className="w-3.5 h-3.5 inline mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-4 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* Date picker */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                  <Calendar className="w-3.5 h-3.5 inline mr-1" />
                  Preferred Visit Date
                </label>
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                  {dates.slice(0, 10).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDate(d)}
                      className={`shrink-0 px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                        selectedDate === d
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-white text-stone-600 border-stone-200 hover:border-emerald-400'
                      }`}
                    >
                      {formatDateLabel(d)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time slot picker */}
              {selectedDate && (
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                    <Clock className="w-3.5 h-3.5 inline mr-1" />
                    Preferred Time Slot
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`px-2 py-2 text-xs font-medium rounded-lg border transition-colors ${
                          selectedSlot === slot
                            ? 'bg-emerald-700 text-white border-emerald-700'
                            : 'bg-white text-stone-600 border-stone-200 hover:border-emerald-400'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full px-5 py-3 bg-emerald-700 text-white text-sm font-semibold rounded-lg hover:bg-emerald-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Confirm Site Visit'}
              </button>

              <div className="flex items-center gap-2 text-xs text-stone-400">
                <div className="flex-1 h-px bg-stone-100" />
                OR
                <div className="flex-1 h-px bg-stone-100" />
              </div>

              <a
                href={whatsappLink(`Hi, I'm interested in ${projectName}. My name is ${name || '...'}. Please share details.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-5 py-3 bg-green-50 text-green-700 text-sm font-semibold rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-2 border border-green-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Chat on WhatsApp
              </a>

              <p className="text-center text-xs text-stone-400">
                No login required. We'll call you to confirm.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
