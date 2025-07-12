
"use client";

import * as React from 'react';

type SearchContextType = {
  isSearchFocused: boolean;
  setIsSearchFocused: (isFocused: boolean) => void;
};

const SearchContext = React.createContext<SearchContextType | undefined>(undefined);

export function SearchContextProvider({ children }: { children: React.ReactNode }) {
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);

  return (
    <SearchContext.Provider value={{ isSearchFocused, setIsSearchFocused }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = React.useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchContextProvider');
  }
  return context;
}
