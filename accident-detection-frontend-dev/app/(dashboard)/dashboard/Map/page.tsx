"use client";
import React, { useState } from 'react';
import Map from '@/components/Map';

interface Location {
  lat: number;
  lng: number;
}


const Home: React.FC = () => {
  const [location, setLocation] = useState<Location | undefined>();

  const handleGeocode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const hospitalName = (event.currentTarget.elements.namedItem('hospitalName') as HTMLInputElement).value;
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(hospitalName)}&key=AIzaSyCQiNT9d6MQ7nAYDTyX899gAFGNQ2Ufnrw`);
    const data = await response.json();
    const { lat, lng } = data.results[0].geometry.location;
    setLocation({ lat, lng });
  };

  return (
    <div>
      <form onSubmit={handleGeocode}>
        <input id="hospitalName" name="hospitalName" type="text" required />
        <button type="submit">Locate Hospital</button>
      </form>
      <Map location={location} />
    </div>
  );
};

export default Home;
