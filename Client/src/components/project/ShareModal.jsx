import { useState } from 'react';
import { XMarkIcon, LinkIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function ShareModal({ isOpen, onClose, projectLink }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(projectLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link: ', err);
      const textArea = document.createElement('textarea');
      textArea.value = projectLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Share Project</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-700 transition"
          >
            <XMarkIcon className="h-6 w-6 text-gray-400" />
          </button>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-300">Share this project with others:</p>
          
          <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
            <LinkIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={projectLink}
              readOnly
              className="flex-1 bg-transparent text-white text-sm outline-none truncate"
            />
          </div>
          
          <button
            onClick={handleCopyLink}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
              copied 
                ? 'bg-green-600 text-white' 
                : 'bg-primary text-white hover:bg-primary-dark'
            }`}
          >
            {copied ? (
              <>
                <CheckIcon className="h-5 w-5" />
                Link Copied!
              </>
            ) : (
              <>
                <LinkIcon className="h-5 w-5" />
                Copy Link
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}