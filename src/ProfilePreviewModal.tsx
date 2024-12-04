// ProfilePreviewModal.tsx
import React from 'react';
import { Modal, Typography, List } from 'antd';

const { Paragraph } = Typography;

interface ProfilePreviewModalProps {
  profile: any;
  onClose: () => void;
}

const ProfilePreviewModal: React.FC<ProfilePreviewModalProps> = ({ profile, onClose }) => {
  return (
    <Modal
      title={profile.name}
      open={true}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Paragraph>
        <strong>Description:</strong> {profile.description}
      </Paragraph>
      <Paragraph>
        <strong>Key Attributes:</strong>
      </Paragraph>
      <ul>
        {profile.key_attributes &&
          Object.entries(profile.key_attributes).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {String(value)}
            </li>
          ))}
      </ul>
      <Paragraph>
        <strong>Examples and Transformations:</strong>
      </Paragraph>
      <List
        itemLayout="vertical"
        dataSource={profile.examples || []}
        renderItem={(example: string, index: number) => {
          const transformationKey = `example_${index + 1}`;
          const transformation = profile.transformations?.[transformationKey] || '';
          return (
            <List.Item key={index}>
              <Paragraph>
                <strong>Example {index + 1}:</strong> {example}
              </Paragraph>
              {transformation && (
                <Paragraph>
                  <strong>Transformation:</strong> {transformation}
                </Paragraph>
              )}
            </List.Item>
          );
        }}
      />
      <Paragraph>
        <strong>Features:</strong>
      </Paragraph>
      <ul>
        <li>
          <strong>Show Advanced Details:</strong> {profile.features?.showAdvancedDetails ? 'Yes' : 'No'}
        </li>
      </ul>
    </Modal>
  );
};

export default ProfilePreviewModal;
