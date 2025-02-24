'use client';

import Button from '@/components/ui/Button';
import LogoCloud from '@/components/ui/LogoCloud';
import type { Tables } from '@/types_db';
import { getStripe } from '@/utils/stripe/client';
import { checkoutWithStripe } from '@/utils/stripe/server';
import { getErrorRedirect } from '@/utils/helpers';
import { User } from '@supabase/supabase-js';
import cn from 'classnames';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

type Subscription = Tables<'subscriptions'>;
type Product = Tables<'products'>;
type Price = Tables<'prices'>;
interface ProductWithPrices extends Product {
  prices: Price[];
}
interface PriceWithProduct extends Price {
  products: Product | null;
}
interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

interface Props {
  user: User | null | undefined;
  products: ProductWithPrices[];
  subscription: SubscriptionWithProduct | null;
}

type BillingInterval = 'lifetime' | 'year' | 'month';

export default function Pricing({ user, products, subscription }: Props) {
  const intervals = Array.from(
    new Set(
      products.flatMap((product) =>
        product?.prices?.map((price) => price?.interval)
      )
    )
  );
  const router = useRouter();
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>('month');
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const currentPath = usePathname();

  const handleStripeCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);
    if (!user) {
      setPriceIdLoading(undefined);
      return router.push('/signin/signup');
    }
    const { errorRedirect, sessionId } = await checkoutWithStripe(
      price,
      currentPath
    );
    if (errorRedirect) {
      setPriceIdLoading(undefined);
      return router.push(errorRedirect);
    }
    if (!sessionId) {
      setPriceIdLoading(undefined);
      return router.push(
        getErrorRedirect(
          currentPath,
          'An unknown error occurred.',
          'Please try again later or contact a system administrator.'
        )
      );
    }
    const stripe = await getStripe();
    stripe?.redirectToCheckout({ sessionId });
    setPriceIdLoading(undefined);
  };

  if (!products.length) {
    return (
      <section className="bg-[#021B2C] text-white py-16">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold">No Plans Available</h1>
          <p className="mt-4 text-lg text-gray-300">
            Create plans in your
            <a
              className="text-cyan-400 underline ml-1"
              href="https://dashboard.stripe.com/products"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stripe Dashboard
            </a>
            .
          </p>
        </div>
        <LogoCloud />
      </section>
    );
  } else {
    return (
      <section className="bg-[#021B2C] text-white py-16">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold text-cyan-400">
            Explore the Depths
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Choose the right plan for your underwater adventures.
          </p>
          <div className="mt-8 inline-flex space-x-4">
            {intervals.includes('month') && (
              <button
                onClick={() => setBillingInterval('month')}
                className={`px-6 py-2 rounded-full border ${
                  billingInterval === 'month'
                    ? 'bg-cyan-500 text-white'
                    : 'text-gray-400 border-gray-600'
                } transition duration-300 hover:bg-cyan-600`}
              >
                Monthly
              </button>
            )}
            {intervals.includes('year') && (
              <button
                onClick={() => setBillingInterval('year')}
                className={`px-6 py-2 rounded-full border ${
                  billingInterval === 'year'
                    ? 'bg-cyan-500 text-white'
                    : 'text-gray-400 border-gray-600'
                } transition duration-300 hover:bg-cyan-600`}
              >
                Yearly
              </button>
            )}
          </div>
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-6">
          {products.map((product) => {
            const price = product?.prices?.find(
              (price) => price.interval === billingInterval
            );
            if (!price) return null;
            const priceString = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: price.currency!,
              minimumFractionDigits: 0
            }).format((price?.unit_amount || 0) / 100);
            return (
              <div
                key={product.id}
                className="bg-[#042A3F] border border-cyan-500 p-6 rounded-lg shadow-lg w-80 text-center"
              >
                <h2 className="text-2xl font-bold text-cyan-300">
                  {product.name}
                </h2>
                <p className="mt-2 text-gray-300">{product.description}</p>
                <p className="mt-8">
                  <span className="text-5xl font-extrabold white">
                    {priceString}
                  </span>
                  <span className="text-base font-medium text-zinc-100">
                    /{billingInterval}
                  </span>
                </p>
                <Button
                  variant="slim"
                  type="button"
                  loading={priceIdLoading === price.id}
                  onClick={() => handleStripeCheckout(price)}
                  className="block w-full py-2 mt-8 text-lg font-bold text-center text-white rounded-md hover:bg-gray-400"
                >
                  {subscription ? 'Manage' : 'Subscribe'}
                </Button>
              </div>
            );
          })}
        </div>
        <LogoCloud />
      </section>
    );
  }
}
