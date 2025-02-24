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

const SpotsCards = (spot) => {
    const [showGallery, setShowGallery] = useState(false);
  return (
    <div className="bg-gray-100 flex flex-col overflow-hidden w-full">
      <div className="w-full px-6 mx-auto">
        {/* Banner com imagens */}
        <section className="relative w-full h-[400px] bg-gray-200 flex items-center justify-center">
          <Image
            src={spot.mainImage || '/placeholder.jpg'}
            alt={spot.name}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
          <div className="absolute bottom-4 left-4 flex gap-2">
            {spot.images
              ?.slice(0, 4)
              .map((img, index) => (
                <Image
                  key={index}
                  src={img}
                  alt={`Imagem ${index + 1}`}
                  width={100}
                  height={100}
                  className="cursor-pointer rounded-lg shadow-md"
                  onClick={() => setShowGallery(true)}
                />
              ))}
          </div>
        </section>

        {/* Popup de galeria */}
        {showGallery && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={() => setShowGallery(false)}
          >
            <div className="grid grid-cols-3 gap-4 p-8 bg-white rounded-lg">
              {spot.images?.map((img, index) => (
                <Image
                  key={index}
                  src={img}
                  alt={`Imagem ${index + 1}`}
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpotsCards;
