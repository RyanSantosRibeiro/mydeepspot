'use client';

import {
  Autocomplete,
  GoogleMap,
  LoadScript,
  Marker
} from '@react-google-maps/api';
import { diveSpots } from '../../../assets/data';
import anchorIcon from '../../../assets/anchor.png';
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
  mapTypeControl: false,
  fullscreenControl: false
};

const SpotsMapsComponent = ({ spot }: { spot: SpotsInfoProps }) => {
  const [visibleSpots, setVisibleSpots] = useState<SpotsInfoProps[]>([]);
  const [googleMaps, setGoogleMaps] = useState<any | null>(null);

  const onMapLoad = (map: google.maps.Map) => {
    setVisibleSpots(diveSpots);
    console.log('22222222222');
    // map.addListener('bounds_changed', () => {
    //   setVisibleSpots(getVisibleDiveSpots(map));
    // });
  };

  useEffect(() => {
   if(!googleMaps) {
    if (typeof window !== 'undefined' && window.google) {
      setGoogleMaps({
        scaledSize: new window.google.maps.Size(40, 40), // 🔹 Tamanho do ícone
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(20, 40) // 🔹 Ajusta o ponto de ancoragem
      });
    }
   }
  });

  const location = {
    lat: spot.lat,
    lng: spot.lng
  };

  return (
    <section className="py-8 w-full">
      <div className="px-8  mx-auto h-[400px] w-full mt-4 ">
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
              {visibleSpots && googleMaps &&
                visibleSpots?.map((spot, index) => (
                  <Marker
                    key={index}
                    position={{ lat: spot.lat, lng: spot.lng }}
                    icon={{
                      url: anchorIcon.src, // 🖼️ Caminho do seu ícone (pode ser uma URL externa)
                      scaledSize: googleMaps?.scaledSize, // 🔹 Tamanho do ícone
                      origin: googleMaps?.origin,
                      anchor: googleMaps?.anchor // 🔹 Ajusta o ponto de ancoragem
                    }}
                  />
                ))}
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
