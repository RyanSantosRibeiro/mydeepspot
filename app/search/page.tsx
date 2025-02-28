import { createClient } from '@/utils/supabase/server';
import {
  getAllSpots,
} from '@/utils/supabase/queries';
import SearchPage from '@/components/ui/Search';

export default async function PricingPage() {
  const supabase = createClient();
  const spots = await getAllSpots(supabase)
  return (
    <>
      <SearchPage spots={spots || []}/>
    </>
  );
}
