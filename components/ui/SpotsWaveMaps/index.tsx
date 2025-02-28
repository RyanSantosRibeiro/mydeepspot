'use client';

import { useEffect, useState } from 'react';
import { fetchWeatherApi } from 'openmeteo';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import PremiumModal from '../PremiumModal';
import marineImage from '@/assets/windy.png';

const MarineWaveChart = ({
  spot,
  subscription
}: {
  spot: any;
  subscription: boolean;
}) => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { lat, lng } = spot;

  useEffect(() => {
    const fetchMarineData = async () => {
      try {
        const params = {
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
          current: ['wave_height', 'wave_direction', 'wave_period'],
          hourly: ['wave_height', 'wave_direction', 'wave_period'],
          daily: ['wave_height_max', 'wave_direction_dominant']
        };
        const url = 'https://marine-api.open-meteo.com/v1/marine';

        const responses = await fetchWeatherApi(url, params);
        const response = responses[0];
        const utcOffsetSeconds = response.utcOffsetSeconds();
        const hourly = response.hourly();
        const daily = response.daily();

        if (!hourly?.variables(0)) return null;

        const range = (start: number, stop: number, step: number) =>
          Array.from(
            { length: (stop - start) / step },
            (_, i) => start + i * step
          );

        const processedData = {
          hourly: {
            time: range(
              Number(hourly.time()),
              Number(hourly.timeEnd()),
              hourly.interval()
            ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
            waveHeight: hourly?.variables(0)?.valuesArray(),
            waveDirection: hourly?.variables(1)?.valuesArray(),
            wavePeriod: hourly?.variables(2)?.valuesArray()
          }
        };

        setWeatherData(processedData);
      } catch (error) {
        console.error('Error fetching marine data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarineData();
  }, [lat, lng]);

  return (
    <div className="container mb-6 px-8 w-full">
      <h2 className="text-2xl font-semibold text-gray-900 mb-5">
        Marine Conditions
      </h2>

      {subscription ? (
        loading ? (
          <p className="text-gray-600">Loading marine data...</p>
        ) : weatherData ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={weatherData.hourly.time.map((time: any, index: number) => ({
                time: time.toISOString().split('T')[1].slice(0, 5),
                waveHeight: weatherData.hourly.waveHeight[index].toFixed(2)
              }))}
            >
              <XAxis dataKey="time" />
              <YAxis
                label={{
                  value: 'Wave Height (m)',
                  angle: -90,
                  position: 'insideLeft'
                }}
              />
              <Tooltip />
              <Line type="monotone" dataKey="waveHeight" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-red-500">Failed to load marine data.</p>
        )
      ) : (
        <div className="relative w-full h-[400px] rounded-lg shadow-md overflow-hidden flex items-center justify-center">
          <img src={marineImage.src} className="w-full h-auto blur-[2px]" />
          <div className="absolute w-full h-full flex items-center justify-center">
            <PremiumModal />
          </div>
        </div>
      )}
    </div>
  );
};

export default MarineWaveChart;
