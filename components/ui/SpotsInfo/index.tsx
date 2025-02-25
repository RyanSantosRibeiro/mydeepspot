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
import { SpotsInfoProps } from '@/app/spots/[id]/page';

const SpotsInfo = ({ spot }: { spot: SpotsInfoProps }) => {
  console.log({ rs1: spot });
  const [showGallery, setShowGallery] = useState(false);
  return (
    <section className="bg-white shadow-md p-6 lg:p-8">
      <h1 className="text-4xl font-bold text-gray-900">{spot?.name}</h1>

      <div className="flex items-center gap-4 mt-4">
        <span className="text-yellow-500 text-xl font-semibold flex items-center">
          ⭐ {spot.rating}
        </span>
        <span className="text-gray-600 text-lg">
          ({spot?.comments?.length} avaliações)
        </span>
      </div>

      <p className="text-gray-700 mt-4 text-lg">
        <strong className="text-gray-900">Profundidade:</strong> {spot.depth}m |
        <strong className="text-gray-900 ml-2">Tempo de Mergulho:</strong>{' '}
        {spot.duration} min
      </p>

    </section>
  );
};

export default SpotsInfo;
