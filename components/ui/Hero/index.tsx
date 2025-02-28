'use client';

import { LoadScript, Autocomplete } from '@react-google-maps/api';
import bg from '../../../assets/bg-2.jpg';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/icons/Logo';
import Button from '../Button';
import Input from '../Input';

export default function Hero() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const router = useRouter();
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [search, setSearch] = useState<google.maps.places.PlaceResult | null>(
    null
  );

  const submitButton = () => {
    if (!email) {
      setError('Please enter a valid email address');
      return;
    }
    window.location.replace(
      `https://buy.stripe.com/fZe4jr68v1SEdxK3cd?prefilled_email=${encodeURIComponent(email)}`
    );
  };

  const onLoad = (autoC: google.maps.places.Autocomplete) =>
    setAutocomplete(autoC);

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location?.lat();
        const lng = place.geometry.location?.lng();
        if (lat !== undefined && lng !== undefined) {
          router.push(`/search?lat=${lat}&lng=${lng}`);
          setSearch(place);
        }
      }
    }
  };

  const handleDiscover = () => {
    if (search && search.geometry) {
      const lat = search.geometry.location?.lat();
      const lng = search.geometry.location?.lng();
      if (lat !== undefined && lng !== undefined) {
        router.push(`/search?lat=${lat}&lng=${lng}`);
      }
    }
  };

  useEffect(() => {
    console.log(autocomplete);
  }, [autocomplete]);

  return (
    <div
      className="relative w-full min-h-full bg-cover bg-center h-[calc(80dvh-5rem)]"
      style={{ backgroundImage: `url(${bg.src})` }}
    >
      {/* Overlay com busca e título */}
      <div className="relative top-0 left-0 w-full min-h-full h-full flex flex-col items-start justify-center px-8 lg:px-16 bg-gradient-to-r from-black/40 to-transparent">
        <div className="container mx-auto flex flex-col md:flex-row gap-7 md:gap-16">
          <div className="flex flex-col w-full">
            <h1 className="text-white text-sm lg:text-5xl font-bold flex gap-2 items-center ">
              <Logo className="w-auto h-max" />
              My Deep Spot
            </h1>
            <h2 className="text-white text-3xl lg:text-9xl font-bold mt-2">
              EXPLORE THE SEA
            </h2>
            <p className="text-white text-lg mt-4 w-1/2">
              Discover the wonders beneath the waves. Dive into crystal-clear
              waters, explore vibrant coral reefs, and experience the magic of
              the ocean like never before.
            </p>
            {/* Botões */}
            <div className="mt-6 flex gap-4 max-lg:flex-col w-full md:w-auto">
              <div className="flex w-auto">
                <LoadScript
                  googleMapsApiKey={
                    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
                  }
                  libraries={['places']}
                >
                  <Autocomplete
                    onLoad={onLoad}
                    onPlaceChanged={onPlaceChanged}
                    className="w-auto"
                  >
                    <input
                      type="text"
                      placeholder="Search for a city..."
                      className="w-full lg:w-[400px] bg-white text-black px-6 py-3 rounded-full font-semibold shadow-md"
                    />
                  </Autocomplete>
                </LoadScript>
              </div>
              <button
                onClick={handleDiscover}
                className="bg-white text-black px-6 py-3 rounded-full font-semibold shadow-md"
              >
                Discover
              </button>
              {/* <a href='#resume-dives' className="border border-white text-white px-6 py-3 rounded-full font-semibold whitespace-nowrap">
            Know More
          </a> */}
            </div>
            {/* Barra de busca estilizada */}
            <div className="absolute top-20 right-10 bg-white/20 backdrop-blur-lg p-6 rounded-xl w-80 shadow-lg hidden">
              <h3 className="text-white text-xl font-semibold mb-2">
                Login Here
              </h3>
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
              <button className="w-full bg-white text-black p-3 rounded-lg font-semibold">
                Log in
              </button>
              <p className="text-white text-sm mt-2 text-center">
                Not a member?{' '}
                <span className="underline cursor-pointer">Join now</span>
              </p>
            </div>
          </div>
          <div className="p-6  rounded-2xl flex flex-col w-full md:max-w-[30%] bg-gray-50 shadow-sm h-max">
            {/* Ratings & Members Info */}
            <div className="text-center mb-10">
              <p className="text-yellow-500 text-lg font-bold">
                ⭐⭐⭐⭐⭐ 5.0 | our reviews
              </p>
              <p className="mt-2 text-gray-700">
                {/* 37,062 members + 282 joined this month */}
                Connect with professionals and beginners divers
              </p>
            </div>


            <p className="mt-2 mb-6 text-gray-700 w-full bg-gradient-to-r from-blue-500 to-green-400 p-[3px] rounded-lg font-semibold text-sm shadow-md flex justify-center items-center">
              <span className="bg-white w-full text-gray-700 text-base rounded-md flex justify-center items-center">
                Type your email and joined!
                {/* 37,062 members + 282 joined this month */}
              </span>
            </p>

            {/* Form Inputs */}
            <Input
              placeholder="Type your email..."
              className="mb-5"
              error={error}
              setEmail={setEmail}
            />

            {/* Join Button */}
            <Button onClick={submitButton} className="text-xl">
              Join to Divers →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
