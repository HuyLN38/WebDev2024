import React, { useState } from 'react';
import { auth } from '../config/firebase';
import { updateProfile } from 'firebase/auth';

const Profile = ({ user }) => {
  const [displayName, setDisplayName] = useState(user.displayName || '');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(auth.currentUser, { displayName });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
      <form onSubmit={handleUpdateProfile} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
            Display Name
          </label>
          <input
            type="text"
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;