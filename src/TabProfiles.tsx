import React, { useState, useEffect } from 'react';
import { Button, Typography, Space, message, Modal } from 'antd';
import { PlusOutlined, FolderOpenOutlined } from '@ant-design/icons';
import AddProfileModal from './components/AddProfileModal';
import NoProfilesView from './components/NoProfilesView';
import PreparedProfiles from './PreparedProfiles';
import ProfileCard from './components/ProfileCard';
import profilesDefaults from './profiles_defaults.json';

const { Title } = Typography;

const TabProfiles: React.FC = () => {
  const [userProfiles, setUserProfiles] = useState<any[]>([]);
  const [defaultProfileId, setDefaultProfileId] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<'add' | 'edit' | 'prepared' | 'preview' | null>(null);
  const [editProfile, setEditProfile] = useState<any | null>(null);
  const [previewProfile, setPreviewProfile] = useState<any | null>(null);

  useEffect(() => {
    chrome.storage.sync.get(['userProfiles', 'defaultProfileId'], (result) => {
      setUserProfiles(result.userProfiles || []);
      setDefaultProfileId(result.defaultProfileId || null);
    });
  }, []);

  const handleAddProfile = (profile: any) => {
    const exists = userProfiles.some((existingProfile) => existingProfile.id === profile.id);

    if (exists) {
      message.info(`Profile "${profile.name}" is already added.`);
      return;
    }

    const updatedProfiles = [...userProfiles, profile];
    chrome.storage.sync.set({ userProfiles: updatedProfiles }, () => {
      setUserProfiles(updatedProfiles);
      message.success(`Profile "${profile.name}" added.`);
      setActiveModal(null);
    });
  };

  const handleEditProfile = (updatedProfile: any) => {
    const updatedProfiles = userProfiles.map((profile) =>
      profile.id === updatedProfile.id ? updatedProfile : profile
    );
    chrome.storage.sync.set({ userProfiles: updatedProfiles }, () => {
      setUserProfiles(updatedProfiles);
      message.success(`Profile "${updatedProfile.name}" updated.`);
      setActiveModal(null);
    });
  };

  const handleDeleteProfile = (profileId: string) => {
    const updatedProfiles = userProfiles.filter((profile) => profile.id !== profileId);
    chrome.storage.sync.set({ userProfiles: updatedProfiles }, () => {
      setUserProfiles(updatedProfiles);
      message.success('Profile deleted.');
    });
  };

  return (
    <div>
      {userProfiles.length === 0 ? (
        <NoProfilesView
          title="No Profiles Found"
          description="You currently don't have any profiles set up."
          primaryButtonLabel="Create New Profile"
          secondaryButtonLabel="Use Prepared Profiles"
          primaryButtonIcon={<PlusOutlined />}
          secondaryButtonIcon={<FolderOpenOutlined />}
          onPrimaryButtonClick={() => setActiveModal('add')}
          onSecondaryButtonClick={() => setActiveModal('prepared')}
        />
      ) : (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Title level={4}>Profiles</Title>
          <div style={{ marginBottom: '16px' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setActiveModal('add')}
              style={{ marginRight: '8px' }}
            >
              Create New Profile
            </Button>
            <Button
              type="default"
              icon={<FolderOpenOutlined />}
              onClick={() => setActiveModal('prepared')}
            >
              Use Prepared Profiles
            </Button>
          </div>
          {userProfiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              isDefault={profile.id === defaultProfileId}
              onSetDefault={(profileId) => {
                const isDefault = profileId === defaultProfileId;
                chrome.storage.sync.set({ defaultProfileId: isDefault ? null : profileId }, () => {
                  setDefaultProfileId(isDefault ? null : profileId);
                  message.success(
                    isDefault
                      ? 'Default profile unset.'
                      : `Profile "${profile.name}" set as default.`
                  );
                });
              }}
              onEdit={(profile) => {
                setEditProfile(profile);
                setActiveModal('edit');
              }}
              onDelete={handleDeleteProfile}
              onPreview={(profile) => {
                setPreviewProfile(profile);
                setActiveModal('preview');
              }}
            />
          ))}
        </Space>
      )}

      {(activeModal === 'add' || activeModal === 'edit') && (
        <AddProfileModal
          visible={activeModal === 'add' || activeModal === 'edit'}
          onClose={() => setActiveModal(null)}
          onAddProfile={activeModal === 'add' ? handleAddProfile : handleEditProfile}
          initialData={activeModal === 'edit' ? editProfile : null}
        />
      )}

      {activeModal === 'prepared' && (
        <Modal
          title="Use Prepared Profiles"
          open={activeModal === 'prepared'}
          onCancel={() => setActiveModal(null)}
          footer={null}
          width="80%"
        >
          <PreparedProfiles
            profiles={profilesDefaults.profiles.filter(
              (profile) => !userProfiles.some((existing) => existing.id === profile.id)
            )}
            onPreviewProfile={(profile) => {
              setPreviewProfile(profile);
              setActiveModal('preview');
            }}
            onAddProfile={handleAddProfile}
          />
        </Modal>
      )}

      {activeModal === 'preview' && previewProfile && (
        <Modal
          title={`Preview Profile: ${previewProfile.name}`}
          open={activeModal === 'preview'}
          onCancel={() => setActiveModal(null)}
          footer={null}
          width="60%"
        >
          <div style={{ padding: '16px' }}>
            <Typography.Paragraph>{previewProfile.description}</Typography.Paragraph>

            {previewProfile.domains && previewProfile.domains.length > 0 && (
              <>
                <Typography.Title level={5}>Domains:</Typography.Title>
                <Typography.Paragraph>
                  {previewProfile.domains.join(', ')}
                </Typography.Paragraph>
              </>
            )}

            {previewProfile.examples && previewProfile.examples.length > 0 && (
              <>
                <Typography.Title level={5}>Examples:</Typography.Title>
                {previewProfile.examples.map((example: string, index: number) => (
                  <Typography.Paragraph key={index}>
                    "{example}"
                  </Typography.Paragraph>
                ))}
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TabProfiles;
