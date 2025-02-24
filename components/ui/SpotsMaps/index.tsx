'use client';

import {
  Autocomplete,
  GoogleMap,
  LoadScript,
  Marker
} from '@react-google-maps/api';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { diveSpots } from '../../../assets/data';
import bg from '../../../assets/bg.jpg';
import Image from 'next/image';

const filtersList = [
  'Mais Avaliados',
  'Mais Novos',
  'America do Sul',
  'America do Norte',
  'Europa',
  'Asia',
  'Oceania'
];

const SpotsMaps = (spots) => {
  return (
    <section className="mt-8">
      <h2 className="text-2xl font-semibold">Localização: {spots.name}</h2>
      <div className="h-[300px] w-full mt-4 rounded-lg overflow-hidden">
        {/* <GoogleMap
          googleMapsApiKey={
            process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string
          }
          defaultCenter={{ lat: spot.lat, lng: spot.lng }}
          defaultZoom={10}
        >
          <div lat={spot.lat} lng={spot.lng} className="text-red-500 text-xl">
            📍
          </div>
        </GoogleMap> */}
      </div>
    </section>
  );
};

export default SpotsMaps;
