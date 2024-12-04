// src/components/ActionButtons.tsx
import React from 'react';
import { Button } from 'antd';

interface ActionButtonsProps {
  onSendClick: () => void;
  loading: boolean;
  onProfileNavigate?: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onSendClick, loading, onProfileNavigate }) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      <Button type="primary" onClick={onSendClick} loading={loading} style={{ marginRight: '8px' }}>
        Send Text
      </Button>
      {onProfileNavigate && (
        <Button type="default" onClick={onProfileNavigate}>
          Go to Profiles
        </Button>
      )}
    </div>
  );
};

export default ActionButtons;
