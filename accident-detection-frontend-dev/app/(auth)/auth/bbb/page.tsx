// pages/auth/bbb.tsx
import dynamic from 'next/dynamic';
import React from 'react';

const Home = dynamic(() => import('@/components/Home'), { ssr: false });

const BBBPage: React.FC = () => {
  return <Home />;
};

export default BBBPage;
