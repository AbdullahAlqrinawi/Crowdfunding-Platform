import React from "react";
import { Dialog } from "@headlessui/react";

/**
 * Props:
 * - open (bool)
 * - onClose () => void
 * - projectFormData (object)
 * - projectFileInputRef (ref)
 * - onProjectFileChange (e) => void
 * - onProjectChange (e) => void
 * - onProjectSubmit (e) => void
 * - isSaving (bool)
 */
const EditProjectModal = ({
  open,
  onClose,
  projectFormData,
  projectFileInputRef,
  onProjectFileChange,
  onProjectChange,
  onProjectSubmit,
  isSaving,
}) => {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-900 p-6 rounded-xl shadow-xl border border-zinc-700">
          <Dialog.Title className="text-xl font-bold mb-4 text-white">
            Edit Project
          </Dialog.Title>
          <form onSubmit={onProjectSubmit} className="space-y-4">
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => projectFileInputRef.current.click()}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition"
              >
                Change Project Image
              </button>
              <input
                type="file"
                accept="image/*"
                ref={projectFileInputRef}
                onChange={onProjectFileChange}
                className="hidden"
              />
            </div>

            <input
              type="text"
              name="title"
              placeholder="Project Title"
              value={projectFormData.title}
              onChange={onProjectChange}
              className="w-full p-2 rounded bg-zinc-800 text-white"
            />
            <textarea
              name="description"
              placeholder="Project Description"
              value={projectFormData.description}
              onChange={onProjectChange}
              className="w-full p-2 rounded bg-zinc-800 text-white"
              rows="3"
            />
            <input
              type="number"
              name="target"
              placeholder="Funding Target"
              value={projectFormData.target}
              onChange={onProjectChange}
              className="w-full p-2 rounded bg-zinc-800 text-white"
            />
            <input
              type="date"
              name="end_date"
              value={projectFormData.end_date}
              onChange={onProjectChange}
              className="w-full p-2 rounded bg-zinc-800 text-white"
            />
            <textarea
              name="story"
              placeholder="Project Story"
              value={projectFormData.story}
              onChange={onProjectChange}
              className="w-full p-2 rounded bg-zinc-800 text-white"
              rows="4"
            />

            <select
              name="location"
              value={projectFormData.location}
              onChange={onProjectChange}
              className="w-full p-2 rounded bg-zinc-800 text-white"
            >
              <option value="">Select Location</option>
              <option value="Jordan">Jordan</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
              <option value="Germany">Germany</option>
              <option value="Canada">Canada</option>
              <option value="India">India</option>
              <option value="Australia">Australia</option>
              <option value="France">France</option>
            </select>

            <select
              name="categoryMain"
              value={projectFormData.categoryMain}
              onChange={onProjectChange}
              className="w-full p-2 rounded bg-zinc-800 text-white"
            >
              <option value="">Select Main Category</option>
              <option value="Technology">Technology</option>
              <option value="Education">Education</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Art">Art</option>
              <option value="Environment">Environment</option>
              <option value="Gaming">Gaming</option>
              <option value="Fashion">Fashion</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Food">Food</option>
            </select>

            <select
              name="type"
              value={projectFormData.type}
              onChange={onProjectChange}
              className="w-full p-2 rounded bg-zinc-800 text-white"
            >
              <option value="">Select Type</option>
              <option value="Individual">Individual</option>
              <option value="Team">Team</option>
              <option value="Organization">Organization</option>
              <option value="Non-profit">Non-profit</option>
              <option value="Commercial">Commercial</option>
            </select>

            <select
              name="status"
              value={projectFormData.status}
              onChange={onProjectChange}
              className="w-full p-2 rounded bg-zinc-800 text-white"
            >
              <option value="">Select Status</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Active">Active</option>
              <option value="Ended">Ended</option>
            </select>

            <input
              type="text"
              name="categoryOptional"
              placeholder="Optional Category"
              value={projectFormData.categoryOptional}
              onChange={onProjectChange}
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

export default EditProjectModal;
