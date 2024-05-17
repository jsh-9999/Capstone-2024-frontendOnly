"use client";
import React, { useState, useEffect } from "react";
import Map from "@/components/Map";
import { useSearchParams } from "next/navigation";

interface Location {
  lat: number;
  lng: number;
}

const Home: React.FC = () => {
  const [location, setLocation] = useState<Location | undefined>();
  const searchParams = useSearchParams();

  useEffect(() => {
    const hospital = searchParams.get('hospital');
    if (hospital) {
      handleGeocode(hospital);
    }
  }, [searchParams]);

  const handleGeocode = async (hospitalName: string) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        hospitalName
      )}&key=AIzaSyCQiNT9d6MQ7nAYDTyX899gAFGNQ2Ufnrw`
    );
    const data = await response.json();
    if (data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      setLocation({ lat, lng });
    } else {
      console.error("No results found for the specified hospital.");
    }
  };

  return (
    <div>
      <Map location={location} />
    </div>
  );
};

export default Home;
