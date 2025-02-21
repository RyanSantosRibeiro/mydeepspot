'use client';

import { Autocomplete, GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation'; 
import { diveSpots } from "../data";
import bg from '../../../assets/bg.jpg'
import Image from "next/image";
import Header from "../components/Header";

const mapContainerStyle = {
  width: '100vw',
  height: '100%',
};

const mapOptions = {
  styles: [
    { "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] },
    { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#c9e4f1" }] }
  ],
  mapTypeControl: false,
  fullscreenControl: false,
};

const center = { lat: 0, lng: 0 };

const libraries = ["places"];

export default function Page() {
  const router = useRouter(); 
  const searchParams = useSearchParams();
  const currentLat = searchParams.get('lat');
  const currentLng = searchParams.get('lng');

  const [autocomplete, setAutocomplete] = useState(null);
  const [location, setLocation] = useState({ lat: parseFloat(currentLat || '0'), lng: parseFloat(currentLng || '0') });
  const [search, setSearch] = useState(null);
  const [visibleSpots, setVisibleSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);

  const onLoad = (autoC) => setAutocomplete(autoC);

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        setSearch(place);
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setLocation({ lat, lng });
        router.push(`/search?lat=${lat}&lng=${lng}`);
      }
    }
  };

  const handleDiscover = () => {
    if (search?.geometry) {
      const lat = search.geometry.location.lat();
      const lng = search.geometry.location.lng();
      setLocation({ lat, lng });
      router.push(`/search?lat=${lat}&lng=${lng}`);
    }
  };

  const handleSelect = (spot) => {
    if (spot) {
      setSelectedSpot(spot);
      setLocation({ lat: spot.lat, lng: spot.lng });
    }
  };

  const getVisibleDiveSpots = (map) => {
    if (!map) return [];
    const bounds = map?.getBounds();
    return diveSpots.filter(spot =>
      bounds?.contains({ lat: spot.lat, lng: spot.lng })
    );
  };

  const onMapLoad = (map) => {
    setVisibleSpots(getVisibleDiveSpots(map));
    map.addListener("bounds_changed", () => {
      setVisibleSpots(getVisibleDiveSpots(map));
    });
  };

  return (
    <div className="flex max-h-screen h-screen flex-col overflow-hidden">
      <Header />
      <div className="bg-gray-100 h-full">
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} libraries={libraries}>
          <div className="relative w-full h-full">
            <GoogleMap 
              mapContainerStyle={mapContainerStyle} 
              center={location || center} 
              zoom={12} 
              options={mapOptions} 
              onLoad={onMapLoad}
            >
              {visibleSpots.map((spot, index) => (
                <Marker key={index} position={{ lat: spot.lat, lng: spot.lng }} />
              ))}
            </GoogleMap>

            <div className="absolute top-4 left-4 bg-white p-4 rounded-xl shadow-lg flex gap-4 w-auto items-center">
              <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <input 
                  type="text" 
                  placeholder="Search for a city..." 
                  className="w-[300px] bg-gray-100 text-gray-800 px-4 py-2 rounded-full font-medium shadow-inner focus:outline-none"
                />
              </Autocomplete>
              <button 
                onClick={handleDiscover} 
                className="bg-gradient-to-r from-blue-500 to-green-400 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:scale-105 transition-all"
              >
                Discover
              </button>
            </div>

            <div className="absolute top-4 right-4 bg-white p-5 rounded-xl shadow-2xl flex flex-col gap-4 w-[25%] h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent transition-all">
              {selectedSpot ? (
                <div>
                  <button onClick={() => setSelectedSpot(null)} className="text-blue-500 mb-4">← Back to List</button>
                  <div className="relative rounded-xl overflow-hidden mb-4">
                  <Image 
                    src={selectedSpot.src || bg.src} 
                    alt={selectedSpot.name} 
                    className="object-cover w-full h-40"
                    width={480} 
                    height={269} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                  <h2 className="text-xl font-semibold text-gray-800">{selectedSpot.name}</h2>
                  <p className="text-gray-600">Depth: {selectedSpot.depth}m | Duration: {selectedSpot.duration} min</p>
                  <h3 className="text-lg font-semibold text-gray-800 mt-4">Weather Conditions</h3>
                  <p className="text-gray-600 text-sm">Temperature: {selectedSpot?.weather?.temperature}°C</p>
                  <p className="text-gray-600 text-sm">Wind Speed: {selectedSpot?.weather?.windSpeed} km/h</p>
                  <p className="text-gray-600 text-sm">Visibility: {selectedSpot?.weather?.visibility}m</p>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mt-4">Sea Conditions</h3>
                  <p className="text-gray-600 text-sm">Water Temperature: {selectedSpot?.sea?.temperature}°C</p>
                  <p className="text-gray-600 text-sm">Current Strength: {selectedSpot?.sea?.currentStrength}</p>
                  <p className="text-gray-600 text-sm">Wave Height: {selectedSpot?.sea?.waveHeight}m</p>
                  <div className="mt-4">
                    <h3 className="font-semibold">Comments:</h3>
                    {selectedSpot.comments.map((comment, index) => (
                      <div key={index} className="mt-2 p-2 bg-gray-100 rounded-lg">
                        <p className="font-medium">{comment.user}</p>
                        <p className="text-sm text-gray-600">{comment.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-gray-800">Popular Dive Spots</h2>
                  {visibleSpots.length === 0 && <div className="text-base  font-semibold text-gray-400 h-full flex items-center justify-center">Dive not found!</div>}
                  {visibleSpots.map((spot, index) => (
                    <div 
                      key={index} 
                      onClick={() => handleSelect(spot)} 
                      className="cursor-pointer flex flex-col bg-gray-50 shadow-lg rounded-xl overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02] min-h-fit"
                    >
                      {/* Imagem com overlay gradiente */}
                <div className="relative">
                  <Image 
                    src={spot.src || bg.src} 
                    alt={spot.name} 
                    className="object-cover w-full h-40"
                    width={480} 
                    height={269} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
  
                {/* Conteúdo */}
                <div className="p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-900 flex-1">{spot.name}</h2>
                    <span className="text-yellow-500 text-lg whitespace-nowrap">⭐ {spot.rating}</span>
                    <span className="text-gray-500 text-sm whitespace-nowrap">({spot.comments.length} reviews)</span>
                  </div>
  
                  <div className="text-gray-600 text-sm flex flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">Depth: {spot.depth}m</span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">Duration: {spot.duration} min</span>
                  </div>
  
                  {/* Botão estilizado */}
                  <button className="w-full mt-3 bg-gradient-to-r from-blue-500 to-green-400 text-white px-6 py-2 rounded-full font-semibold text-sm shadow-md hover:scale-105 transition-all">
                    Learn More
                  </button>
                </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </LoadScript>
      </div>
    </div>
  );
}
