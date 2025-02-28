import { createClient } from '@/utils/supabase/server';
import {
  getProducts,
  getSpots,
  getSubscription,
  getUser
} from '@/utils/supabase/queries';
import Hero from '@/components/ui/Hero';
import SpotsCards from '@/components/ui/SpotsCards';

export default async function PricingPage() {
  const supabase = createClient();
  const spots = await getSpots(supabase, 14)
  return (
    <>
      <Hero />
      <SpotsCards spots={spots || []}/>
    </>
  );
}
