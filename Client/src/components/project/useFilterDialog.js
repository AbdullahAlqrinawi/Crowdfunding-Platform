import { useState } from 'react';

export function useFilterDialog() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  return { mobileFiltersOpen, setMobileFiltersOpen };
}
