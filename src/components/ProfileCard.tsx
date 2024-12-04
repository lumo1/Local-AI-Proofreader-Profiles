import React from 'react';
import { Card, Button, Space } from 'antd';
import { StarFilled, StarOutlined } from '@ant-design/icons';

const { Meta } = Card;

interface ProfileCardProps {
  profile: any;
  isDefault: boolean;
  onEdit: (profile: any) => void;
  onDelete: (profileId: string) => void;
  onSetDefault: (profileId: string) => void;
  onPreview: (profile: any) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
                                                   profile,
                                                   isDefault,
                                                   onEdit,
                                                   onDelete,
                                                   onSetDefault,
                                                   onPreview,
                                                 }) => (
  <Card
    hoverable
    onClick={() => onPreview(profile)}
    style={{
      background: `linear-gradient(
        to right,
        rgba(255, 255, 255, 0.7),
        rgba(255, 255, 255, 0.7)
      ), ${profile['color-gradient'] || 'linear-gradient(to right, #e0e0e0, #f5f5f5)'}`,
      borderRadius: '8px',
      marginBottom: '16px',
      cursor: 'pointer',
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Meta title={profile.name} description={profile.description} />
      <Button
        icon={isDefault ? <StarFilled style={{ color: '#fadb14' }} /> : <StarOutlined />}
        onClick={(e) => {
          e.stopPropagation();
          onSetDefault(profile.id);
        }}
        style={{ border: 'none', background: 'none' }}
      />
    </div>
    <Space style={{ marginTop: '16px' }}>
      <Button
        type="primary"
        onClick={(e) => {
          e.stopPropagation();
          onEdit(profile);
        }}
      >
        Edit
      </Button>
      <Button
        type="default"
        danger
        onClick={(e) => {
          e.stopPropagation();
          onDelete(profile.id);
        }}
      >
        Delete
      </Button>
    </Space>
  </Card>
);

export default ProfileCard;
