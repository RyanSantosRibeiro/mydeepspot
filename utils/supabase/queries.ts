import { SupabaseClient } from '@supabase/supabase-js';
import { cache } from 'react';

export const getUser = cache(async (supabase: SupabaseClient) => {
  // 🔥 Obtém o usuário autenticado
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Erro ao obter usuário:', userError);
    return null;
  }

  // 🔥 Obtém a assinatura do usuário autenticado
  const { data: subscription, error: subscriptionError } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .eq('user_id', user.id) // 🎯 Filtra pela ID do usuário autenticado
    .maybeSingle();

  if (subscriptionError) {
    console.error('Erro ao obter assinatura:', subscriptionError);
  }

  return {
    user,
    subscription // 🔥 Retorna a assinatura junto com o usuário
  };
});

export const getSubscription = cache(async (supabase: SupabaseClient) => {
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .maybeSingle();

  return subscription;
});

export const getProducts = cache(async (supabase: SupabaseClient) => {
  const { data: products, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { referencedTable: 'prices' });

  return products;
});

export const getUserDetails = cache(async (supabase: SupabaseClient) => {
  const { data: userDetails } = await supabase
    .from('users')
    .select('*')
    .single();
  return userDetails;
});

export const getSpots = cache(async (supabase: SupabaseClient, quantity: number) => {
  const { data: spots, error } = await supabase.from('spots').select(
    `
  *, 
  spots_images:spots_images(*) 
`
  ).range(0, quantity);
  return spots;
});
export const getAllSpots = cache(async (supabase: SupabaseClient) => {
  const { data: spots, error } = await supabase.from('spots').select(
    `
  *, 
  spots_images:spots_images(*) 
`
  );
  return spots;
});

export const getSpotById = cache(
  async (supabase: SupabaseClient, id: number) => {
    const { data: spot, error } = await supabase
      .from('spots')
      .select(
        `
      *, 
      spots_images:spots_images(*) 
    `
      ) // Relacionando com a tabela 'images'
      .eq('id', id);

    if (error) {
      console.error('Error fetching spot:', error);
      return null;
    }

    return spot?.[0]; // Retorna o primeiro resultado (já que IDs são únicos)
  }
);
