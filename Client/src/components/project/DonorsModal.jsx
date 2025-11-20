import React from "react";
import { Dialog } from "@headlessui/react";

/**
 * Props:
 * - open (bool)
 * - onClose () => void
 * - donors (array)
 * - selectedProjectTitle (string)
 * - onDonorClick (donor) => void
 */
const DonorsModal = ({ open, onClose, donors = [], selectedProjectTitle, onDonorClick }) => {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-zinc-900 p-6 rounded-xl shadow-xl border border-zinc-700">
          <Dialog.Title className="text-xl font-bold mb-4 text-white">
            Donors for {selectedProjectTitle}
          </Dialog.Title>

          {donors.length === 0 ? (
            <p className="text-zinc-400 text-center">No donors yet.</p>
          ) : (
            <ul className="space-y-3 max-h-80 overflow-y-auto">
              {donors.map((donor, idx) => (
                <li
                  key={idx}
                  onClick={() => onDonorClick(donor)}
                  className="flex items-center gap-3 bg-zinc-800 p-3 rounded-lg cursor-pointer hover:bg-zinc-700 transition-colors"
                >
                  <img
                    src={
                      donor.profile_pic
                        ? `http://localhost:5000/uploads/${donor.profile_pic}`
                        : "/default-avatar.png"
                    }
                    alt="donor"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-white">
                      {donor.username || "Anonymous"}
                    </p>
                    <p className="text-zinc-400 text-sm">{donor.amount} ETH</p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="flex justify-end mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-white"
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default DonorsModal;
