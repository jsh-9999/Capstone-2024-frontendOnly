"use client";
import React, { useState } from "react";
import { GoogleMap, Marker, LoadScriptNext } from "@react-google-maps/api";

interface MapProps {
  location?: { lat: number; lng: number };
}

const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};

const center = {
  lat: 43.6532,
  lng: -79.3832,
};

const Map: React.FC<MapProps> = ({ location }) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const handleOnLoad = () => {
    setScriptLoaded(true);
  };

  return (
    <LoadScriptNext
      googleMapsApiKey="AIzaSyCQiNT9d6MQ7nAYDTyX899gAFGNQ2Ufnrw"
      onLoad={handleOnLoad}
    >
      {scriptLoaded ? (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={8}
          center={location || center}
        >
          {location && <Marker position={location} />}
        </GoogleMap>
      ) : <></>}
    </LoadScriptNext>
  );
};

export default Map;
