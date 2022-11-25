import React from 'react';

export interface SearchBar {
  apiKey: string;
  targetIndexName: string;
  targetField: string;
}

declare module '@anoldstory/ago-react' {
  export { SearchBar };
}