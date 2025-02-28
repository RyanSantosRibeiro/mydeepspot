'use client';

import {
  Autocomplete,
  GoogleMap,
  GoogleMarkerClusterer,
  LoadScript,
  Marker
} from '@react-google-maps/api';
import anchorIcon from '@/assets/anchor.png';
import { SpotsInfoProps } from '@/app/spots/[id]/page';
import { Suspense, useEffect, useState } from 'react';

// Definição dos tipos
type Location = { lat: number; lng: number };

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const center: Location = { lat: 0, lng: 0 };

const libraries: 'places'[] = ['places'];

const mapOptions: google.maps.MapOptions = {
  styles: [
    { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
    { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#c9e4f1' }]
    }
  ],
  gestureHandling: "greedy",
  mapTypeControl: false,
  fullscreenControl: false
};

const SpotsMapsComponent = ({ spot }: { spot: SpotsInfoProps }) => {
  // const [visibleSpots, setVisibleSpots] = useState<SpotsInfoProps[]>([]);
  const [googleMaps, setGoogleMaps] = useState<any | null>(null);

  const onMapLoad = (map: google.maps.Map) => {
    if (!googleMaps) {
      if (window?.google && typeof window !== 'undefined') {
        console.log({window})
        setGoogleMaps({
          scaledSize: new window.google.maps.Size(40, 40), // 🔹 Tamanho do ícone
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(20, 40) // 🔹 Ajusta o ponto de ancoragem
        });
      }
    }
    // map.addListener('bounds_changed', () => {
    //   setVisibleSpots(getVisibleDiveSpots(map));
    // });
  };


  const location: Location = {
    lat: parseFloat(spot.lat),
    lng: parseFloat(spot.lng)
  };


  return (
    <section className="w-full">
      <div className="mx-auto w-full h-[400px]">
        <LoadScript
          googleMapsApiKey={
            process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string
          }
          libraries={libraries}
        >
          <div className="relative rounded-lg w-full h-full overflow-hidden shadow-md">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={location || center}
              zoom={10}
              options={mapOptions}
              onLoad={onMapLoad}
            >
              <Marker
                position={location}
                icon={{
                  url: anchorIcon.src, // 🖼️ Caminho do seu ícone (pode ser uma URL externa)
                  scaledSize: googleMaps?.scaledSize, // 🔹 Tamanho do ícone
                  origin: googleMaps?.origin,
                  anchor: googleMaps?.anchor // 🔹 Ajusta o ponto de ancoragem
                }}
              />
            </GoogleMap>
          </div>
        </LoadScript>
      </div>
    </section>
  );
};

export default function SpotsMaps({ spot }: { spot: SpotsInfoProps }) {
  return (
    <Suspense>
      <SpotsMapsComponent spot={spot} />
    </Suspense>
  );
}
