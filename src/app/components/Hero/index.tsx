'use client';

import { LoadScript, Autocomplete } from '@react-google-maps/api';
import bg from '../../../../assets/bg.jpg';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 

export default function Hero() {
    const router = useRouter();
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [search, setSearch] = useState<google.maps.places.PlaceResult | null>(null);
      
    const onLoad = (autoC: google.maps.places.Autocomplete) => setAutocomplete(autoC);

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
        <div className="flex items-center justify-items-center min-h-screen">
            <div className="relative w-screen h-screen" style={{ backgroundImage: `url(${bg.src})`, backgroundSize: 'cover' }}>
                {/* Overlay com busca e título */}
                <div className="absolute top-0 left-0 w-full h-full flex flex-col items-start justify-center px-16 bg-gradient-to-r from-black/40 to-transparent">
                    <h1 className="text-white text-5xl font-bold">Our deep spot...</h1>
                    <h2 className="text-white text-9xl font-bold mt-2">EXPLORE THE SEA</h2>
                    <p className="text-white text-lg mt-4 w-1/2">
                        Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.
                    </p>
                    {/* Botões */}
                    <div className="mt-6 flex gap-4">
                        <div className="flex">
                            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!} libraries={["places"]}>
                                <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                                    <input
                                        type="text"
                                        placeholder="Search for a city..."
                                        className="w-[400px] bg-white text-black px-6 py-3 rounded-full font-semibold shadow-md"
                                    />
                                </Autocomplete>
                            </LoadScript>
                        </div>
                        <button onClick={handleDiscover} className="bg-white text-black px-6 py-3 rounded-full font-semibold shadow-md">Discover</button>
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
        </div>
    );
}
