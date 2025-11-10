'use client';

import { FunnelIcon } from '@heroicons/react/20/solid';
import { useState, useEffect } from 'react';

export const Search = ({ onMobileFilterOpen, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">All Campaigns</h1>
      <div className="flex items-center w-full sm:w-auto">
        <input
          type="text"
          placeholder="Search campaigns..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-[400px] px-4 py-2 rounded-l-md sm:rounded-md bg-gray-800 border border-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={onMobileFilterOpen}
          className="px-4 py-2 bg-gray-800 border border-gray-700 border-l-0 rounded-r-md text-white hover:bg-gray-700 sm:hidden"
        >
          <FunnelIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};