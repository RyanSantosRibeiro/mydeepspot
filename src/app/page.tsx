import Header from "./components/Header";
import Hero from "./components/Hero";
import Pricing from '@/components/ui/Pricing/Pricing';
import { createClient } from '@/utils/supabase/server';
import {
  getProducts,
  getSubscription,
  getUser
} from '@/utils/supabase/queries';

export default function Home() {
  const supabase = createClient();
  const [user, products, subscription] = await Promise.all([
    getUser(supabase),
    getProducts(supabase),
    getSubscription(supabase)
  ]);

  return (
    <div className="flex items-center justify-items-center min-h-screen">
      <Header transparent={true} />
      <Hero />
      <Pricing
      user={user}
      products={products ?? []}
      subscription={subscription}
    />
    </div>
  );
}
