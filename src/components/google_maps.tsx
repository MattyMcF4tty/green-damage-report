import React, { useState, useEffect } from "react";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";

/* Google map component */
interface MapProps {
  id: string;
  setLocation: ({ lat, lng }: { lat: number; lng: number }) => void;
  markers?: google.maps.MarkerOptions[];
  tapForMarker?: boolean;
  maxMarkers: number;
}

export function Map(props: MapProps) {
  const { id, markers, setLocation, tapForMarker, maxMarkers } = props;

  const [startLocation, setStartLocation] = useState({
    lat: 48.8684,
    lng: 2.2945,
  });
  const [localMarkers, setLocalMarkers] = useState(markers || []);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (tapForMarker) {
      if (maxMarkers === undefined || localMarkers.length < maxMarkers) {
        const newMarker = {
          position: {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          },
        };
        setLocalMarkers([...localMarkers, newMarker]); // Add newMarker to localMarkers
        setLocation(newMarker.position); // Update parent component's state
      }
    }
  };

  /* Getting user location from browser and setting it as start position */
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        setStartLocation({ lat: latitude, lng: longitude });
      });
    }
  }, []);

  /* Checks if google map is loaded */
  if (!isLoaded) {
    return (
      <div className="w-full items-center">
        <p>Loading Google maps...</p>
      </div>
    );
  }

  /* Google map version where you tap to create a marker */
  if (isLoaded && tapForMarker) {
    return (
      <GoogleMap
        id={id}
        mapContainerStyle={{ width: "100%", height: "50vh" }}
        center={startLocation}
        zoom={15}
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
        onClick={handleMapClick}
      >
        {localMarkers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            draggable={true}
            {...marker}
          />
        ))}
      </GoogleMap>
    );
  }
  return null;
}
