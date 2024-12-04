// src/components/TabSettings.tsx
import React, { useState, useEffect } from 'react';
import {Button, Typography, Space, Modal, Tooltip, message, Tag} from 'antd';
import { RollbackOutlined } from '@ant-design/icons';
import configDefaults from './config_defaults.json';
import profilesDefaults from './profiles_defaults.json';
import SampleTextCard from './SampleTextCard';
import { Profile, SampleEntry } from './types';
import AITest from "./AiTest.tsx"; // Ensure this path is correct

const { Paragraph, Title } = Typography;

const TabSettings: React.FC = () => {
  const profiles: Profile[] = profilesDefaults.profiles;

  // Initialize sample entries with both text and defaultText
  const [sampleEntries, setSampleEntries] = useState<SampleEntry[]>(
    configDefaults.defaultSampleTexts.map((text) => ({
      text,
      defaultText: text, // Initialize defaultText with the default sample text
    }))
  );

  // Load user data from chrome.storage.sync on component mount
  useEffect(() => {
    chrome.storage.sync.get(['userSampleTexts'], (result) => {
      const userSampleTexts: string[] = result.userSampleTexts;

      if (
        userSampleTexts &&
        Array.isArray(userSampleTexts) &&
        userSampleTexts.length === configDefaults.defaultSampleTexts.length
      ) {
        const updatedSampleEntries: SampleEntry[] = userSampleTexts.map((text, index) => ({
          text,
          defaultText: configDefaults.defaultSampleTexts[index], // Align defaultText with index
        }));
        setSampleEntries(updatedSampleEntries);
      }
    });
  }, []);

  // Handler for text changes from SampleTextCard
  const handleTextChange = (index: number, newText: string) => {
    const newEntries = [...sampleEntries];
    newEntries[index].text = newText;
    setSampleEntries(newEntries);
  };

  // Function to reset sample texts to defaults
  const resetToDefaults = () => {
    Modal.confirm({
      title: 'Reset to default texts?',
      content: 'This will revert all sample texts to their default values.',
      onOk: () => {
        const defaultSampleEntries: SampleEntry[] = configDefaults.defaultSampleTexts.map((text) => ({
          text,
          defaultText: text, // Reset defaultText to original default
        }));
        setSampleEntries(defaultSampleEntries);
        chrome.storage.sync.remove(['userSampleTexts'], () => {
          console.log('Sample texts reset to default.');
          message.success('Settings have been reset to default.');
        });
      },
    });
  };

  return (
    <div style={{ padding: '16px' }}>
      <Tag bordered={false} color="purple">beta</Tag>
      <Title level={4}>Sample Texts</Title>
      <Paragraph>
        Customize the sample texts below. These texts are used to generate example responses for all profiles.
        When you change them, the example responses will be updated accordingly.
      </Paragraph>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {sampleEntries.map((entry, index) => (
          <SampleTextCard
            key={index}
            index={index}
            text={entry.text}
            defaultText={entry.defaultText} // Pass defaultText
            onTextChange={handleTextChange}
            profiles={profiles} // Pass profiles as a prop
          />
        ))}
      </Space>
      <div style={{ marginTop: '16px' }}>
        {/* Removed the Save button */}
        <Tooltip title="Revert all texts to their default values">
          <Button
            type="link" // Changed from button to link type
            icon={<RollbackOutlined />}
            onClick={resetToDefaults}
          >
            Reset to Defaults
          </Button>
        </Tooltip>
      </div>
      <AITest></AITest>
    </div>
  );
};

export default TabSettings;
