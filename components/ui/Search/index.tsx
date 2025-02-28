'use client';

import {
  Autocomplete,
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker
} from '@react-google-maps/api';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import bg from '../../../assets/bg.jpg';
import anchorIcon from '@/assets/anchor.png';
import Image from 'next/image';
import { SpotsInfoProps } from '@/app/spots/[id]/page';

// Definição dos tipos
type Location = { lat: number; lng: number };

const mapContainerStyle = {
  width: '100vw',
  height: '100%'
};

const mapOptions: google.maps.MapOptions = {
  styles: [
    { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
    { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#c9e4f1' }]
    }
  ],
  mapTypeControl: false,
  fullscreenControl: false
};

const center: Location = { lat: 0, lng: 0 };

const libraries: 'places'[] = ['places'];

const PageComponent = ({ spots }: { spots: SpotsInfoProps[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentLat = searchParams.get('lat');
  const currentLng = searchParams.get('lng');
  const [hoveredSpotId, setHoveredSpotId] = useState<number | null>(null);

  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [location, setLocation] = useState<Location>({
    lat: parseFloat(currentLat || '0'),
    lng: parseFloat(currentLng || '0')
  });
  const [search, setSearch] = useState<google.maps.places.PlaceResult | null>(
    null
  );
  const [visibleSpots, setVisibleSpots] = useState<SpotsInfoProps[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<SpotsInfoProps | null>(null);

  const onLoad = (autoC: google.maps.places.Autocomplete) =>
    setAutocomplete(autoC);

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        setSearch(place);
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setLocation({ lat, lng });
        router.push(`/search?lat=${lat}&lng=${lng}`);
      }
    }
  };

  const handleDiscover = () => {
    if (search?.geometry?.location) {
      const lat = search.geometry.location.lat();
      const lng = search.geometry.location.lng();
      setLocation({ lat, lng });
      router.push(`/search?lat=${lat}&lng=${lng}`);
    }
  };

  const handleSelect = (spot: SpotsInfoProps) => {
    if (spot) {
      router.push(`/spots/${spot.id}`);
    }
  };

  const getVisibleDiveSpots = (
    map: google.maps.Map | null
  ): SpotsInfoProps[] => {
    if (!map) return [];
    const bounds = map.getBounds();
    return spots?.filter(
      (spot) =>
        bounds?.contains({
          lat: parseFloat(spot.lat),
          lng: parseFloat(spot.lng)
        }) ?? false
    );
  };

  const onMapLoad = (map: google.maps.Map) => {
    setVisibleSpots(getVisibleDiveSpots(map));
    map.addListener('bounds_changed', () => {
      setVisibleSpots(getVisibleDiveSpots(map));
    });
  };

  return (
    <div className="flex max-h-screen h-[calc(100vh-80px)] flex-col overflow-hidden">
      <div className="bg-gray-100 h-full">
        <LoadScript
          googleMapsApiKey={
            process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string
          }
          libraries={libraries}
        >
          <div className="relative w-full h-full flex flex-col md:flex-row">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={location || center}
              zoom={12}
              options={mapOptions}
              onLoad={onMapLoad}
            >
              {visibleSpots.map((spot, index) => (
                <Marker
                  key={index}
                  position={{
                    lat: parseFloat(spot.lat),
                    lng: parseFloat(spot.lng)
                  }}
                  onClick={() => {
                    handleSelect(spot);
                    // setLocation({
                    //   lat: parseFloat(spot.lat),
                    //   lng: parseFloat(spot.lng)
                    // });
                  }}
                  onMouseOver={() => setHoveredSpotId(spot.id)}
                  onMouseOut={() => setHoveredSpotId(null)}
                  icon={{
                    url: anchorIcon.src,
                    scaledSize: new window.google.maps.Size(40, 40),
                    origin: new window.google.maps.Point(0, 0),
                    anchor: new window.google.maps.Point(20, 40)
                  }}
                >
                  {/* 🔹 Exibe a InfoWindow ao passar o mouse */}
                  {hoveredSpotId === spot.id && (
                    <InfoWindow
                      position={{
                        lat: parseFloat(spot.lat),
                        lng: parseFloat(spot.lng)
                      }}
                    >
                      <div className=" text-gray-800 text-sm">
                        <div className="relative max-lg:w-[20%]">
                          <Image
                            src={spot?.spots_images?.[0]?.src || bg.src}
                            alt={spot.name || ''}
                            className="object-cover w-full h-40"
                            width={480}
                            height={269}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        </div>
                        <div className="p-2">
                          <strong>{spot.name}</strong>
                          <p className="text-yellow-500">⭐ {spot.rating}</p>
                        </div>
                      </div>
                    </InfoWindow>
                  )}
                </Marker>
              ))}
            </GoogleMap>

            {/* Sidebar */}
            <div className="w-full md:w-[20%] h-full max-md:max-h-[44vh] md:h-full flex flex-col  rounded-r-xl shadow-lg">
              <div className="bg-white p-4 flex gap-4 items-center w-full [&>div]:[width:100%] h-auto max-h-full">
                <Autocomplete
                  onLoad={onLoad}
                  onPlaceChanged={onPlaceChanged}
                  className="w-full"
                >
                  <input
                    type="text"
                    placeholder="Search for a city..."
                    className="w-full max-lg:max-w-[300px] bg-gray-100 text-gray-800 px-4 py-2 rounded-full font-medium shadow-inner focus:outline-none"
                  />
                </Autocomplete>
                <button
                  onClick={handleDiscover}
                  className="bg-gradient-to-r from-blue-500 to-green-400 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:scale-105 transition-all"
                >
                  Discover
                </button>
              </div>

              <div className="bg-white p-5  flex flex-col gap-4 w-full transition-all h-full">
                <div className="flex flex-col h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track- gap-2">
                  <>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Popular Dive Spots
                    </h2>
                    {visibleSpots?.length === 0 && (
                      <div className="text-base font-semibold text-gray-400 h-full flex items-center justify-center">
                        Dive not found!
                      </div>
                    )}
                    {visibleSpots?.map((spot, index) => (
                      <div
                        key={index}
                        onClick={() => handleSelect(spot)}
                        className="cursor-pointer flex lg:flex-col bg-gray-50 shadow-lg rounded-xl overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02] min-h-max"
                      >
                        {/* Imagem com overlay gradiente */}
                        <div className="relative max-lg:w-[35%]">
                          <Image
                            src={spot?.spots_images?.[0]?.src || bg.src}
                            alt={spot.name || ''}
                            className="object-cover w-full h-full md:max-h-40"
                            width={480}
                            height={269}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        </div>

                        {/* Conteúdo */}
                        <div className="p-4 flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <h2 className="text-base lg:text-md font-bold text-gray-900 flex-1">
                              {spot.name}
                            </h2>
                            <span className="text-yellow-500 text-base whitespace-nowrap">
                              ⭐ {spot?.rating}
                            </span>
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

                          {/* Botão estilizado */}
                          <button className="w-full mt-3 bg-gradient-to-r from-blue-500 to-green-400 text-white px-6 py-2 rounded-full font-semibold text-sm shadow-md hover:scale-105 transition-all">
                            Learn More
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                </div>
              </div>
            </div>
          </div>
        </LoadScript>
      </div>
    </div>
  );
};

export default function SearchPage({ spots }: { spots: SpotsInfoProps[] }) {
  return (
    <Suspense>
      <PageComponent spots={spots} />
    </Suspense>
  );
}
