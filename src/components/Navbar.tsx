'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (isAuthPage) return null;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center group">
              {/* Bandera Argentina */}
              <div className="mr-3 flex-shrink-0 transform group-hover:scale-110 transition-transform duration-300">
                <svg width="32" height="24" viewBox="0 0 32 24" className="rounded-sm shadow-lg filter drop-shadow-md">
                  {/* Fondo blanco */}
                  <rect width="32" height="24" fill="#ffffff"/>
                  {/* Franja azul superior */}
                  <rect width="32" height="8" fill="#6f4c9b"/>
                  {/* Franja azul inferior */}
                  <rect y="16" width="32" height="8" fill="#6f4c9b"/>
                  {/* Sol */}
                  <g transform="translate(16, 12)">
                    <circle r="3" fill="#f4d03f"/>
                    <g fill="#f4d03f">
                      {/* Rayos del sol */}
                      <path d="M-4,0 L-6,0 M4,0 L6,0 M0,-4 L0,-6 M0,4 L0,6"/>
                      <path d="M-2.8,-2.8 L-4,-4 M2.8,-2.8 L4,-4 M-2.8,2.8 L-4,4 M2.8,2.8 L4,4"/>
                    </g>
                  </g>
                </svg>
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-blue-800 dark:group-hover:from-blue-300 dark:group-hover:to-blue-400 transition-all duration-300">
                Calculadora Jubilación
              </span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:items-center md:space-x-6">
              <a 
                href="#como-funciona" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-base font-medium transition-all duration-300 hover:scale-105 relative group internal-link nav-smooth"
              >
                Cómo funciona
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a 
                href="#ventajas" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-base font-medium transition-all duration-300 hover:scale-105 relative group internal-link nav-smooth"
              >
                Ventajas
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a 
                href="#informacion" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-base font-medium transition-all duration-300 hover:scale-105 relative group internal-link nav-smooth"
              >
                Información
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/auth/login"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2 text-base font-medium transition-all duration-300 hover:scale-105 relative group"
            >
              Iniciar sesión
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/auth/register"
              className="ml-4 inline-flex items-center px-6 py-2.5 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Registrarse
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menú principal</span>
              {/* Hamburger icon */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden transform transition-all duration-300 ease-in-out`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <a 
            href="#como-funciona" 
            onClick={closeMenu}
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 text-base font-medium transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg hover:scale-105 transform internal-link nav-smooth"
          >
            Cómo funciona
          </a>
          <a 
            href="#ventajas" 
            onClick={closeMenu}
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 text-base font-medium transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg hover:scale-105 transform internal-link nav-smooth"
          >
            Ventajas
          </a>
          <a 
            href="#informacion" 
            onClick={closeMenu}
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 text-base font-medium transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg hover:scale-105 transform internal-link nav-smooth"
          >
            Información
          </a>
          <div className="pt-4 pb-3 border-t border-gray-200/50 dark:border-gray-700/50">
            <Link 
              href="/auth/login"
              onClick={closeMenu}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 text-base font-medium transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg hover:scale-105 transform"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/auth/register"
              onClick={closeMenu}
              className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
