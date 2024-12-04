import React from 'react';
import { Card, Row, Col, Button } from 'antd';

const { Meta } = Card;

interface PreparedProfilesProps {
  profiles: any[];
  onPreviewProfile: (profile: any) => void;
  onAddProfile: (profile: any) => void;
}

const PreparedProfiles: React.FC<PreparedProfilesProps> = ({
                                                             profiles,
                                                             onPreviewProfile,
                                                             onAddProfile,
                                                           }) => {
  return (
    <Row gutter={[16, 16]}>
      {profiles.map((profile) => (
        <Col key={profile.id} xs={24} sm={12} md={8}>
          <Card
            hoverable
            onClick={() => onPreviewProfile(profile)}
            style={{
              marginBottom: '16px',
              background: `linear-gradient(
      to right,
      rgba(255, 255, 255, 0.7),
      rgba(255, 255, 255, 0.7)
    ), ${profile['color-gradient'] || 'linear-gradient(to right, #e0e0e0, #f5f5f5)'}`,
              borderRadius: '8px',
            }}
          >
            <Meta title={profile.name} description={profile.description} />
            <Button
              type="primary"
              onClick={(e) => {
                e.stopPropagation();
                onAddProfile(profile);
              }}
            >
              Add Profile
            </Button>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default PreparedProfiles;
