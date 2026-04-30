import { useState, useEffect } from 'react';
import { Truck, Save, MapPin, Package, Info } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh',
];

export default function AdminShipping() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Simple state
  const [localState, setLocalState] = useState('Karnataka');
  const [localCharge, setLocalCharge] = useState(60);
  const [otherStatesCharge, setOtherStatesCharge] = useState(100);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/settings');
      if (data.success && data.data.settings.shippingConfig) {
        const config = data.data.settings.shippingConfig;
        setLocalState(config.localState || 'Karnataka');
        
        // Parse local charges
        if (config.localCharges && config.localCharges.length > 0) {
          setLocalCharge(config.localCharges[0].charge || 60);
        }
        
        // Parse other states charges
        if (config.otherStatesCharges && config.otherStatesCharges.length > 0) {
          setOtherStatesCharge(config.otherStatesCharges[0].charge || 100);
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load shipping configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!localState) {
      toast.error('Please select a local state');
      return;
    }

    if (localCharge < 0) {
      toast.error('Local delivery charge cannot be negative');
      return;
    }

    if (otherStatesCharge < 0) {
      toast.error('Other states delivery charge cannot be negative');
      return;
    }

    setSaving(true);
    try {
      // Convert to slab format (single slab with fixed charge)
      const localCharges = [
        { minOrder: 0, maxOrder: 999999, charge: localCharge },
      ];

      const otherStatesCharges = [
        { minOrder: 0, maxOrder: 999999, charge: otherStatesCharge },
      ];

      const { data } = await api.put('/admin/settings/shipping', {
        localState,
        localCharges,
        otherStatesCharges,
      });

      if (data.success) {
        toast.success('Shipping charges updated successfully! 🚚');
      }
    } catch (error) {
      console.error('Error saving shipping config:', error);
      toast.error(error.response?.data?.message || 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Truck className="w-7 h-7 text-gray-900" />
            Delivery Charges
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Set fixed delivery charges for all orders
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-semibold mb-1">Fixed Delivery Charges</p>
          <p>Set a fixed delivery charge for your local state and other states. This charge will be applied to all orders regardless of order value.</p>
        </div>
      </div>

      {/* Local State Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-gray-900" />
          <h2 className="text-lg font-semibold text-gray-900">Your Local State</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Select your primary business state
        </p>
        <select
          value={localState}
          onChange={(e) => setLocalState(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-base font-medium"
        >
          {INDIAN_STATES.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      {/* Delivery Charges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Local Delivery Charge */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Local Delivery
            </h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Delivery charge for {localState}
          </p>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Delivery Charge
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">₹</span>
              <input
                type="number"
                value={localCharge}
                onChange={(e) => setLocalCharge(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-2xl font-bold text-gray-900"
                min="0"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Fixed charge for all orders in {localState}
            </p>
          </div>

          {/* Preview */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm font-semibold text-green-900 mb-1">Example:</p>
            <p className="text-sm text-green-800">
              Order ₹450 → Delivery: <span className="font-bold">₹{localCharge}</span>
            </p>
            <p className="text-sm text-green-800">
              Order ₹1000 → Delivery: <span className="font-bold">₹{localCharge}</span>
            </p>
          </div>
        </div>

        {/* Other States Delivery Charge */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Other States
            </h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Delivery charge for all other states
          </p>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Delivery Charge
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">₹</span>
              <input
                type="number"
                value={otherStatesCharge}
                onChange={(e) => setOtherStatesCharge(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-2xl font-bold text-gray-900"
                min="0"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Fixed charge for all orders outside {localState}
            </p>
          </div>

          {/* Preview */}
          <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-sm font-semibold text-orange-900 mb-1">Example:</p>
            <p className="text-sm text-orange-800">
              Order ₹450 → Delivery: <span className="font-bold">₹{otherStatesCharge}</span>
            </p>
            <p className="text-sm text-orange-800">
              Order ₹1000 → Delivery: <span className="font-bold">₹{otherStatesCharge}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Truck className="w-5 h-5" />
          Current Delivery Charges
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Local Summary */}
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-green-400" />
              <h4 className="font-semibold text-green-400">{localState} (Local)</h4>
            </div>
            <div className="text-3xl font-bold">₹{localCharge}</div>
            <p className="text-sm text-gray-300 mt-1">per order</p>
          </div>

          {/* Other States Summary */}
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-orange-400" />
              <h4 className="font-semibold text-orange-400">Other States</h4>
            </div>
            <div className="text-3xl font-bold">₹{otherStatesCharge}</div>
            <p className="text-sm text-gray-300 mt-1">per order</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-sm text-gray-300">
            💡 These charges will be applied to all orders regardless of order value
          </p>
        </div>
      </div>

      {/* Save Button (Bottom) */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 font-semibold"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving Changes...' : 'Save Delivery Charges'}
        </button>
      </div>
    </div>
  );
}
