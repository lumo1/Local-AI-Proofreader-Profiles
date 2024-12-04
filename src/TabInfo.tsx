// TabInfo.tsx
import React from 'react';
import { Typography, Image, Divider, Space, Result } from 'antd';
import logoLumo from './assets/logo.lumo.png';

const { Paragraph, Link } = Typography;

const styles = {
  logo: { marginBottom: '16px' },
  space: { width: '100%' },
  list: { listStyleType: 'none', padding: 0, margin: 0 },
};

const links = [
  { id: 'support', label: 'Support', href: 'https://lumo.atlassian.net/wiki' },
  { id: 'documentation', label: 'Documentation', href: 'https://lumo.atlassian.net/wiki' },
];

const TabInfo: React.FC = () => {
  return (
    <Result
      icon={
        <Image
          width={200}
          src={logoLumo}
          preview={false}
          style={styles.logo}
          alt="Lumo Logo"
        />
      }
      title="Thank You!"
      subTitle="for checking out this tab! 😊"
      extra={
        <Space direction="vertical" size="large" style={styles.space}>
          <Paragraph>
            Need help or more info?
            <br />
            Here are some useful links:
          </Paragraph>
          <ul style={styles.list}>
            {links.map(({ id, label, href }) => (
              <li key={id}>
                <Link href={href} target="_blank" rel="noopener noreferrer">
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <Divider orientation="left">Connect with Me</Divider>
          <Paragraph>
            If you want to see my other projects, follow me on{' '}
            <Link
              href="https://www.linkedin.com/in/modzelewski-lukasz/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Łukasz Modzelewski
            </Link>
            .
          </Paragraph>

        </Space>
      }
    />
  );
};

export default TabInfo;
