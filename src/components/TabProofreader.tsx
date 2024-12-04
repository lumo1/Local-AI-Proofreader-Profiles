import React, { useState, useEffect } from 'react';
import { message, Typography, Checkbox, Select, Spin } from 'antd';
import { PlusOutlined, FolderOpenOutlined } from '@ant-design/icons';
import TextAreaInput from './TextAreaInput';
import OutputDisplay from './OutputDisplay';
import ActionButtons from './ActionButtons';
import NoProfilesView from './NoProfilesView';
import {
  constructProofreadPrompt,
  constructStyleTransformationPrompt,
  constructFeedbackPrompt,
} from '../utils/promptUtils';
import { createSession, promptSession, resetSession } from '../utils/sessionUtils';
import './TabProofreader.css';

const { Option } = Select;

let session: any = null;

const SYSTEM_PROMPT = 'You are a helpful and friendly assistant.';

interface Profile {
  id: string;
  name: string;
  description: string;
  'color-gradient'?: string;
  domains?: string[];
  examples?: string[];
}

interface TabProofreaderProps {
  setActiveTabKey: (key: string) => void;
}

const TabProofreader: React.FC<TabProofreaderProps> = ({ setActiveTabKey }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [manualProfileOverride, setManualProfileOverride] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>(''); // Track user input
  const [outputText, setOutputText] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [generateFeedback, setGenerateFeedback] = useState<boolean>(true);

  useEffect(() => {
    const loadProfiles = () => {
      chrome.storage.sync.get(['userProfiles', 'defaultProfileId'], (result) => {
        const userProfiles: Profile[] = result.userProfiles || [];
        const defaultId: string | null = result.defaultProfileId || null;

        setProfiles(userProfiles);

        if (!inputText && !manualProfileOverride) {
          // Automatically select the default profile if no input and no manual override
          if (defaultId && userProfiles.some((profile: Profile) => profile.id === defaultId)) {
            setSelectedProfileId(defaultId);
          } else if (userProfiles.length > 0) {
            setSelectedProfileId(userProfiles[0].id);
          }
        }
      });
    };

    loadProfiles();

    const handleStorageChange = (changes: any, areaName: string) => {
      if (areaName === 'sync') {
        if (changes.userProfiles) {
          const userProfiles: Profile[] = changes.userProfiles.newValue || [];
          setProfiles(userProfiles);
        }

        if (changes.defaultProfileId) {
          const defaultId: string | null = changes.defaultProfileId.newValue || null;

          if (!inputText && !manualProfileOverride) {
            // Automatically update selected profile if no input and no manual override
            if (defaultId && profiles.some((profile: Profile) => profile.id === defaultId)) {
              setSelectedProfileId(defaultId);
            } else if (profiles.length > 0) {
              setSelectedProfileId(profiles[0].id);
            }
          }
        }
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, [inputText, profiles, manualProfileOverride]);

  const handleProfileChange = (value: string) => {
    setSelectedProfileId(value);
    setManualProfileOverride(true); // Prevent automatic default profile selection
  };

  const handleSendClick = async () => {
    if (!inputText) {
      message.warning('Please enter some text before sending.');
      return;
    }
    if (!selectedProfileId) {
      message.warning('Please select a profile.');
      return;
    }

    const selectedProfile = profiles.find((p) => p.id === selectedProfileId);
    if (!selectedProfile) {
      message.error('Selected profile not found.');
      return;
    }

    setLoading(true);
    setOutputText('');
    setFeedback('');

    try {
      if (session) {
        await resetSession();
      }

      session = await createSession({ systemPrompt: SYSTEM_PROMPT });

      if (!session) {
        message.error('Failed to create AI session. Please try again later.');
        setLoading(false);
        return;
      }

      const proofreadPrompt = constructProofreadPrompt(inputText);
      const proofreadResponse = await promptSession(session, proofreadPrompt);

      if (!proofreadResponse) {
        message.error('No response from AI model during proofreading. Please try again later.');
        setLoading(false);
        return;
      }

      const proofreadText = proofreadResponse;

      const stylePrompt = constructStyleTransformationPrompt(proofreadText, selectedProfile);
      const styleResponse = await promptSession(session, stylePrompt);

      if (!styleResponse) {
        message.error('No response from AI model during style transformation. Please try again later.');
        setLoading(false);
        return;
      }

      const transformedText = styleResponse;
      setOutputText(transformedText);

      if (generateFeedback) {
        const feedbackPrompt = constructFeedbackPrompt(inputText, transformedText);
        const feedbackResponse = await promptSession(session, feedbackPrompt);
        setFeedback(feedbackResponse || 'No feedback from AI model.');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error interacting with AI model:', error);
      message.error('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const selectedProfile = profiles.find((p) => p.id === selectedProfileId);
  const profileGradient = selectedProfile?.['color-gradient'] || 'linear-gradient(to right, #ffffff, #f0f0f0)';

  return (
    <div>
      {profiles.length === 0 ? (
        <NoProfilesView
          title="No Profiles Found"
          description="You currently don't have any profiles set up."
          primaryButtonLabel="Go to Profiles"
          secondaryButtonLabel="Open Settings"
          primaryButtonIcon={<PlusOutlined />}
          secondaryButtonIcon={<FolderOpenOutlined />}
          onPrimaryButtonClick={() => setActiveTabKey('2')}
          onSecondaryButtonClick={() => setActiveTabKey('3')}
        />
      ) : (
        <div className="tab-proofreader-container" style={{ background: profileGradient }}>
          <Typography.Title level={4} className="proofreader-title">
            Proofreader
          </Typography.Title>
          <Select
            value={selectedProfileId || undefined}
            onChange={handleProfileChange}
            style={{ width: '100%', marginBottom: '16px' }}
            placeholder="Select a profile"
          >
            {profiles.map((profile) => (
              <Option key={profile.id} value={profile.id}>
                {profile.name}
              </Option>
            ))}
          </Select>
          <TextAreaInput inputText={inputText} setInputText={setInputText} />
          <Checkbox
            className="proofreader-checkbox"
            checked={generateFeedback}
            onChange={(e) => setGenerateFeedback(e.target.checked)}
          >
            Generate Feedback
          </Checkbox>
          <ActionButtons onSendClick={handleSendClick} loading={loading} />
          {loading ? (
            <Spin tip="Processing..." />
          ) : (
            <OutputDisplay
              outputText={outputText}
              feedback={feedback}
              profile={selectedProfile}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default TabProofreader;
