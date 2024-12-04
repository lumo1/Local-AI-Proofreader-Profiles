// src/components/SampleTextCard.tsx
import React, { useState, useEffect } from 'react';
import { Card, Input, Select, Button, Typography, Tooltip, message, Space } from 'antd';
import {EyeOutlined, EditOutlined, SaveOutlined, UndoOutlined, CloseOutlined} from '@ant-design/icons';
import { Profile } from './types'; // Adjust the path as necessary
import { transformationMap } from './transformationMap'; // Adjust the path as necessary
import './SampleTextCard.css'; // Import the CSS file

const { Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface SampleTextCardProps {
  index: number;
  text: string;
  defaultText: string; // New prop for default text
  onTextChange: (index: number, newText: string) => void;
  profiles: Profile[]; // Passed as a prop for dynamic access
}

const SampleTextCard: React.FC<SampleTextCardProps> = ({
                                                         index,
                                                         text,
                                                         defaultText, // Destructure the new prop
                                                         onTextChange,
                                                         profiles,
                                                       }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editableText, setEditableText] = useState<string>(text);
  const [transformedText, setTransformedText] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string>(profiles[0].id); // Local state

  // Update editableText when the text prop changes
  useEffect(() => {
    setEditableText(text);
  }, [text]);

  // Retrieve the selected profile to access its color-gradient
  const selectedProfile: Profile | undefined = profiles.find((p) => p.id === selectedProfileId);

  // Dynamic styling for transformed text
  const transformedTextStyle: React.CSSProperties = selectedProfile
    ? {
      background: selectedProfile['color-gradient'],
      ...styles.transformedText, // Apply additional styles from CSS
    }
    : {
      background: '#f5f5f5',
      color: '#000000',
      padding: '10px',
      borderRadius: '4px',
      opacity: 0.85,
    };

  // Dynamic card border using color-gradient
  const cardStyle: React.CSSProperties = selectedProfile
    ? {
      border: '4px solid',
      borderImage: `${selectedProfile['color-gradient']} 1`, // Accessing 'color-gradient' via bracket notation
    }
    : { borderColor: '#d9d9d9' }; // Default color if no profile is selected

  // Handle transformation based on selected profile
  const handlePreview = async () => {
    setLoading(true);
    try {
      const transformFn = transformationMap[selectedProfileId];
      if (!transformFn) {
        message.error('Transformation function not found for the selected profile.');
        return;
      }
      const result = await transformFn(editableText);
      setTransformedText(result);
    } catch (error) {
      console.error('Error during transformation:', error);
      message.error('Failed to transform text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Save edited text and trigger transformation
  const handleSave = () => {
    if (editableText.trim() === '') {
      message.error('Sample text cannot be empty.');
      return;
    }
    onTextChange(index, editableText);
    setIsEditing(false);
    message.success('Sample text saved successfully.');
    handlePreview();
  };

  // Cancel editing without saving changes
  const handleCancel = () => {
    setEditableText(text); // Reset to the last saved text
    setIsEditing(false);
    message.info('Editing canceled.');
  };

  // Revert changes to the default text without exiting edit mode
  const handleRevertToDefault = () => {
    setEditableText(defaultText); // Reset to the default text
    setTransformedText(null); // Clear any transformed text
    message.info('Changes reverted to the default state.');
  };

  // Handle profile selection change
  const handleProfileSelect = (value: string) => {
    setSelectedProfileId(value);
    setTransformedText(null); // Clear previous transformed text
  };

  return (
    <Card title={`Sample Text ${index + 1}`} style={cardStyle} bordered>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* Text Container with Overlay */}
        <div className="text-container">
          {isEditing ? (
            <TextArea
              value={editableText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditableText(e.target.value)}
              rows={3}
              placeholder="Enter sample text here..."
            />
          ) : (
            <Paragraph style={{ margin: 0 }}>{text}</Paragraph>
          )}

          {/* Overlay with Edit Button */}
          {!isEditing && (
            <div className="overlay">
              <Tooltip title="Edit Sample Text">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => setIsEditing(true)}
                  className="edit-button"
                  aria-label="Edit Sample Text"
                />
              </Tooltip>
            </div>
          )}
        </div>

        {/* Action Buttons (Visible Only in Edit Mode) */}
        {isEditing && (
          <Space size="small">
            <Button
              type="primary"
              size="small"
              icon={<SaveOutlined />}
              onClick={handleSave}
            >
              Save
            </Button>
            <Button
              type="default"
              size="small"
              icon={<CloseOutlined />}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Tooltip title="Revert to default text">
              <Button
                type="link"
                size="small"
                icon={<UndoOutlined />}
                onClick={handleRevertToDefault} // Use the new revert function
              >
                Revert
              </Button>
            </Tooltip>
          </Space>
        )}

        {/* Profile Selector */}
        <Select
          value={selectedProfileId}
          onChange={handleProfileSelect}
          style={{ width: '100%', marginTop: isEditing ? '16px' : '0' }}
          placeholder="Select a profile"
        >
          {profiles.map((profile) => (
            <Option key={profile.id} value={profile.id}>
              {profile.name}
            </Option>
          ))}
        </Select>

        {/* Preview Transformed Text Button */}
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={handlePreview}
          loading={loading}
          style={{ width: '100%', marginTop: '16px' }}
        >
          Preview Transformed Text
        </Button>

        {/* Display Transformed Text with Gradient Background */}
        {transformedText && (
          <Paragraph className="transformed-text" style={transformedTextStyle}>
            {transformedText}
          </Paragraph>
        )}
      </Space>
    </Card>
  );
};

// Additional inline styles if necessary
const styles = {
  transformedText: {
    padding: '10px',
    borderRadius: '4px',
    opacity: 0.85,
    color: '#ffffff',
  } as React.CSSProperties,
};

export default React.memo(SampleTextCard);
