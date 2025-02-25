'use client';

import { Suspense, useEffect, useRef } from 'react';
import L from 'leaflet';
import anchor from '@/assets/anchor.png';
import { SpotsInfoProps } from '@/app/spots/[id]/page';
import { diveSpots } from '@/assets/data';

const WindyWaveMapComponent = ({ spot }: { spot: SpotsInfoProps }) => {
  const mapRef = useRef<L.Map | null>(null);
  const windyRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const { lat, lng } = spot;

  useEffect(() => {
    if (typeof window === 'undefined' || mapRef.current) return;

    const loadWindyAPI = async () => {
      // Evitar duplicação
      if (document.getElementById('windy-script')) return;

      // Carregar Windy API dinamicamente
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

        console.log({ rs11: 1, lat, lng });
        const options = {
          key: process.env.NEXT_PUBLIC_WINDY_API_KEY, // Sua chave Windy
          lat: lat, // Coordenadas iniciais
          lon: lng,
          zoom: 9,
          verbose: true
          // ecmwfWaves, gfsWaves, iconEuWaves, iconWaves
        };

        // Remover qualquer mapa anterior
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }

        // Inicializa Windy API
        // @ts-ignore
        window.windyInit(options, (windyAPI: any) => {
          windyRef.current = windyAPI;
          const { map, store } = windyAPI;
          mapRef.current = map;

          L.popup()
            .setLatLng([lat, lng])
            .setContent('Ondas em tempo real 🌊')
            .openOn(map);

          // 🏴 Criando um ícone personalizado
          const customIcon = L.icon({
            iconUrl: anchor.src, // 📌 Substitua pelo caminho da sua imagem
            iconSize: [50, 50],
            iconAnchor: [25, 50],
            popupAnchor: [0, -50]
          });

          // 📍 Lista de pontos no mapa

          // 🔁 Iterar sobre os pontos e adicionar no mapa
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

    // Carregar Leaflet.js dinamicamente (caso não esteja disponível globalmente)
    if (!window.L) {
      const leafletScript = document.createElement('script');
      leafletScript.src = 'https://unpkg.com/leaflet@1.4.0/dist/leaflet.js';
      leafletScript.async = true;
      document.body.appendChild(leafletScript);
      leafletScript.onload = loadWindyAPI;
    } else {
      loadWindyAPI();
    }
  }, []);

  return (
    <div className="mb-6 px-8 w-full h-[400px] ">
      <div
        ref={mapContainerRef}
        id="windy"
        className="w-full h-full rounded-lg shadow-md overflow-hidden"
      ></div>
    </div>
  );
};

export default function WindyWaveMap({ spot }: { spot: SpotsInfoProps }) {
  return (
    <Suspense>
      <WindyWaveMapComponent spot={spot} />
    </Suspense>
  );
}
