'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import OpenStreetMap component with SSR disabled
const OpenStreetMap = dynamic(() => import('../../components/OpenStreetMap/ostm'), {
  ssr: false,
});

const Index: React.FC = () => {
  const [markers, setMarkers] = useState<{ username: string; latitude: number; longitude: number }[]>([]);

  return (
    <>
      <h1 className="text-center">OpenStreetMap</h1>
      <OpenStreetMap />
    </>
  );
};

export default Index;
