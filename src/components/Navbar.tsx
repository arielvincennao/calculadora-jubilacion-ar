'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth');

  if (isAuthPage) return null;

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                Calculadora Jubilación
              </span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:items-center md:space-x-6">
              <a 
                href="#como-funciona" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-base font-medium transition-colors"
              >
                Cómo funciona
              </a>
              <a 
                href="#ventajas" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-base font-medium transition-colors"
              >
                Ventajas
              </a>
              <a 
                href="#informacion" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-base font-medium transition-colors"
              >
                Información
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/auth/login"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2 text-base font-medium transition-colors"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/auth/register"
              className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
