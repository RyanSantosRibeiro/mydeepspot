'use client';

import { useState, useEffect, useMemo } from 'react';
import { WiDaySunny, WiCloud, WiRain, WiSnow, WiFog } from 'react-icons/wi';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { SpotsInfoProps } from '@/app/spots/[id]/page';
import PremiumModal from '../PremiumModal';

const API_KEY = '3dded86c5c9551231b319afe631a2088'; // Substitua pela sua chave de API de clima

const weatherIcons: Record<string, JSX.Element> = {
  Clear: <WiDaySunny className="text-yellow-500 text-8xl animate-pulse" />,
  Clouds: <WiCloud className="text-gray-400 text-8xl animate-bounce" />,
  Rain: <WiRain className="text-blue-500 text-8xl animate-wiggle" />,
  Snow: <WiSnow className="text-blue-300 text-8xl animate-spin" />,
  Fog: <WiFog className="text-gray-300 text-8xl animate-fade" />
};

const SpotsWeather = ({
  spot,
  subscription = false
}: {
  spot: SpotsInfoProps;
  subscription: boolean;
}) => {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    if (!spot.lat || !spot.lng) return;

    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${spot.lat}&lon=${spot.lng}&units=metric&lang=pt_br&appid=${API_KEY}`
        );
        const data = await res.json();
        setWeather(data);
      } catch (error) {
        console.error('Erro ao buscar clima:', error);
      }
    };

    fetchWeather();
  }, [spot.lat, spot.lng]);

  // 📅 Agrupa previsões pelo dia
  const groupedForecasts = useMemo(() => {
    return (pass: boolean) => {
      if (!weather) return {};

      if (pass) {
        return weather.list.reduce((acc: any, forecast: any) => {
          const dateKey = dayjs(forecast.dt_txt).format('dddd  DD/MM');
          acc[dateKey] = acc[dateKey] || [];
          acc[dateKey].push(forecast);
          return acc;
        }, {});
      }

      const todayKey = dayjs().format('dddd  DD/MM');

      return weather.list.reduce((acc: any, forecast: any) => {
        const dateKey = dayjs(forecast.dt_txt).format('dddd  DD/MM');
        if (dateKey === todayKey) {
          acc[dateKey] = acc[dateKey] || [];
          acc[dateKey].push(forecast);
        }
        return acc;
      }, {});
    };
  }, [weather]);

  return (
    <section className="bg-white p-8 lg:p-8">
      {/* <h1 className="text-4xl font-bold text-gray-900">{spot.name}</h1> */}

      {weather ? (
        <div className="w-full mt-6 flex flex-col gap-7">
          {/* Clima Atual - Estilizado */}
          <div className="flex-col w-full  h-fit bg-white bg-opacity-90 p-6 rounded-3xl shadow-xl backdrop-blur-lg border border-gray-200">
            {/* Cabeçalho */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              🌤️ Weather
            </h2>

            {/* Informações principais */}
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <p className="text-3xl font-semibold text-gray-800">
                  {weather.list[0].main.temp.toFixed(1)}°C
                </p>
                <p className="text-lg text-gray-600">
                  Sensação térmica: {weather.list[0].main.feels_like.toFixed(1)}
                  °C
                </p>
              </div>
              <div className="text-9xl">
                {weatherIcons[weather.list[0].weather[0].main] || '⛅'}
              </div>
            </div>

            {/* Linha divisória */}
            <hr className="my-4 border-gray-300" />

            {/* Detalhes adicionais */}
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <div className="flex items-center gap-2">
                💨 <span className="font-medium">Vento:</span>{' '}
                {weather.list[0].wind.speed.toFixed(1)} km/h
              </div>
              <div className="flex items-center gap-2">
                💧 <span className="font-medium">Humidade:</span>{' '}
                {weather.list[0].main.humidity}%
              </div>
              <div className="flex items-center gap-2">
                🌅 <span className="font-medium">Nascer do Sol:</span>{' '}
                {dayjs.unix(weather.city.sunrise).format('HH:mm')}
              </div>
              <div className="flex items-center gap-2">
                🌇 <span className="font-medium">Pôr do Sol:</span>{' '}
                {dayjs.unix(weather.city.sunset).format('HH:mm')}
              </div>
            </div>

            {/* Botão "Mais detalhes" */}
            {/* <div className="mt-6 text-center">
              <button className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-lg transition-all hover:bg-blue-700">
                Mais detalhes
              </button>
            </div> */}
          </div>

          {/* Previsão dos próximos dias - No Sub */}

          <div className="w-full mt-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Previsão para os próximos dias
            </h2>
            <div>
              {Object.entries(groupedForecasts(subscription)).map(
                ([date, forecasts]) => (
                  <div key={date} className="mt-4">
                    {/* 📅 Dia da Semana */}
                    <h3 className="text-gray-700 font-semibold text-lg mb-2">
                      {date}
                    </h3>

                    {/* 🔄 Linha de previsões */}
                    <div
                      className="flex gap-4 overflow-x-auto pb-4 snap-mandatory"
                      style={{ scrollSnapType: 'x mandatory' }}
                    >
                      {/*@ts-ignore */}
                      {forecasts.map((forecast: any, index: number) => (
                        <div
                          key={index}
                          className="flex flex-col items-center bg-white p-4 rounded-2xl shadow-md w-32 sm:w-40 md:w-48"
                        >
                          {/* ⏰ Hora */}
                          <span className="text-gray-600 font-semibold text-sm">
                            {dayjs(forecast.dt_txt).format('HH:mm')}
                          </span>

                          {/* 🌤️ Ícone do Clima */}
                          <div className="mt-2 text-4xl">
                            {weatherIcons[forecast.weather[0].main] || '⛅'}
                          </div>

                          {/* 🌡️ Temperatura */}
                          <span className="text-gray-900 font-bold text-xl">
                            {forecast.main.temp.toFixed(1)}°C
                          </span>
                          <span className="text-gray-500 text-sm">
                            Sensação: {forecast.main.feels_like.toFixed(1)}°C
                          </span>

                          {/* 💨 Vento */}
                          <span className="text-gray-600 text-sm flex items-center gap-1 mt-2">
                            💨 {forecast.wind.speed.toFixed(1)} km/h
                          </span>

                          {/* 💧 Umidade */}
                          <span className="text-gray-600 text-sm flex items-center gap-1">
                            💧 {forecast.main.humidity}%
                          </span>

                          {/* 🌧️ Chuva (se houver) */}
                          {forecast.rain?.['3h'] && (
                            <span className="text-blue-500 text-sm flex items-center gap-1">
                              🌧 {forecast.rain['3h']} mm
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
            {!subscription ? (
              <div className="w-full mt-6">
                <div className="flex relative items-center justify-center">
                  {/* 📅 Título do Dia Falso */}

                  {/* 🔄 Linha de previsões Falsas */}
                  <div
                    className="flex gap-4 overflow-x-auto pb-4 snap-mandatory blur-[3px]"
                    style={{ scrollSnapType: 'x mandatory' }}
                  >
                    {Array.from({ length: 7 }).map((_, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center bg-white p-4 rounded-2xl shadow-md w-32 sm:w-40 md:w-48"
                      >
                        {/* ⏰ Hora Falsa */}
                        <span className="text-gray-600 font-semibold text-sm">
                          --:--
                        </span>

                        {/* 🌤️ Ícone do Clima Falso */}
                        <div className="mt-2 text-4xl">⛅</div>

                        {/* 🌡️ Temperatura Falsa */}
                        <span className="text-gray-900 font-bold text-xl">
                          --°C
                        </span>
                        <span className="text-gray-500 text-sm">
                          Sensação: --°C
                        </span>

                        {/* 💨 Vento Falso */}
                        <span className="text-gray-600 text-sm flex items-center gap-1 mt-2">
                          💨 -- km/h
                        </span>

                        {/* 💧 Umidade Falsa */}
                        <span className="text-gray-600 text-sm flex items-center gap-1">
                          💧 --%
                        </span>

                        {/* 🌧️ Chuva Falsa */}
                        <span className="text-blue-500 text-sm flex items-center gap-1">
                          🌧 -- mm
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* 🎯 Botão para Assinar */}
                  <div className="mt-4 max-w-60 mx-auto text-center absolute w-full h-full items-center justify-center flex flex-col">
                    <p className="text-gray-700 text-lg font-semibold">
                      Assine agora para desbloquear todas as previsões!
                    </p>
                    <PremiumModal />
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
    </section>
  );
};

export default SpotsWeather;
