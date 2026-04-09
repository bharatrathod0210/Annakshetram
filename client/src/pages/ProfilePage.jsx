import { useState } from 'react';
import { User, Phone, Mail, Lock, ShieldCheck, LogOut, Save, Eye, EyeOff, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';
import api from '../lib/api';

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh',
];

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuthStore();
  const navigate = useNavigate();

  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [addrForm, setAddrForm] = useState({
    fullName: user?.address?.fullName || '',
    phone: user?.address?.phone || '',
    line1: user?.address?.line1 || '',
    line2: user?.address?.line2 || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
  });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const [profileLoading, setProfileLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [addrLoading, setAddrLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) return toast.error('Name is required');
    setProfileLoading(true);
    try {
      const res = await api.put('/auth/profile', profileForm);
      updateUser(res.data.data.user);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleAddressSave = async (e) => {
    e.preventDefault();
    const { fullName, phone, line1, city, state, pincode } = addrForm;
    if (!fullName || !phone || !line1 || !city || !state || !pincode)
      return toast.error('Please fill all required fields');
    setAddrLoading(true);
    try {
      const res = await api.put('/auth/address', addrForm);
      updateUser(res.data.data.user);
      toast.success('Address saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save address');
    } finally {
      setAddrLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) return toast.error('Passwords do not match');
    if (pwForm.newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    setPwLoading(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      toast.success('Password changed successfully');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPwLoading(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'address', label: 'Address', icon: MapPin },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-cream/30 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header Card */}
        <div className="bg-primary rounded-2xl p-6 mb-6 flex items-center gap-5">
          <div className="w-16 h-16 bg-accent/30 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-cream font-bold text-2xl">{user?.name?.[0]?.toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-cream font-heading font-bold text-xl truncate">{user?.name}</h1>
            <p className="text-cream/60 text-sm truncate">{user?.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-accent/20 text-accent text-xs rounded-full capitalize">
              {user?.role}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-cream/60 hover:text-red-300 text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === id
                  ? 'bg-primary text-cream shadow-md'
                  : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-gray-800 font-semibold text-base mb-5 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> Personal Information
            </h2>
            <form onSubmit={handleProfileSave} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              {/* Email (readonly) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={user?.email || ''}
                    readOnly
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>

              {/* Account Info */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Member Since</p>
                  <p className="text-sm font-medium text-gray-700">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Account ID</p>
                  <p className="text-sm font-medium text-gray-700 truncate">{user?.userId || '—'}</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                className="flex items-center gap-2 bg-primary text-cream px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                {profileLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {/* Address Tab */}
        {activeTab === 'address' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-gray-800 font-semibold text-base mb-5 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> Delivery Address
            </h2>
            <form onSubmit={handleAddressSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input value={addrForm.fullName} onChange={e => setAddrForm({ ...addrForm, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="Recipient name" required />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input value={addrForm.phone} onChange={e => setAddrForm({ ...addrForm, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="+91 XXXXX XXXXX" required />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                  <input value={addrForm.line1} onChange={e => setAddrForm({ ...addrForm, line1: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="House no, Street, Area" required />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                  <input value={addrForm.line2} onChange={e => setAddrForm({ ...addrForm, line2: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="Landmark (optional)" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input value={addrForm.city} onChange={e => setAddrForm({ ...addrForm, city: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="City" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                  <input value={addrForm.pincode} onChange={e => setAddrForm({ ...addrForm, pincode: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="560001" required />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <select value={addrForm.state} onChange={e => setAddrForm({ ...addrForm, state: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white" required>
                    <option value="">Select state</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" disabled={addrLoading}
                className="flex items-center gap-2 bg-primary text-cream px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60">
                <Save className="w-4 h-4" />
                {addrLoading ? 'Saving...' : 'Save Address'}
              </button>
            </form>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-gray-800 font-semibold text-base mb-5 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" /> Change Password
            </h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {[
                { key: 'currentPassword', label: 'Current Password', placeholder: 'Enter current password' },
                { key: 'newPassword', label: 'New Password', placeholder: 'Min. 6 characters' },
                { key: 'confirmPassword', label: 'Confirm New Password', placeholder: 'Repeat new password' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPw[key.replace('Password', '').replace('confirm', 'confirm').replace('current', 'current').replace('new', 'new')] ? 'text' : 'password'}
                      value={pwForm[key]}
                      onChange={(e) => setPwForm({ ...pwForm, [key]: e.target.value })}
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      placeholder={placeholder}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const k = key === 'currentPassword' ? 'current' : key === 'newPassword' ? 'new' : 'confirm';
                        setShowPw(p => ({ ...p, [k]: !p[k] }));
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPw[key === 'currentPassword' ? 'current' : key === 'newPassword' ? 'new' : 'confirm']
                        ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="submit"
                disabled={pwLoading}
                className="flex items-center gap-2 bg-primary text-cream px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                <Lock className="w-4 h-4" />
                {pwLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
