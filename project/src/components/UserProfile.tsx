import React, { useState } from 'react';
import { 
  User, Mail, Calendar, LogOut, Settings, 
  Edit3, Save, X, Camera, Shield
} from 'lucide-react';
import { authService } from '../utils/authService';
import { User as UserType } from '../types/auth';

interface UserProfileProps {
  user: UserType;
  onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    
    // Simulate API call - replace with real update logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Abstract method - replace with real user update
    console.log('Updating user:', editForm);
    
    setIsLoading(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      name: user.name,
      email: user.email
    });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await authService.logout();
    onLogout();
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 px-6 py-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
              alt={user.name}
              className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
            />
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors">
              <Camera className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <div className="text-white">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-green-100">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Verified Account</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Profile Information */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              {isEditing ? (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{user.name}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              {isEditing ? (
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{user.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <span className="text-sm text-gray-600">Member since</span>
                <p className="text-gray-900">{formatDate(user.createdAt)}</p>
              </div>
            </div>

            {user.lastLogin && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <span className="text-sm text-gray-600">Last login</span>
                  <p className="text-gray-900">{formatDate(user.lastLogin)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 rounded-xl transition-colors">
            <Settings className="w-5 h-5 text-gray-400" />
            <div>
              <p className="font-medium text-gray-900">Account Settings</p>
              <p className="text-sm text-gray-600">Manage your account preferences</p>
            </div>
          </button>

          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full flex items-center gap-3 p-4 text-left hover:bg-red-50 rounded-xl transition-colors text-red-600 disabled:opacity-50"
          >
            <LogOut className="w-5 h-5" />
            <div>
              <p className="font-medium">Sign Out</p>
              <p className="text-sm text-red-500">Sign out of your account</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;