'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SignOut } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import Logo from '@/components/icons/Logo';
import { usePathname, useRouter } from 'next/navigation';
import { getRedirectMethod } from '@/utils/auth-helpers/settings';
import { Menu, X } from 'lucide-react'; // Ícones para menu mobile
import PremiumModal from '../PremiumModal';

interface NavlinksProps {
  user?: any;
}

export default function Navlinks({ user }: NavlinksProps) {
  const router = getRedirectMethod() === 'client' ? useRouter() : null;
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="relative flex flex-row justify-between py-4 md:py-6 items-center">
      {/* Logo e navegação */}
      <div className="flex items-center flex-1">
        <Link href="/" aria-label="Logo" className='flex gap-1 items-center justify-center'>
          <Logo className="filter grayscale"/>
          <p className='flex items-center'>Home</p>
        </Link>
        <nav className="ml-6 lg:block hidden">
          <PremiumModal />
        </nav>
      </div>

      {/* Menu Desktop / Mobile */}
      <div className="flex justify-end space-x-6">
        {user ? (
          <>
            {/* Desktop: Dropdown */}
            <div className="hidden md:block relative">
              <button 
                onClick={toggleDropdown} 
                className="text-white focus:outline-none hover:underline"
              >
                Hi, {user?.user_metadata?.full_name || "Diver"}
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden">
                  <Link href="/favoritos" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    ⭐ Favorite
                  </Link>
                  <Link href="/account" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    👤 My account
                  </Link>
                  <Link href="https://billing.stripe.com/p/login/9AQ5l0fQm3Jl6HK000" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    👤 My Payments
                  </Link>
                  <form onSubmit={(e) => handleRequest(e, SignOut, router)}>
                    <input type="hidden" name="pathName" value={pathname} />
                    <button 
                      type="submit" 
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      🚪 Logout
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Mobile: Botão de menu lateral */}
            <button 
              className="block md:hidden text-gray-700 hover:text-gray-900"
              onClick={toggleSidebar}
            >
              <Menu size={24} />
            </button>
          </>
        ) : (
          <Link href="/signin" className="text-gray-700 hover:text-gray-900">
            Sign In
          </Link>
        )}
      </div>

      {/* Sidebar Mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed top-0 right-0 w-64 bg-white h-full shadow-lg p-6 flex flex-col">
            <button 
              className="mb-4 self-end text-gray-700 hover:text-gray-900"
              onClick={toggleSidebar}
            >
              <X size={24} />
            </button>
            <Link href="/favoritos" className="block text-gray-700 py-2 hover:bg-gray-100 rounded">
              Favoritos
            </Link>
            <Link href="/minha-conta" className="block text-gray-700 py-2 hover:bg-gray-100 rounded">
              Minha Conta
            </Link>
            <form onSubmit={(e) => handleRequest(e, SignOut, router)}>
              <input type="hidden" name="pathName" value={pathname} />
              <button 
                type="submit" 
                className="w-full text-left text-red-600 py-2 hover:bg-gray-100 rounded"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
