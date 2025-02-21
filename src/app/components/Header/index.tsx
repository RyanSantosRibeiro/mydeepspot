import Image from "next/image";
import Link from "next/link";

export default function Header({ transparent = false }) {
  return (
    <header
      className={`py-4 px-6 flex items-center justify-between w-full top-0 left-0 z-50 transition-all ${
        transparent
          ? "bg-transparent text-white fixed top-0"
          : "bg-white shadow-md text-gray-700"
      }`}
    >
      {/* Logo */}
      <Link href="/">
        <Image
          src="/logo.png"
          alt="Logo"
          width={120}
          height={40}
          className="cursor-pointer"
        />
      </Link>

      {/* Navegação */}
      <nav
        className={`hidden md:flex gap-6 font-medium w-full justify-start transition-all ${
          transparent ? "text-white" : "text-gray-700"
        }`}
      >
        <Link href="/" className="hover:text-blue-500">Home</Link>
        <Link href="/favorites" className="hover:text-blue-500">Favoritos</Link>
      </nav>

      {/* Botão de Login */}
      <button
        className="bg-gradient-to-r from-blue-500 to-green-400 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:scale-105 transition-all"
      >
        Login
      </button>
    </header>
  );
}
