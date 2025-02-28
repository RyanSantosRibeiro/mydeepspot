'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/Dialog';
import Button from '../Button';
import Input from '../Input';
import premiumBg from '@/assets/premium-bg.jpg';
import windy from '@/assets/windy.png';

const PremiumModal = ({hasOpen=false}:{hasOpen: boolean}) => {
  const [open, setOpen] = useState(hasOpen ? hasOpen : false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();

  const submitButton = () => {
    if (!email) {
      setError('Please enter a valid email address');
      return;
    }
    window.location.replace(
      `https://buy.stripe.com/test_6oEbL27xIbNY2Lm5kk?prefilled_email=${encodeURIComponent(email)}`
    );
  };

  return (
    <>
      {/* Trigger Button */}
      {!hasOpen && <Button onClick={() => setOpen(true)} className="">
        Join to Divers Community
      </Button>}

      {/* Modal */}
      <Dialog  isOpen={open} onClose={() => setOpen(false)}>
        <DialogContent className="max-w-[50vw] flex">
          <div className="w-1/2 flex flex-col px-12 py-16">
            <DialogHeader>
              <DialogTitle className="text-center text-lg font-bold">
                Join Premium
              </DialogTitle>
            </DialogHeader>

            {/* Ratings & Members Info */}
            <div className="text-center mb-10">
              <p className="text-yellow-500 text-lg font-bold">
                ⭐⭐⭐⭐⭐ 5.0 | our reviews
              </p>
              <p className="mt-2 text-gray-700">
                {/* 37,062 members + 282 joined this month */}
                news members, every day
              </p>
            </div>

            {/* Ratings & Members Info */}
            <div className="flex flex-col justify-start items-start">
              <p className="text-gray-700 text-xl font-bold">
                Upgrade to get premium:
              </p>
              <p className="text-lg px-2 mt-2 text-gray-700">
                Access exclusive content, exclusive deals, and more.
              </p>
              <p className="text-lg px-2 mt-2 text-gray-700">
                Premium Spot Details
              </p>
              <p className="text-lg px-2 mt-2 text-gray-700">
                Two weeks prevision of the wheather
              </p>
              <p className="text-lg px-2 mt-2 text-gray-700">
                Wind Map - <b>by Windy</b>
              </p>
            </div>

            {/* Featured Image */}
            <div className="w-full max-h-32 bg-gray-300 rounded-lg my-4 flex items-center justify-center overflow-hidden">
              <img className="w-full h-auto" src={windy.src} />
            </div>

            <p className="mt-2 mb-6 text-gray-700 w-full bg-gradient-to-r from-blue-500 to-green-400 p-[3px] rounded-lg font-semibold text-sm shadow-md flex justify-center items-center">
              <span className="bg-white w-full text-gray-700 text-base rounded-md flex justify-center items-center">
                Help us joined the community
                {/* 37,062 members + 282 joined this month */}
              </span>
            </p>

            {/* Form Inputs */}
            <Input
              placeholder="Type your email..."
              className="mb-5"
              error={error}
              setEmail={setEmail}
            />

            {/* Join Button */}
            <Button onClick={submitButton} className="text-xl">
            Join to Divers →
            </Button>
          </div>
          <div
            className="w-1/2 flex h-auto bg-center bg-cover"
            style={{ backgroundImage: `url(${premiumBg.src})` }}
          ></div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PremiumModal;
