'use client';

import { useState } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';

import bg from '../../../../assets/bg.jpg'

const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};

const mapOptions = {
  styles:[
    {
      "elementType": "geometry",
      "stylers": [{ "color": "#f5f5f5" }]
    },
    {
      "elementType": "labels.icon",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#616161" }]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#f5f5f5" }]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#bdbdbd" }]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [{ "color": "#eeeeee" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [{ "color": "#ffffff" }]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#9e9e9e" }]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{ "color": "#c9e4f1" }]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#4c9baf" }]
    }
  ],
  mapTypeControl: false,
  fullscreenControl: false,
};

const center = { lat: 0, lng: 0 }; // Brasília como centro padrão

export default function HomeMap() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState();
  const [autocomplete, setAutocomplete] = useState(null);

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const onLoad = (autoC) => setAutocomplete(autoC);

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        setLocation({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
    }
  };

  return (
    <div className="relative w-screen h-screen" style={{backgroundImage: `url(${bg.src})`, backgroundSize: 'cover'}}>

        {/* Overlay com busca e título */}
      <div className="z-30 absolute top-0 left-0 w-full h-full flex flex-col items-start justify-center px-16 bg-gradient-to-r from-black/40 to-transparent">
        <h1 className="text-white text-5xl font-bold">Your Dream Places...</h1>
        <h2 className="text-white text-6xl font-bold mt-2">EXPLORE</h2>
        <p className="text-white text-lg mt-4 w-1/2">
          Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.
        </p>

        {/* Botões */}
        <div className="mt-6 flex gap-4">
          <button className="bg-white text-black px-6 py-3 rounded-full font-semibold shadow-md">Discover</button>
          <button className="border border-white text-white px-6 py-3 rounded-full font-semibold">Know More</button>
        </div>

        {/* Barra de busca estilizada */}
        <div className="absolute top-10 right-10 bg-white/20 backdrop-blur-lg p-6 rounded-xl w-80 shadow-lg">
          <h3 className="text-white text-xl font-semibold mb-2">Login Here</h3>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 rounded-lg bg-white/90 text-black placeholder-gray-600 mb-2"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-white/90 text-black placeholder-gray-600 mb-4"
          />
          <button className="w-full bg-white text-black p-3 rounded-lg font-semibold">Log in</button>
          <p className="text-white text-sm mt-2 text-center">Not a member? <span className="underline cursor-pointer">Join now</span></p>
        </div>
      </div>

    </div>
  );
}
