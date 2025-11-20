import React from "react";
import { Dialog } from "@headlessui/react";

/**
 * Props:
 * - open (bool)
 * - onClose () => void
 * - previewImage (string)
 * - fileInputRef (ref)
 * - formData (object)
 * - onChange (e) => void
 * - onFileChange (e) => void
 * - onSubmit (e) => void
 * - isSaving (bool)
 */
const EditProfileModal = ({
  open,
  onClose,
  previewImage,
  fileInputRef,
  formData,
  onChange,
  onFileChange,
  onSubmit,
  isSaving,
}) => {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-zinc-900 p-6 rounded-xl shadow-xl border border-zinc-700">
          <Dialog.Title className="text-xl font-bold mb-4 text-white">
            Edit Profile
          </Dialog.Title>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="flex justify-center">
              <img
                src={previewImage || "/default-avatar.png"}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover border-2 border-zinc-600"
              />
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition"
              >
                Choose an image
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={onFileChange}
                className="hidden"
              />
            </div>

            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={onChange}
              className="w-full p-2 rounded bg-zinc-800 text-white"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={onChange}
              className="w-full p-2 rounded bg-zinc-800 text-white"
            />
            <textarea
              name="bio"
              placeholder="Bio"
              value={formData.bio}
              onChange={onChange}
              className="w-full p-2 rounded bg-zinc-800 text-white"
            />
            <input
              type="text"
              name="linkedin"
              placeholder="LinkedIn"
              value={formData.linkedin}
              onChange={onChange}
              className="w-full p-2 rounded bg-zinc-800 text-white"
            />
            <input
              type="text"
              name="twitter"
              placeholder="Twitter"
              value={formData.twitter}
              onChange={onChange}
              className="w-full p-2 rounded bg-zinc-800 text-white"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-zinc-600 text-white hover:bg-zinc-700 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center gap-2"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EditProfileModal;
