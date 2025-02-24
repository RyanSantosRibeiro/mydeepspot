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

const SpotsComments = (spot) => {
  return (
    <section className="mt-8">
      <h2 className="text-2xl font-semibold">Comentários</h2>
      {user ? (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <textarea
            className="w-full p-2 border rounded-md"
            placeholder="Deixe seu comentário..."
          ></textarea>
          <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md">
            Enviar
          </button>
        </div>
      ) : (
        <p className="text-gray-500">Faça login para comentar.</p>
      )}
      <div className="mt-4">
        {spot.comments?.map((comment, index) => (
          <div key={index} className="border-b py-2">
            <p className="font-semibold">{comment.user}</p>
            <p className="text-gray-600">{comment.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SpotsComments;
