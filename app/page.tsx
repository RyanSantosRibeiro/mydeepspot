import { createClient } from '@/utils/supabase/server';
import {
  getProducts,
  getSubscription,
  getUser
} from '@/utils/supabase/queries';
import Hero from '@/components/ui/Hero';
import SpotsCards from '@/components/ui/SpotsCards';

export default async function PricingPage() {
  const supabase = createClient();
  const [user, products, subscription] = await Promise.all([
    getUser(supabase),
    getProducts(supabase),
    getSubscription(supabase)
  ]);
  return (
    <>
      <Hero />
      <SpotsCards />
    </>
  );
}
