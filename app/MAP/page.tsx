

import dynamic from 'next/dynamic';

const OpenStreetMap = dynamic(() => import('../../components/OpenStreetMap/ostm'), {
 
});

const Index: React.FC = () => {
  return (
    <>
      <div id="map-container">
        <OpenStreetMap />
      </div>
    </>
  );
};

export default Index;

