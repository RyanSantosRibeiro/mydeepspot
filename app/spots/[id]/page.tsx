import { createClient } from '@/utils/supabase/server';
import {
  getProducts,
  getSubscription,
  getUser
} from '@/utils/supabase/queries';
import { diveSpots } from '@/assets/data';
import SpotsInfo from '@/components/ui/SpotsInfo';

export interface SpotsInfo {
    id: number;
    name: string;
    description: string;
    location: string;
    image: string;
    depth: number;
    difficulty: string;
    equipment: string;
    priceRange: string;
    familyFriendly: boolean;
    spotsPerDay: number;
    maxGuests: number;
    activities: string;
    popular: boolean;
    featured: boolean;
    featuredImage: string;
    diveCenter: string;
    diveCenterId: number;
    createdAt: Date;
    updatedAt: Date;
    diveSpots: number[];
    diveSpotsCount: number;
    rating: number;
    diveSpotsTotalRatings: number;
    diveSpotsTotalReviews: number;
    diveSpotsLastReview: Date;
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

  const spot = diveSpots.filter((spot) => spot.id === parseInt(id));

  return (
    <div className='w-full flex flex-col'>
        <SpotsInfo spot={spot} />
    </div>
  );
}
