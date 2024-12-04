import React, { useState } from 'react';
import { Modal, Form, Input, Button, List, Typography, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title } = Typography;

interface AddProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onAddProfile: (profileData: any) => void;
  initialData?: any;
}

const AddProfileModal: React.FC<AddProfileModalProps> = ({ visible, onClose, onAddProfile, initialData }) => {
  const [form] = Form.useForm();

  // State for examples and domains
  const [examples, setExamples] = useState<string[]>(initialData?.examples || []);
  const [domains, setDomains] = useState<string[]>(initialData?.domains || []);

  // Temporary inputs for examples and domains
  const [newExample, setNewExample] = useState<string>('');
  const [newDomain, setNewDomain] = useState<string>('');

  // Handlers for adding/removing examples
  const addExample = () => {
    if (!newExample.trim()) {
      message.warning('Example cannot be empty.');
      return;
    }
    setExamples([...examples, newExample.trim()]);
    setNewExample('');
  };

  const removeExample = (index: number) => {
    setExamples(examples.filter((_, i) => i !== index));
  };

  // Handlers for adding/removing domains
  const addDomain = () => {
    if (!newDomain.trim()) {
      message.warning('Domain cannot be empty.');
      return;
    }
    setDomains([...domains, newDomain.trim()]);
    setNewDomain('');
  };

  const removeDomain = (index: number) => {
    setDomains(domains.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        // Save the examples and domains along with other form data
        onAddProfile({ ...values, examples, domains });
        form.resetFields();
        setExamples([]);
        setDomains([]);
        onClose();
      })
      .catch((err) => console.error('Validation failed:', err));
  };

  return (
    <Modal
      title={initialData ? 'Edit Profile' : 'Create New Profile'}
      visible={visible}
      onCancel={onClose}
      onOk={handleSave}
    >
      <Form
        form={form}
        initialValues={initialData || {}}
        layout="vertical"
      >
        <Form.Item
          label="Profile Name"
          name="name"
          rules={[{ required: true, message: 'Profile name is required.' }]}
        >
          <Input placeholder="Enter profile name" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Description is required.' }]}
        >
          <TextArea rows={3} placeholder="Enter profile description" />
        </Form.Item>

        {/* Examples Section */}
        <Title level={5}>Examples</Title>
        <Input
          value={newExample}
          onChange={(e) => setNewExample(e.target.value)}
          placeholder="Add a new example..."
          onPressEnter={addExample}
        />
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={addExample}
          style={{ margin: '10px 0' }}
          block
        >
          Add Example
        </Button>
        <List
          size="small"
          bordered
          dataSource={examples}
          renderItem={(example, index) => (
            <List.Item
              actions={[
                <Button
                  type="link"
                  icon={<DeleteOutlined />}
                  onClick={() => removeExample(index)}
                  danger
                />,
              ]}
            >
              {example}
            </List.Item>
          )}
        />

        {/* Domains Section */}
        <Title level={5} style={{ marginTop: '16px' }}>Domains</Title>
        <Input
          value={newDomain}
          onChange={(e) => setNewDomain(e.target.value)}
          placeholder="Add a new domain..."
          onPressEnter={addDomain}
        />
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={addDomain}
          style={{ margin: '10px 0' }}
          block
        >
          Add Domain
        </Button>
        <List
          size="small"
          bordered
          dataSource={domains}
          renderItem={(domain, index) => (
            <List.Item
              actions={[
                <Button
                  type="link"
                  icon={<DeleteOutlined />}
                  onClick={() => removeDomain(index)}
                  danger
                />,
              ]}
            >
              {domain}
            </List.Item>
          )}
        />
      </Form>
    </Modal>
  );
};

export default AddProfileModal;
