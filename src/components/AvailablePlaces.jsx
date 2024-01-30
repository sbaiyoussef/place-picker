import { useEffect } from "react";
import Places from "./Places.jsx";
import { useState } from "react";
import Error from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";
import {fetchAvailablePlaces}  from "../http.js";


export default function AvailablePlaces({ onSelectPlace }) {
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState();
  useEffect(() => {
    setLoadingPlaces(true);
    async function fetchPlaces() {
      try {
         const places = await fetchAvailablePlaces()

        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
             places,
            position.coords.latitude,
            position.coords.longitude
          );
          setAvailablePlaces(sortedPlaces);
          setLoadingPlaces(false);
        });
      } catch (error) {
        setError({
          message:
            error.message || "Could not fetch places, please try again please",
        });
        setLoadingPlaces(false);
      }
     
    }

    fetchPlaces();
  }, []);

  if (error) {
    return <Error title=" An error occurred " message={error.message} />;
  }
  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={loadingPlaces}
      loadingText="Fetching places..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
