'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import {
  Squares2X2Icon,
  ListBulletIcon,
  ChevronDownIcon,
  ArrowPathIcon
} from '@heroicons/react/20/solid';

const filters = {
  status: ['Upcoming', 'Active', 'Ended'],
  location: ['Jordan', 'USA', 'UK', 'Germany', 'Canada', 'India', 'Australia', 'France'],
  category: [
    'Technology', 'Education', 'Healthcare', 'Finance', 'Art',
    'Environment', 'Gaming', 'Fashion', 'Real Estate', 'Food'
  ],
  type: ['Individual', 'Team', 'Organization', 'Non-profit', 'Commercial']
};

export default function FilterBar({ mobileFiltersOpen, setMobileFiltersOpen, onFilterChange }) {
  const [selectedFilters, setSelectedFilters] = useState({});
  const [view, setView] = useState('Grid');
  const [dateSort, setDateSort] = useState('Newest First');
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleSelect = (key, value) => {
    const newFilters = { ...selectedFilters, [key]: value };
    setSelectedFilters(newFilters);
    setOpenDropdown(null);
    onFilterChange(newFilters);
  };

  const handleResetFilters = () => {
    setSelectedFilters({});
    onFilterChange({});
  };

  return (
    <>
      <Dialog open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)} className="relative z-50 sm:hidden">
        <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
        <div className="fixed inset-0 flex justify-center items-start p-4">
          <Dialog.Panel className="w-full max-w-sm bg-gray-900 text-white p-4 rounded-xl space-y-6 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)} className="text-sm text-gray-400 hover:text-white">Close</button>
            </div>

            {Object.entries(filters).map(([key, values]) => (
              <div key={key}>
                <h3 className="text-sm font-semibold text-gray-300 mb-2 capitalize">{key}</h3>
                <div className="flex flex-wrap gap-2">
                  {values.map((value) => (
                    <button
                      key={value}
                      onClick={() => handleSelect(key, value)}
                      className={`px-3 py-1 text-sm rounded-md font-medium ${
                        selectedFilters[key] === value
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={handleResetFilters}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 px-3 py-2 rounded-md text-sm font-medium text-white w-full"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Reset Filters
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>

      <aside className="hidden sm:block sm:w-64 bg-gray-900 text-white p-4 rounded-xl shadow-lg space-y-6">
        {Object.entries(filters).map(([key, values]) => (
          <div key={key}>
            <h3 className="text-sm font-semibold text-gray-300 mb-2 capitalize">{key}</h3>
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === key ? null : key)}
                className="w-full flex justify-between items-center rounded-md bg-gray-800 px-3 py-2 text-sm font-medium ring-1 ring-gray-700 hover:bg-gray-700"
              >
                {selectedFilters[key] || `Select ${key}`}
                <ChevronDownIcon className="h-4 w-4 text-gray-400" />
              </button>
              {openDropdown === key && (
                <div className="mt-2 max-h-60 overflow-y-auto rounded-md bg-gray-800 shadow-inner ring-1 ring-gray-700 p-2 space-y-1 z-10">
                  {values.map((value) => (
                    <button
                      key={value}
                      onClick={() => handleSelect(key, value)}
                      className={`w-full text-left px-3 py-1 rounded-md text-sm font-medium ${
                        selectedFilters[key] === value
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        <button
          onClick={handleResetFilters}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-500 px-3 py-2 rounded-md text-sm font-medium text-white w-full"
        >
          <ArrowPathIcon className="h-4 w-4" />
          Reset Filters
        </button>
      </aside>
    </>
  );
}