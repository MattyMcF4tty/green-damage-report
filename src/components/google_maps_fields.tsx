import react, { useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete from "use-places-autocomplete";

/* Google maps loader, returning two booleans that tells if the map has loaded succesfully or not. */
const loadGoogleMaps = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  return { isLoaded, loadError };
};

/* ----- Google maps wrapper ---------------------------------------------------- */
interface GoogleMapsFieldProps {
  type: "address" | "location";
  props: LocationFieldProps | AddressFieldProps;
}

export const GoogleMapsField = ({ type }: GoogleMapsFieldProps) => {
  const { isLoaded, loadError } = loadGoogleMaps();

  if (type === "location") {
    return LocationField;
  }
};

/* ----- Location Inputfield ---------------------------------------------------- */
interface LocationFieldProps {
  id: string;
  labelText: string;
  onMoveCoords: ({ lat, lng }: { lat: number; lng: number }) => void;
}

const LocationField = ({ id, labelText, onMoveCoords }: LocationFieldProps) => {
  const [markerCoords, setMarkerCoords] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 0, lng: 0 });

  /* TODO: Rewrite the way this gets the googleapikey. People on the client side can see it because we use
             NEXT_PUBLIC_
    */
  const { isLoaded, loadError } = loadGoogleMaps();

  useEffect(() => {
    onMoveCoords(markerCoords);
  }, [markerCoords]);

  if (loadError) {
    return (
      <div>
        <label htmlFor={id}>{labelText}</label>
        <p id={id}>Error loading Google maps</p>
      </div>
    );
  } else if (!isLoaded) {
    return (
      <div>
        <label htmlFor={id}>{labelText}</label>
        <p id={id}>Loading Google maps...</p>
      </div>
    );
  } else {
    return (
      <div className="w-full h-full mb-6">
        <label htmlFor={id}>{labelText}</label>
        <GoogleMap
          id={"map" + id}
          center={markerCoords}
          zoom={5}
          mapContainerStyle={{
            height: "100%",
            width: "100%",
          }}
          options={{
            fullscreenControl: false,
            zoomControl: false,
            streetViewControl: false,
          }}
        >
          <Marker
            position={markerCoords}
            draggable={true}
            onDragEnd={(event) =>
              setMarkerCoords({
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
              })
            }
          />
        </GoogleMap>
      </div>
    );
  }
};

interface AddressFieldProps {}
