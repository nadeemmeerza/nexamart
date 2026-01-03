'use client'

import { useEffect, useState } from "react";
import { Address, CreateAddressInput } from "../types/address.types";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: string;
  status: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  preferences?: any;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export default function ProfileContent() {
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchAddresses();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile');
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchAddresses = async () => {
    try {
    const response = await fetch('/api/user/addresses');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch addresses: ${response.status}`);
    }
    
    const text = await response.text();
    if (!text) {
      console.warn('Empty response from addresses API');
      setAddresses([]); // Set empty array instead of undefined
      return;
    }
    
    const data = JSON.parse(text);
    
    // Your API returns the addresses array directly, not wrapped in { addresses }
    // So use the data directly as the addresses array
    setAddresses(data || []); // Handle case where data might be null/undefined
  } catch (error) {
    console.error('Error fetching addresses:', error);
    setAddresses([]); // Set empty array on error
  }
  };

  const handleSaveProfile = async (formData: Partial<User>) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setUser({ ...user!, ...formData });
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      <div className="bg-white rounded-lg shadow-md">
        {/* Tabs */}
        <div className="border-b">
          <nav className="flex -mb-px">
            {['personal', 'addresses', 'preferences', 'security'].map((tab) => (
              <button
                key={tab}
                className={`py-4 px-6 font-medium ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'personal' && (
            <PersonalInfoTab 
              user={user} 
              isEditing={isEditing}
              onEdit={() => setIsEditing(true)}
              onSave={handleSaveProfile}
              onCancel={() => setIsEditing(false)}
            />
          )}
          
          {activeTab === 'addresses' && (
            <AddressesTab 
              addresses={addresses}
              onAddressUpdate={fetchAddresses}
            />
          )}
          
          {activeTab === 'preferences' && (
            <PreferencesTab user={user} />
          )}
          
          {activeTab === 'security' && (
            <SecurityTab user={user} />
          )}
        </div>
      </div>
    </div>
  );
}

