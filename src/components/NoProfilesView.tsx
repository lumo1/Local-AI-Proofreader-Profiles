import React from 'react';
import { Button, Empty, Space, Typography } from 'antd';

const { Paragraph } = Typography;

interface NoProfilesViewProps {
  title?: string; // Optional title for empty state
  description?: string; // Optional description
  primaryButtonLabel: string; // Label for the first button
  secondaryButtonLabel: string; // Label for the second button
  primaryButtonIcon?: React.ReactNode; // Optional icon for the first button
  secondaryButtonIcon?: React.ReactNode; // Optional icon for the second button
  onPrimaryButtonClick: () => void; // Action for the first button
  onSecondaryButtonClick: () => void; // Action for the second button
}

const NoProfilesView: React.FC<NoProfilesViewProps> = ({
                                                         title = 'No Items Found', // Default title
                                                         description = 'You currently don’t have any items set up.', // Default description
                                                         primaryButtonLabel,
                                                         secondaryButtonLabel,
                                                         primaryButtonIcon,
                                                         secondaryButtonIcon,
                                                         onPrimaryButtonClick,
                                                         onSecondaryButtonClick,
                                                       }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <>
            <Paragraph strong>{title}</Paragraph>
            <Paragraph>{description}</Paragraph>
          </>
        }
      >
        <Space direction="vertical">
          <Button
            type="primary"
            icon={primaryButtonIcon}
            onClick={onPrimaryButtonClick}
          >
            {primaryButtonLabel}
          </Button>
          <Button
            type="default"
            icon={secondaryButtonIcon}
            onClick={onSecondaryButtonClick}
          >
            {secondaryButtonLabel}
          </Button>
        </Space>
      </Empty>
    </div>
  );
};

export default NoProfilesView;
