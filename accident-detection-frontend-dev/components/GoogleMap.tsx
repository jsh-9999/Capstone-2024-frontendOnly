import { useEffect } from "react";

const GoogleMap = ({ onMapClick }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCQiNT9d6MQ7nAYDTyX899gAFGNQ2Ufnrw`;
    script.async = true;
    script.defer = true;
    window.initMap = () => {
      const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 33.450701, lng: 126.570667 },
        zoom: 8,
      });

      map.addListener("click", onMapClick);
    };
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [onMapClick]);

  return null;
};

export default GoogleMap;