'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { getProfile } from '@/lib/supabase/queries';
import { Save, Plus, X, ArrowLeft, Trash2, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

type TourImage = {
  id?: string;
  image_url: string;
  caption: string;
  display_order: number;
};

export default function ManageGalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: tourId } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tourName, setTourName] = useState('');
  const [images, setImages] = useState<TourImage[]>([]);

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

      // Fetch images
      const { data: imagesData } = await supabase
        .from('tour_images')
        .select('*')
        .eq('tour_id', tourId)
        .order('display_order', { ascending: true });

      if (imagesData && imagesData.length > 0) {
        setImages(imagesData);
      }

      setLoading(false);
    }
    init();
  }, [tourId, router]);

  const addImage = () => {
    const newImage: TourImage = {
      image_url: '',
      caption: '',
      display_order: images.length + 1,
    };
    setImages([...images, newImage]);
  };

  const removeImage = async (index: number) => {
    const image = images[index];
    if (image.id) {
      // Delete from database
      const supabase = createSupabaseBrowser();
      await supabase.from('tour_images').delete().eq('id', image.id);
    }
    setImages(images.filter((_, i) => i !== index));
  };

  const updateImage = (index: number, field: keyof TourImage, value: any) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], [field]: value };
    setImages(newImages);
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === images.length - 1) return;

    const newImages = [...images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    
    // Update display order
    newImages.forEach((img, i) => {
      img.display_order = i + 1;
    });

    setImages(newImages);
  };

  const handleSave = async () => {
    setSaving(true);
    const supabase = createSupabaseBrowser();

    // Delete all existing images for this tour
    await supabase.from('tour_images').delete().eq('tour_id', tourId);

    // Insert new images
    const imagesToSave = images
      .filter(img => img.image_url.trim())
      .map((img, index) => ({
        tour_id: tourId,
        image_url: img.image_url,
        caption: img.caption || null,
        display_order: index + 1,
      }));

    const { error } = await supabase.from('tour_images').insert(imagesToSave);

    setSaving(false);

    if (error) {
      toast.error('Failed to save gallery: ' + error.message);
    } else {
      toast.success('Gallery saved successfully!');
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
            <h1 className="text-4xl font-bold mb-2">Manage Gallery: {tourName}</h1>
            <p className="text-gray-600">Add images to showcase the tour</p>
          </div>
          <Link
            href={`/admin/tours/edit/${tourId}`}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>
        </div>

        {/* Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {images.map((image, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Image {index + 1}</h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => moveImage(index, 'up')}
                    disabled={index === 0}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      index === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(index, 'down')}
                    disabled={index === images.length - 1}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      index === images.length - 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL *</label>
                  <input
                    type="url"
                    value={image.image_url}
                    onChange={(e) => updateImage(index, 'image_url', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
                  <input
                    type="text"
                    value={image.caption}
                    onChange={(e) => updateImage(index, 'caption', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="e.g., The Great Wall of China"
                  />
                </div>

                {/* Preview */}
                {image.image_url && (
                  <div className="relative h-48 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={image.image_url}
                      alt={image.caption || 'Tour image'}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Image Button */}
        <button
          type="button"
          onClick={addImage}
          className="w-full px-6 py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-pink-500 hover:text-pink-600 transition-colors flex items-center justify-center gap-2 mb-8"
        >
          <Plus className="w-5 h-5" />
          Add Image
        </button>

        {/* Save Button */}
        <div className="flex gap-4">
          <Link
            href={`/admin/tours/edit/${tourId}`}
            className="px-8 py-4 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex-1 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2 ${
              saving ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Gallery'}
          </button>
        </div>
      </div>
    </main>
  );
}

