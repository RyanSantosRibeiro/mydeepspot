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
import { SpotsInfo } from '@/app/spots/[id]/page';

const SpotsInfo = (spot: SpotsInfo) => {
  console.log(spot);
    const [showGallery, setShowGallery] = useState(false);
  return (
    <div className="bg-gray-100 flex flex-col overflow-hidden w-full">
       {/* Informações do spot */}
       <section className="mt-8">
        <h1 className="text-3xl font-bold">{spot.name}</h1>
        <div className="flex items-center gap-4 mt-2">
          <span className="text-yellow-500 text-lg">⭐ {spot.rating}</span>
          <span className="text-gray-500">
            ({spot.comments?.length} reviews)
          </span>
        </div>
        <p className="text-gray-600 mt-4">
          Profundidade: {spot.depth}m | Tempo de Mergulho: {spot.duration} min
        </p>
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold">Condições Climáticas</h2>
          <p>Temperatura: {spot.weather?.temperature ?? 'N/A'}°C</p>
          <p>Velocidade do Vento: {spot.weather?.windSpeed ?? 'N/A'} km/h</p>
          <p>Visibilidade: {spot.weather?.visibility ?? 'N/A'}m</p>
        </div>
      </section>
    </div>
  );
};

export default SpotsInfo;
