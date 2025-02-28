'use client';

import { Suspense, useEffect, useRef } from 'react';
import L from 'leaflet';
import anchor from '@/assets/anchor.png';
import { SpotsInfoProps } from '@/app/spots/[id]/page';
import { diveSpots } from '@/assets/data';
import windyImage from '@/assets/windy.png';
import PremiumModal from '../PremiumModal';

const WindyWaveMapComponent = ({
  spot,
  subscription
}: {
  spot: SpotsInfoProps;
  subscription: boolean;
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const windyRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const { lat, lng } = spot;

  useEffect(() => {
    // 🛑 Impedir execução no SSR
    if (typeof window === 'undefined') return;

    const { lat, lng } = spot;

    if (mapRef.current) return;

    const loadWindyAPI = async () => {
      if (document.getElementById('windy-script')) return;

      const windyScript = document.createElement('script');
      windyScript.id = 'windy-script';
      windyScript.src = 'https://api.windy.com/assets/map-forecast/libBoot.js';
      windyScript.async = true;
      document.body.appendChild(windyScript);

      windyScript.onload = () => {
        // @ts-ignore
        if (!window?.windyInit) {
          console.error('Windy API não carregou corretamente.');
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_WINDY_API_KEY,
          lat,
          lon: lng,
          zoom: 9,
          verbose: true
        };

        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }

        // @ts-ignore
        window.windyInit(options, (windyAPI) => {
          windyRef.current = windyAPI;
          const { map } = windyAPI;
          mapRef.current = map;

          L.popup()
            .setLatLng([parseFloat(lat), parseFloat(lng)])
            .setContent('Ondas em tempo real 🌊')
            .openOn(map);

          const customIcon = L.icon({
            iconUrl: '/icon.png',
            iconSize: [50, 50],
            iconAnchor: [25, 50],
            popupAnchor: [0, -50]
          });

          diveSpots.forEach((spot) => {
            L.marker([spot.lat, spot.lng], { icon: customIcon }).addTo(map)
              .bindPopup(`
                <div className="flex items-center gap-4 mt-4">
                <b className="text-4xl font-bold text-gray-900">${spot.name}</b><br>
        <span className="text-yellow-500 text-xl font-semibold flex items-center">
          ⭐ ${spot.rating}
        </span>
        <span className="text-gray-600 text-lg">
          (${spot?.comments?.length} avaliações)
        </span>
      </div>
                `);
          });
        });
      };
    };

    if (!window.L) {
      const leafletScript = document.createElement('script');
      leafletScript.src = 'https://unpkg.com/leaflet@1.4.0/dist/leaflet.js';
      leafletScript.async = true;
      document.body.appendChild(leafletScript);
      leafletScript.onload = loadWindyAPI;
    } else {
      loadWindyAPI();
    }
  }, [spot, diveSpots]);

  return (
    <div className="container mb-6 px-8 w-full ">
      <h2 className="text-2xl font-semibold text-gray-900 mb-5">Windy Map</h2>

      {subscription ? (
        <div
          ref={mapContainerRef}
          id="windy"
          className="w-full h-[400px] rounded-lg shadow-md overflow-hidden"
        ></div>
      ) : (
        <div className="relative w-full h-[400px] rounded-lg shadow-md overflow-hidden flex items-center justify-center">
          <img src={windyImage.src} className="w-full h-auto blur-[2px]" />
          <div className="absolute w-full h-full flex items-center justify-center">
            <div className="w-60 max-w-full mx-auto">
              <PremiumModal />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function WindyWaveMap({
  spot,
  subscription
}: {
  spot: SpotsInfoProps;
  subscription: boolean;
}) {
  return (
    <Suspense>
      <WindyWaveMapComponent spot={spot} subscription={subscription} />
    </Suspense>
  );
}
