// src/types.ts

export interface Profile {
  id: string;
  name: string;
  description: string;
  key_attributes: {
    formality: string;
    tone: string;
    complexity: string;
  };
  examples: string[];
  transformations: {
    [key: string]: string;
  };
  'color-gradient': string;
}

export interface SampleEntry {
  text: string;
  defaultText: string; // Added defaultText property
}
