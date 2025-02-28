import { createClient } from '@/utils/supabase/server';
import {
  getProducts,
  getSpotById,
  getSubscription,
  getUser
} from '@/utils/supabase/queries';
import { diveSpots } from '@/assets/data';
import SpotsInfo from '@/components/ui/SpotsInfo';
import SpotsBanner from '@/components/ui/SpotsBanner';
import SpotsWeather from '@/components/ui/SpotsWeather';
import CommentsSection from '@/components/ui/SpotsComments';
import MarineWaveMap from '@/components/ui/SpotsWaveMaps';
import WindyWaveMap from '@/components/ui/SpotsWindMaps';

export interface SpotsInfoProps {
  id: number;
  lat: string;
  lng: string;
  name?: string;
  description?: string;
  depth?: number;
  duration?: number;
  difficulty?: string;
  equipment?: string;
  gas?: string;
  priceRange?: string;
  familyFriendly?: boolean;
  maxGuests?: number;
  createdAt?: Date;
  updatedAt?: Date;
  rating: number;
  comments?: Array<{
    user: string;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  spots_images?: Array<{
    src: string;
  }>;
}

// rating: number;
// images?: Array<{
//   src: string
// }>;
// replies?: Array<{
//   user: string;
//   comment: string;
//   createdAt: Date;
//   updatedAt: Date;
//   rating: number;
//   images?: Array<{
//     src: string
//   }>;
// }>;
// likes?: Array<{
//   user: string;
//   createdAt: Date;
//   updatedAt: Date;
// }>;
// dislikes?: Array<{
//   user: string;
//   createdAt: Date;
//   updatedAt: Date;
// }>;
// bookmarks?: Array<{
//   user: string;
//   createdAt: Date;
//   updatedAt: Date;
// }>;
// shares?: Array<{
//   user: string;
//   createdAt: Date;
//   updatedAt: Date;
// }>;
// recommendations?: Array<{
//   user: string;
//   createdAt: Date;
//   updatedAt: Date;
// }>;

export default async function Page({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = createClient();
  const user = await getUser(supabase);
  const id = parseInt((await params).id);

  const spot = await getSpotById(supabase, id)


  
  return (
    <div className="w-full flex flex-col bg-white">
      <SpotsBanner spot={spot} />
      <SpotsInfo spot={spot} />
      <SpotsWeather
        spot={spot}
        subscription={user?.subscription?.status == 'active' ? true : false}
      />
      <CommentsSection comments={spot?.comments || []}/>
      {/* <SpotsMaps spot={spot} /> */}
      <WindyWaveMap spot={spot} subscription={user?.subscription?.status == 'active' ? true : false} />
      <MarineWaveMap spot={spot} subscription={user?.subscription?.status == 'active' ? true : false} />
    </div>
  );
}
