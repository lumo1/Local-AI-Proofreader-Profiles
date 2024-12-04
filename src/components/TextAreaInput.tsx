// src/components/TextAreaInput.tsx
import React from 'react';
import { Input } from 'antd';

const { TextArea } = Input;

interface TextAreaInputProps {
  inputText: string;
  setInputText: (value: string) => void;
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({ inputText, setInputText }) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      <TextArea
        rows={4}
        placeholder="Enter your text here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
    </div>
  );
};

export default TextAreaInput;
