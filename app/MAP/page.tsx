

import dynamic from 'next/dynamic';

const OpenStreetMap = dynamic(() => import('../../components/OpenStreetMap/ostm'), {
 
});

const Index: React.FC = () => {
  return (
    <>
      <h1 className="text-center">OpenStreetMap</h1>
      <div id="map-container">
        <OpenStreetMap />
      </div>
    </>
  );
};

export default Index;

