import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [form, setForm] = useState({
    storeName: '', tagline: '', whatsappNumber: '', contactEmail: '', contactPhone: '', address: '', facebookUrl: '', instagramUrl: '', aboutText: '',
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/settings').then(res => {
      const s = res.data.data.settings;
      setForm({ storeName: s.storeName || '', tagline: s.tagline || '', whatsappNumber: s.whatsappNumber || '', contactEmail: s.contactEmail || '', contactPhone: s.contactPhone || '', address: s.address || '', facebookUrl: s.facebookUrl || '', instagramUrl: s.instagramUrl || '', aboutText: s.aboutText || '' });
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/admin/settings', form);
      toast.success('Settings saved!');
    } catch { toast.error('Error saving settings'); }
    setSaving(false);
  };

  const Field = ({ label, name, type = 'text', placeholder = '' }) => (
    <div>
      <label className="text-sm font-medium text-gray-700 block mb-1">{label}</label>
      <input
        type={type}
        className="input-field"
        value={form[name]}
        onChange={e => setForm({ ...form, [name]: e.target.value })}
        placeholder={placeholder}
      />
    </div>
  );

  if (loading) return <div className="animate-pulse h-96 bg-white rounded-lg" />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-heading">Site Settings</h1>
        <p className="text-gray-500 text-sm">Configure your store settings</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 text-base font-heading">Store Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Store Name" name="storeName" placeholder="Annakshetram" />
            <Field label="Tagline" name="tagline" placeholder="Satvikam Jeevanam..." />
          </div>
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700 block mb-1">About Text</label>
            <textarea
              className="input-field resize-none h-28"
              value={form.aboutText}
              onChange={e => setForm({ ...form, aboutText: e.target.value })}
              placeholder="Brief description of your store..."
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 text-base font-heading">Contact Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="WhatsApp Number (with country code)" name="whatsappNumber" placeholder="919035735818" />
            <Field label="Contact Email" name="contactEmail" type="email" placeholder="contact@annakshetram.com" />
            <Field label="Phone" name="contactPhone" placeholder="+91 9035735818" />
            <Field label="Location/Address" name="address" placeholder="Karnataka, India" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 text-base font-heading">Social Media</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Facebook URL" name="facebookUrl" placeholder="https://facebook.com/..." />
            <Field label="Instagram URL" name="instagramUrl" placeholder="https://instagram.com/..." />
          </div>
        </div>

        <button type="submit" disabled={saving} className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-light transition-colors shadow-warm disabled:opacity-60">
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
