// src/components/ProfileSelection.tsx
import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

interface ProfileSelectionProps {
  profiles: any[];
  selectedProfileId: string;
  onProfileChange: (value: string) => void;
}

const ProfileSelection: React.FC<ProfileSelectionProps> = ({
                                                             profiles,
                                                             selectedProfileId,
                                                             onProfileChange,
                                                           }) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      <Select
        value={selectedProfileId}
        onChange={onProfileChange}
        style={{ width: 200 }}
        placeholder="Select a profile"
      >
        {profiles.map((profile) => (
          <Option key={profile.id} value={profile.id}>
            {profile.name}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default ProfileSelection;