// Personal Information Component
function PersonalInfoTab({ user, isEditing, onEdit, onSave, onCancel }: {
  user: User;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: Partial<User>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone || '',
    avatar: user.avatar || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Personal Information</h2>
        {!isEditing && (
          <button
            onClick={onEdit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={!isEditing}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
          />
          {user.emailVerified ? (
            <span className="text-green-600 text-sm">✓ Email verified</span>
          ) : (
            <span className="text-yellow-600 text-sm">⚠ Email not verified</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            disabled={!isEditing}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
          />
          {user.phoneVerified ? (
            <span className="text-green-600 text-sm">✓ Phone verified</span>
          ) : (
            <span className="text-yellow-600 text-sm">⚠ Phone not verified</span>
          )}
        </div>

        {isEditing && (
          <div className="flex space-x-3">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

// Addresses Component
// In your ProfileContent.tsx - Update the AddressesTab component
function AddressesTab({ addresses, onAddressUpdate }: {
  addresses: Address[];
  onAddressUpdate: () => void;
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteAddress = async (addressId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user/addresses/${addressId}`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete address');
      }
      
      onAddressUpdate();
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Failed to delete address');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (addressId: string, type: 'shipping' | 'billing') => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user/addresses/${addressId}/default`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to set default address');
      }
      
      onAddressUpdate();
    } catch (error) {
      console.error('Error setting default address:', error);
      alert('Failed to set default address');
    } finally {
      setLoading(false);
    }
  };

  // Safe rendering - handle undefined or null addresses
  const safeAddresses = Array.isArray(addresses) ? addresses : [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">My Addresses</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Add New Address'}
        </button>
      </div>

      {showAddForm && (
        <AddressForm 
          onSave={() => {
            setShowAddForm(false);
            onAddressUpdate();
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {safeAddresses.map((address) => (
          <div key={address.id} className="border rounded-lg p-4 relative">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold capitalize">{address.type}</h3>
              <button
                onClick={() => handleDeleteAddress(address.id!)}
                className="text-red-500 hover:text-red-700 text-sm"
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
            
            <p className="text-gray-600 text-sm mb-3">
              {address.street}, {address.apartment && `${address.apartment}, `}
              {address.city}, {address.state} {address.postalCode}
            </p>
            <p className="text-gray-600 text-sm mb-3">{address.country}</p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {address.isDefault && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Default</span>
              )}
              {address.isShipping && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Shipping</span>
              )}
              {address.isBilling && (
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Billing</span>
              )}
            </div>

            <div className="flex space-x-2 text-sm">
              {!address.isShipping && (
                <button
                  onClick={() => handleSetDefault(address.id!, 'shipping')}
                  className="text-blue-600 hover:text-blue-800"
                  disabled={loading}
                >
                  Set Shipping
                </button>
              )}
              {!address.isBilling && (
                <button
                  onClick={() => handleSetDefault(address.id!, 'billing')}
                  className="text-blue-600 hover:text-blue-800"
                  disabled={loading}
                >
                  Set Billing
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {safeAddresses.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No addresses saved yet. Add your first address to get started.
        </div>
      )}
    </div>
  );
}

// Preferences Component
function PreferencesTab({ user }: { user: User }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Preferences</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 border rounded">
          <div>
            <h3 className="font-medium">Email Notifications</h3>
            <p className="text-sm text-gray-600">Receive order updates and promotions</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="flex justify-between items-center p-4 border rounded">
          <div>
            <h3 className="font-medium">SMS Notifications</h3>
            <p className="text-sm text-gray-600">Receive shipping updates via SMS</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
}

// Security Component
function SecurityTab({ user }: { user: User }) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 border rounded">
          <div>
            <h3 className="font-medium">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-600">
              {user.twoFactorEnabled ? 'Enabled' : 'Add an extra layer of security'}
            </p>
          </div>
          <button className={`px-4 py-2 rounded text-sm ${
            user.twoFactorEnabled 
              ? 'bg-gray-500 text-white hover:bg-gray-600' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}>
            {user.twoFactorEnabled ? 'Disable' : 'Enable'}
          </button>
        </div>
        
        <div className="flex justify-between items-center p-4 border rounded">
          <div>
            <h3 className="font-medium">Password</h3>
            <p className="text-sm text-gray-600">Last changed recently</p>
          </div>
          <button 
            onClick={() => setShowPasswordForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
          >
            Change Password
          </button>
        </div>

        {showPasswordForm && <PasswordChangeForm onClose={() => setShowPasswordForm(false)} />}
      </div>
    </div>
  );
}

// Password Change Form Component
function PasswordChangeForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Password changed successfully');
        onClose();
      } else {
        alert('Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg border mt-4">
      <h4 className="font-medium mb-4">Change Password</h4>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Current Password</label>
          <input
            type="password"
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">New Password</label>
          <input
            type="password"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      <div className="flex space-x-3 mt-4">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
        >
          Update Password
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// Address Form Component
function AddressForm({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
  const [formData, setFormData] = useState<CreateAddressInput>({
    type: 'home',
    street: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    isDefault: false,
    isShipping: true,
    isBilling: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/user/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      onSave();
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6">
      <h3 className="text-lg font-medium mb-4">Add New Address</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Address Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'home' | 'office' | 'other' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="home">Home</option>
            <option value="office">Office</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Street</label>
          <input
            type="text"
            value={formData.street}
            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Apartment/Suite</label>
          <input
            type="text"
            value={formData.apartment}
            onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">State</label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Postal Code</label>
          <input
            type="text"
            value={formData.postalCode}
            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Country</label>
          <input
            type="text"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isDefault}
            onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Set as default address</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isShipping}
            onChange={(e) => setFormData({ ...formData, isShipping: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Use for shipping</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isBilling}
            onChange={(e) => setFormData({ ...formData, isBilling: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Use for billing</span>
        </label>
      </div>

      <div className="mt-4 flex space-x-3">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Address
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}