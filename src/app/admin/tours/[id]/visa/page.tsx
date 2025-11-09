'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { getProfile } from '@/lib/supabase/queries';
import { Save, Plus, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

type VisaForm = {
  id?: string;
  visa_type: string;
  processing_days: number;
  validity_days: number;
  visa_fee_inr: number;
  service_fee_inr: number;
  total_fee_inr: number;
  requirements: string[];
  inclusions: string[];
  exclusions: string[];
  notes: string;
  apply_before_days: number;
};

const initialForm: VisaForm = {
  visa_type: '',
  processing_days: 7,
  validity_days: 90,
  visa_fee_inr: 0,
  service_fee_inr: 0,
  total_fee_inr: 0,
  requirements: [''],
  inclusions: [''],
  exclusions: [''],
  notes: '',
  apply_before_days: 30,
};

export default function ManageVisaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: tourId } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tourName, setTourName] = useState('');
  const [form, setForm] = useState<VisaForm>(initialForm);

  useEffect(() => {
    async function init() {
      const supabase = createSupabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error('Please sign in');
        router.push('/');
        return;
      }

      const profile = await getProfile(user.id);
      if (profile?.role !== 'admin') {
        toast.error('Access denied. Admin only.');
        router.push('/');
        return;
      }

      setIsAdmin(true);

      // Fetch tour
      const { data: tour } = await supabase.from('tours').select('destination').eq('id', tourId).single();
      if (tour) setTourName(tour.destination);

      // Fetch visa requirements
      const { data: visaData } = await supabase
        .from('visa_requirements')
        .select('*')
        .eq('tour_id', tourId)
        .maybeSingle();

      if (visaData) {
        setForm(visaData);
      }

      setLoading(false);
    }
    init();
  }, [tourId, router]);

  const handleArrayAdd = (field: 'requirements' | 'inclusions' | 'exclusions') => {
    setForm({ ...form, [field]: [...form[field], ''] });
  };

  const handleArrayRemove = (field: 'requirements' | 'inclusions' | 'exclusions', index: number) => {
    const newArray = form[field].filter((_, i) => i !== index);
    setForm({ ...form, [field]: newArray });
  };

  const handleArrayChange = (field: 'requirements' | 'inclusions' | 'exclusions', index: number, value: string) => {
    const newArray = [...form[field]];
    newArray[index] = value;
    setForm({ ...form, [field]: newArray });
  };

  const calculateTotal = () => {
    const total = form.visa_fee_inr + form.service_fee_inr;
    setForm({ ...form, total_fee_inr: total });
  };

  useEffect(() => {
    calculateTotal();
  }, [form.visa_fee_inr, form.service_fee_inr]);

  const handleSave = async () => {
    setSaving(true);
    const supabase = createSupabaseBrowser();

    const visaData = {
      tour_id: tourId,
      visa_type: form.visa_type,
      processing_days: form.processing_days,
      validity_days: form.validity_days,
      visa_fee_inr: form.visa_fee_inr,
      service_fee_inr: form.service_fee_inr,
      total_fee_inr: form.total_fee_inr,
      requirements: form.requirements.filter(r => r.trim()),
      inclusions: form.inclusions.filter(i => i.trim()),
      exclusions: form.exclusions.filter(e => e.trim()),
      notes: form.notes,
      apply_before_days: form.apply_before_days,
    };

    let error;
    if (form.id) {
      // Update existing
      ({ error } = await supabase.from('visa_requirements').update(visaData).eq('id', form.id));
    } else {
      // Insert new
      ({ error } = await supabase.from('visa_requirements').insert([visaData]));
    }

    setSaving(false);

    if (error) {
      toast.error('Failed to save visa requirements: ' + error.message);
    } else {
      toast.success('Visa requirements saved successfully!');
      router.push(`/admin/tours/edit/${tourId}`);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen pt-24 px-6 lg:px-16 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </main>
    );
  }

  if (!isAdmin) return null;

  return (
    <main className="min-h-screen pt-24 px-6 lg:px-16 pb-20 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Manage Visa: {tourName}</h1>
            <p className="text-gray-600">Set visa requirements and fees</p>
          </div>
          <Link
            href={`/admin/tours/edit/${tourId}`}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold mb-6">Visa Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Visa Type *</label>
                <input
                  type="text"
                  value={form.visa_type}
                  onChange={(e) => setForm({ ...form, visa_type: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="e.g., Tourist Visa (L), E-Visa, Visa on Arrival"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Processing Days</label>
                <input
                  type="number"
                  value={form.processing_days}
                  onChange={(e) => setForm({ ...form, processing_days: parseInt(e.target.value) })}
                  min="0"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Validity (Days)</label>
                <input
                  type="number"
                  value={form.validity_days}
                  onChange={(e) => setForm({ ...form, validity_days: parseInt(e.target.value) })}
                  min="0"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Visa Fee (INR)</label>
                <input
                  type="number"
                  value={form.visa_fee_inr}
                  onChange={(e) => setForm({ ...form, visa_fee_inr: parseInt(e.target.value) })}
                  min="0"
                  step="100"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Fee (INR)</label>
                <input
                  type="number"
                  value={form.service_fee_inr}
                  onChange={(e) => setForm({ ...form, service_fee_inr: parseInt(e.target.value) })}
                  min="0"
                  step="100"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Fee (INR)</label>
                <input
                  type="number"
                  value={form.total_fee_inr}
                  readOnly
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 font-bold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Apply Before (Days)</label>
                <input
                  type="number"
                  value={form.apply_before_days}
                  onChange={(e) => setForm({ ...form, apply_before_days: parseInt(e.target.value) })}
                  min="0"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Additional information about the visa process..."
                />
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Requirements</h2>
              <button
                type="button"
                onClick={() => handleArrayAdd('requirements')}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <div className="space-y-3">
              {form.requirements.map((req, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="e.g., Valid passport (min 6 months)"
                  />
                  <button
                    type="button"
                    onClick={() => handleArrayRemove('requirements', index)}
                    className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Inclusions</h2>
              <button
                type="button"
                onClick={() => handleArrayAdd('inclusions')}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <div className="space-y-3">
              {form.inclusions.map((inc, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={inc}
                    onChange={(e) => handleArrayChange('inclusions', index, e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="e.g., Actual visa fees"
                  />
                  <button
                    type="button"
                    onClick={() => handleArrayRemove('inclusions', index)}
                    className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Exclusions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Exclusions</h2>
              <button
                type="button"
                onClick={() => handleArrayAdd('exclusions')}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <div className="space-y-3">
              {form.exclusions.map((exc, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={exc}
                    onChange={(e) => handleArrayChange('exclusions', index, e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="e.g., Urgent processing charges"
                  />
                  <button
                    type="button"
                    onClick={() => handleArrayRemove('exclusions', index)}
                    className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex gap-4">
          <Link
            href={`/admin/tours/edit/${tourId}`}
            className="px-8 py-4 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleSave}
            disabled={saving || !form.visa_type}
            className={`flex-1 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2 ${
              saving || !form.visa_type ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Visa Requirements'}
          </button>
        </div>
      </div>
    </main>
  );
}

