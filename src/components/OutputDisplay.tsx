import React from 'react';
import { Button, Typography } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

const { Paragraph } = Typography;

interface OutputDisplayProps {
  outputText: string;
  feedback: string;
  profile: any;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({
                                                       outputText,
                                                       feedback,
                                                       profile,
                                                     }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
  };

  return (
    <>
      {outputText && (
        <div
          className="output-display"
          style={{
            background: profile?.['color-gradient'] || 'linear-gradient(to right, #e0e0e0, #f5f5f5)',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '16px',
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}
          >
            <Typography.Title level={5} style={{ margin: 0, color: '#333' }}>
              Transformed Text
            </Typography.Title>
            <Button
              type="primary"
              icon={<CopyOutlined />}
              onClick={handleCopy}
              size="small"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                borderColor: 'transparent',
                color: '#333',
              }}
            >
              Copy
            </Button>
          </div>
          <Paragraph
            style={{
              whiteSpace: 'pre-wrap',
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: '12px',
              margin: 0,
            }}
          >
            {outputText}
          </Paragraph>
        </div>
      )}
      {feedback && (
        <div>
          <Typography.Title level={5} style={{ marginTop: '16px' }}>
            Feedback
          </Typography.Title>
          <Paragraph
            style={{
              whiteSpace: 'pre-wrap',
              border: '1px solid #ddd',
              padding: '12px',
              borderRadius: '4px',
              background: '#f9f9f9',
            }}
          >
            {feedback}
          </Paragraph>
        </div>
      )}
    </>
  );
};

export default OutputDisplay;
