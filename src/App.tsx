// App.tsx
import { useState } from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import {
  EditOutlined,
  IdcardOutlined,
  InfoCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons';

import './App.css';
import TabProofreader from './components/TabProofreader';
import TabProfiles from './TabProfiles';
import TabSettings from './TabSettings';
import TabInfo from './TabInfo';

function App() {
  const [activeTabKey, setActiveTabKey] = useState<string>('1');

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Proofreader',
      children: <TabProofreader setActiveTabKey={setActiveTabKey} />,
      icon: <EditOutlined />,
    },
    {
      key: '2',
      label: 'Profiles',
      children: <TabProfiles />,
      icon: <IdcardOutlined />,
    },
    {
      key: '3',
      label: 'Settings',
      children: <TabSettings />,
      icon: <SettingOutlined />,
    },
    {
      key: '4',
      label: 'Info',
      children: <TabInfo />,
      icon: <InfoCircleOutlined />,
    },
  ];

  return (
    <Tabs
      activeKey={activeTabKey}
      onChange={setActiveTabKey}
      items={items}
      centered
    />
  );
}

export default App;
