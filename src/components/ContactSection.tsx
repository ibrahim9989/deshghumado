'use client';

import { useState, useEffect } from 'react';
import { createEnquiry, getAllTours, Tour } from '@/lib/supabase/queries';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', tour: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loadingTours, setLoadingTours] = useState(true);

  // Fetch tours for dropdown
  useEffect(() => {
    async function fetchTours() {
      try {
        const data = await getAllTours();
        setTours(data);
      } catch (error) {
        console.error('Error fetching tours:', error);
      } finally {
        setLoadingTours(false);
      }
    }
    fetchTours();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      return toast.error('Please fill name, email, and message');
    }

    setSubmitting(true);

    // Get user ID if logged in
    const supabase = createSupabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();

    // Find tour ID if a tour was selected
    const selectedTour = tours.find(t => t.id === form.tour);
    const tourId = selectedTour ? selectedTour.id : null;

    const success = await createEnquiry({
      user_id: user?.id || null,
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      tour_id: tourId,
      subject: selectedTour ? `Tour Inquiry: ${selectedTour.destination}` : 'General Inquiry',
      message: form.message,
      status: 'new',
    });

    setSubmitting(false);

    if (success) {
      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', tour: '', message: '' });
      toast.success('Inquiry sent successfully! We\'ll get back to you soon.');
    } else {
      toast.error('Failed to send inquiry. Please try again or contact us directly.');
    }
  };

  return (
    <section id="contact" className="py-20 px-6 lg:px-16 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold">Get in Touch</h2>
          <p className="text-gray-600 mt-3">Questions about a tour or want to plan something custom with Vishnu?</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          {submitted ? (
            <div className="text-center py-12">
              <p className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Thanks! We'll get back to you soon.</p>
              <p className="text-gray-600 mt-2">We have received your inquiry.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} placeholder="Full Name" className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500" />
              <input type="email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} placeholder="Email" className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500" />
              <input value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} placeholder="Phone (optional)" className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500" />
              <select 
                value={form.tour} 
                onChange={(e)=>setForm({...form, tour:e.target.value})} 
                disabled={loadingTours}
                className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">{loadingTours ? 'Loading tours...' : 'Select Tour (Optional)'}</option>
                {tours.map((tour) => {
                  const startDate = new Date(tour.start_date);
                  const dateStr = startDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                  return (
                    <option key={tour.id} value={tour.id}>
                      {tour.destination}, {tour.country} — {dateStr}
                    </option>
                  );
                })}
              </select>
              <textarea value={form.message} onChange={(e)=>setForm({...form, message:e.target.value})} placeholder="Your message" className="md:col-span-2 min-h-[140px] px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500" />
              <div className="md:col-span-2 flex justify-end">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className={`px-8 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-lg ${submitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {submitting ? 'Sending...' : 'Send Inquiry'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
