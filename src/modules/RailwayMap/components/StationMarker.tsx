import React from 'react';
import { IRailwayMapStation } from '@interfaces/railway_map_interfaces';

interface StationMarkerProps {
  station: IRailwayMapStation;
}

const StationMarker: React.FC<StationMarkerProps> = ({ station }) => {
  return (
    <div className="station-marker">
      <div className="station-codes">
        {station.codes.map((code, index) => (
          <span key={index} className="station-code">{code}</span>
        ))}
      </div>
      <div className="station-name">{station.name}</div>
    </div>
  );
};

export default StationMarker;
