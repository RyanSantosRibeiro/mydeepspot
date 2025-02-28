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
  'Highest Rated',
  'Newest'
];

const SpotsCards = ({spots}:{spots: SpotsInfoProps[]}) => {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<string>('empty');

  const toggleFilter = (filter: string) => {
    console.log({spots})
    setActiveFilter(prev => (prev === filter ? 'empty' : filter));
  };

  const sortSpots = (spots: SpotsInfoProps[]) => {
    if (activeFilter === 'Highest Rated') {
      return [...spots].sort((a, b) => b.rating - a.rating);
    }
    if (activeFilter === 'Newest') {
      return [...spots].sort((a, b) => Number(b.id) - Number(a.id));
    }
    return spots;
  };

  const filterSpots = () => {
    return sortSpots(spots);
  };

  const handleSelect = (spot: any) => {
    router.push(`/spots/${spot.id}`);
  };

  return (
    <div id='resume-dives' className="bg-gray-100 flex flex-col overflow-hidden w-full pt-5">
      <div className="w-full px-6 mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 my-6">Popular Dive Spots</h2>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filtersList?.map(filter => (
            <p
              key={filter}
              onClick={() => toggleFilter(filter)}
              className={`cursor-pointer px-8 py-4 rounded-md text-sm font-medium shadow-md transition-all focus:border-none ${
                activeFilter === filter
                  ? 'bg-gradient-to-r from-blue-500 to-green-400 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter}
            </p>
          ))}
        </div>

        {/* Spot List */}
        <div className="grid grid-cols-1 md:grid-cols-3  lg:grid-cols-5 gap-8 mb-16">
          {filterSpots()?.map((spot: SpotsInfoProps) => (
            <div
              key={spot.id}
              onClick={() => handleSelect(spot)}
              className="cursor-pointer flex lg:flex-col bg-gray-50 shadow-lg rounded-xl overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02] min-h-max"
            >
              <div className="relative max-lg:w-[20%]">
                <Image
                  src={spot?.spots_images?.[0]?.src || bg.src}
                  alt={spot?.name || 'Image'}
                  className="object-cover w-full h-40"
                  width={480}
                  height={269}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>

              <div className="p-4 flex flex-col gap-2">
                <h2 className="text-base lg:text-lg font-bold text-gray-900 flex-1 lg:min-h-14">
                  {spot?.name}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500 text-lg whitespace-nowrap">⭐ {spot.rating}</span>
                  <span className="text-gray-500 text-sm whitespace-nowrap">
                    ({spot?.comments?.length} reviews)
                  </span>
                </div>
                <div className="text-gray-600 text-sm flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
                    Depth: {spot.depth}m
                  </span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                    Duration: {spot.duration} min
                  </span>
                </div>
                <button className="w-full mt-3 bg-gradient-to-r from-blue-500 to-green-400 text-white px-6 py-2 rounded-full font-semibold text-sm shadow-md hover:scale-105 transition-all">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpotsCards;
