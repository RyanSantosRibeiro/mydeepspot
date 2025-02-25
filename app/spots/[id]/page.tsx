import { createClient } from '@/utils/supabase/server';
import {
  getProducts,
  getSubscription,
  getUser
} from '@/utils/supabase/queries';
import { diveSpots } from '@/assets/data';
import SpotsInfo from '@/components/ui/SpotsInfo';
import SpotsBanner from '@/components/ui/SpotsBanner';
import SpotsWheter from '@/components/ui/SpotsWether';
import SpotsMaps from '@/components/ui/SpotsMaps';
import SpotsWaveMaps from '@/components/ui/SpotsWaveMaps';

export interface SpotsInfoProps {
  id: number;
  mainImage?: string;
  lat: number;
  lng: number;
  name?: string;
  src?: string;
  images?: Array<{
    src: string
  }>;
  description?: string;
  location?: string;
  image?: string;
  depth?: number;
  duration?: number;
  difficulty?: string;
  equipment?: string;
  priceRange?: string;
  familyFriendly?: boolean;
  spotsPerDay?: number;
  maxGuests?: number;
  activities?: string;
  popular?: boolean;
  featured?: boolean;
  featuredImage?: string;
  diveCenter?: string;
  diveCenterId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  diveSpots?: number[];
  diveSpotsCount?: number;
  rating?: number;
  diveSpotsTotalRatings?: number;
  diveSpotsTotalReviews?: number;
  diveSpotsLastReview?: Date;
  comments?: Array<{
    user: string;
    comment: string;
    // createdAt: Date;
    // updatedAt: Date;
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
  }>;
}

export default async function Page({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = createClient();
  const [user, subscription] = await Promise.all([
    getUser(supabase),
    getSubscription(supabase)
  ]);
  const id = (await params).id;

  const spot: SpotsInfoProps = diveSpots.filter(
    (spot) => spot.id === parseInt(id)
  )[0];
  return (
    <div className="w-full flex flex-col bg-white">
      <SpotsBanner spot={spot} />
      <SpotsInfo spot={spot} />
      <SpotsWheter spot={spot} />
      {/* <SpotsMaps spot={spot} /> */}
      <SpotsWaveMaps spot={spot} />
    </div>
  );
}
