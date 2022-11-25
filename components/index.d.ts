import React from 'react';

export interface SearchBarProps {
  apiKey:string;
  targetIndexName: string;
  targetField:string;
}

export declare function SearchBar ({
  apiKey,
  targetIndexName,
  targetField
} : SearchBarProps) : React.ReactElement | null;
