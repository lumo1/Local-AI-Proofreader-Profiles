import React, { useState, useEffect } from 'react';
import { Button, Input, Card, Slider } from 'antd';

let session: any = null;

const SYSTEM_PROMPT = 'You are a helpful and friendly assistant.';

const AITest: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [temperature, setTemperature] = useState<number>(0.7);
  const [topK, setTopK] = useState<number>(3);

  useEffect(() => {
    const initDefaults = async () => {
      try {
        // @ts-ignore
        if (!('aiOriginTrial' in chrome)) {
          setAiResponse('Error: chrome.aiOriginTrial not supported in this browser');
          return;
        }
        // @ts-ignore
        const defaults = await chrome.aiOriginTrial.languageModel.capabilities();
        console.log('Model default:', defaults);
        if (defaults.available !== 'readily') {
          setAiResponse(`Model not yet available (current state: "${defaults.available}")`);
          return;
        }
        setTemperature(defaults.defaultTemperature || 0.7);
        setTopK(defaults.defaultTopK > 3 ? 3 : defaults.defaultTopK);
      } catch (error) {
        console.error('Error initializing defaults:', error);
      }
    };

    initDefaults();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleTemperatureChange = (value: number) => {
    setTemperature(value);
    resetSession();
  };

  const handleTopKChange = (value: number) => {
    setTopK(value);
    resetSession();
  };

  const resetSession = async () => {
    if (session) {
      await session.destroy();
    }
    session = null;
  };

  const sendToAIModel = async () => {
    setLoading(true);
    try {
      // Create a session if it doesn't exist
      if (!session) {
        const params = {
          systemPrompt: SYSTEM_PROMPT,
          temperature: temperature,
          topK: topK,
        };
        // @ts-ignore
        session = await chrome.aiOriginTrial.languageModel.create(params);
      }

      // Generate AI response
      // @ts-ignore
      const response = await session.prompt(inputText);

      // Update state with the response output
      if (response) {
        setAiResponse(response);
      } else {
        setAiResponse('No response from AI model.');
      }
    } catch (error) {
      console.error('Error interacting with AI model:', error);
      setAiResponse('Error interacting with AI model. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="AI Prompt Tester" style={{ width: '100%', maxWidth: 600, margin: '0 auto', marginTop: 50 }}>
      <Input.TextArea
        rows={4}
        value={inputText}
        onChange={handleInputChange}
        placeholder="Enter text to prompt AI model"
      />
      <div style={{ marginTop: 20 }}>
        <label>Temperature:</label>
        <Slider
          min={0}
          max={1}
          step={0.1}
          value={temperature}
          onChange={handleTemperatureChange}
        />
        <label>Top K:</label>
        <Slider
          min={1}
          max={10}
          step={1}
          value={topK}
          onChange={handleTopKChange}
        />
      </div>
      <Button
        type="primary"
        onClick={sendToAIModel}
        loading={loading}
        style={{ marginTop: 20 }}
      >
        Send to AI Model
      </Button>
      <Button
        type="default"
        onClick={resetSession}
        style={{ marginTop: 10, marginLeft: 10 }}
      >
        Reset Session
      </Button>
      <div style={{ marginTop: 30 }}>
        <h3>AI Model Response:</h3>
        <p>{aiResponse}</p>
      </div>
    </Card>
  );
};

export default AITest;
