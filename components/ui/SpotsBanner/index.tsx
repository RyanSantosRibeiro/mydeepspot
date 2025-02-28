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

const filtersList = [
  'Mais Avaliados',
  'Mais Novos',
  'America do Sul',
  'America do Norte',
  'Europa',
  'Asia',
  'Oceania'
];

const SpotsBanner = ({spot}: {spot: SpotsInfoProps}) => {
  const [showGallery, setShowGallery] = useState(false);
  console.log({ rs1: spot });
  if(!spot) return null;
  return (
    <div className="bg-gray-100 flex flex-col overflow-hidden w-full">
      <div className="w-full">
        {/* Banner com imagens */}
        <section style={{backgroundImage: `url(${spot?.spots_images?.[0]?.src || bg})`}} className="bg-center bg-cover bg-no-repeat relative w-full h-[400px] bg-gray-200 flex items-center justify-center">
          <div className="absolute bottom-4 left-4 flex gap-2">
            {spot.spots_images
              ?.slice(0, 4)
              .map((img, index) => (
                <Image
                  key={index}
                  src={img.src}
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
              {spot.spots_images?.map((img, index) => (
                <Image
                  key={index}
                  src={img.src}
                  alt={`Imagem ${index + 1}`}
                  width={600}
                  height={600}
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

export default SpotsBanner;
