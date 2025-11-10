import React, { useState } from 'react';
import InputField from '../../components/project/InputField';

const CompleteProfile = () => {
  const [form, setForm] = useState({
    fullName: '',
    linkedin: '',
    twitter: '',
    bio: '',
    profilePicture: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('User Profile Data:', form);
    alert("Profile completed!");
  };

  return (
    <div className="min-h-screen bg-primary text-white flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl w-full max-w-lg space-y-4 shadow-lg">
        <h2 className="text-2xl font-bold">Complete Your Profile</h2>
        <InputField label="Full Name" type="text" name="fullName" value={form.fullName} onChange={handleChange} required />
        <InputField label="LinkedIn" type="url" name="linkedin" value={form.linkedin} onChange={handleChange} />
        <InputField label="X (Twitter)" type="url" name="twitter" value={form.twitter} onChange={handleChange} />
        <div className="mb-4">
          <label className="block text-sm mb-2">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>
        <div className="mb-4">
  <label className="block text-sm mb-2">Profile Picture</label>
  
  <div className="flex items-center gap-4">
    {form.profilePicture && (
      <img
        src={URL.createObjectURL(form.profilePicture)}
        alt="Preview"
        className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-500"
      />
    )}

    <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white text-sm py-2 px-4 rounded-md">
      Upload Photo
      <input
        type="file"
        name="profilePicture"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </label>
  </div>
</div>

        <button className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded text-white font-semibold">Finish</button>
      </form>
    </div>
  );
};

export default CompleteProfile;
