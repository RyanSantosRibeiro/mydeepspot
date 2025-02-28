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
import SpotsMaps from '../SpotsMaps';

const SpotsInfo = ({ spot }: { spot: SpotsInfoProps }) => {
  if(!spot) return null;
  return (
    <section className="container bg-white  rounded-2xl p-6 lg:p-8 space-y-6 flex flex-row">
      <div className="flex flex-col justify-start items-start w-full">
        {/* 📌 Spot Name */}
        <h1 className="text-4xl font-bold text-gray-900">{spot?.name}</h1>

        {/* 🌟 Rating & Reviews */}
        <div className="flex items-center gap-4">
          <span className="text-yellow-500 text-xl font-semibold flex items-center">
            ⭐ {spot?.rating}
          </span>
          <span className="text-gray-600 text-lg">
            ({spot?.comments?.length || 0} reviews)
          </span>
        </div>

        {/* 📍 Location */}
        {/* <div className="text-gray-700 text-lg flex items-center gap-2">
📍 <span>Arraial do Cabo, Brazil</span>
</div> */}

        {/* 📝 Description */}
        <p className="text-gray-700 leading-relaxed">{spot?.description}</p>

        {/* 📊 Detailed Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3 text-gray-700">
            🏊‍♂️{' '}
            <span>
              <strong>Depth:</strong> {spot?.depth}m
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            ⏳{' '}
            <span>
              <strong>Dive Time:</strong> {spot?.duration} min
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            🎯{' '}
            <span>
              <strong>Difficulty:</strong> {spot.difficulty}
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            🎒{' '}
            <span>
              <strong>Equipment:</strong> {spot.equipment}
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            👨‍👩‍👧{' '}
            <span>
              <strong>Family-Friendly:</strong>{' '}
              {spot.familyFriendly ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-start items-center w-full md:max-w-[40%]">
        <SpotsMaps spot={spot} />
      </div>
    </section>
  );
};

export default SpotsInfo;
