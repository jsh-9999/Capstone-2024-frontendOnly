import { useEffect } from "react";

type GoogleMapProps = {
  onMapClick: (event: google.maps.MapMouseEvent) => void;
};

// Declare global initMap function
declare global {
  interface Window {
    initMap: () => void;
  }
}

const GoogleMap = ({ onMapClick }: GoogleMapProps) => {
  useEffect(() => {
    const handleScriptLoad = () => {
      if (window.google) {
        const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
          center: { lat: 33.450701, lng: 126.570667 },
          zoom: 8,
        });

        map.addListener("click", onMapClick);
      }
    };

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCQiNT9d6MQ7nAYDTyX899gAFGNQ2Ufnrw&callback=initMap`; // 여기에 자신의 API 키 사용
    script.async = true;
    script.defer = true;

    window.initMap = handleScriptLoad;

    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [onMapClick]);

  return <div id="map" style={{ width: '100%', height: '350px' }} />;
};

export default GoogleMap;
