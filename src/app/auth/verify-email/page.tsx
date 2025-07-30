'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function VerifyEmailPage() {
  const [message, setMessage] = useState('Verificando tu correo electrónico...');
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (data.session?.user) {
          const { data: userData, error: userError } = await supabase.auth.getUser();
          
          if (userError) throw userError;
          
          if (userData.user?.email_confirmed_at) {
            setMessage('¡Correo verificado con éxito!');
            setIsVerified(true);
          } else {
            setMessage('Por favor revisa tu correo electrónico y haz clic en el enlace de verificación.');
          }
        }
      } catch (error) {
        setMessage('Hubo un error al verificar tu correo. Por favor, intenta nuevamente.');
        console.error('Error verifying email:', error);
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              {isVerified ? '¡Correo Verificado!' : 'Verificación de Correo'}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {message}
            </p>
          </div>
          
          {isVerified ? (
            <div className="mt-6">
              <Link
                href="/dashboard"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Ir al Dashboard
              </Link>
            </div>
          ) : (
            <div className="mt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ¿No has recibido el correo?{' '}
                <button
                  onClick={async () => {
                    try {
                      const supabase = createClient();
                      const { error } = await supabase.auth.resend({
                        type: 'signup',
                        email: '', // This will use the current user's email
                      });
                      
                      if (error) throw error;
                      
                      setMessage('¡Correo de verificación reenviado! Por favor revisa tu bandeja de entrada.');
                    } catch (error) {
                      setMessage('Error al reenviar el correo. Por favor, intenta iniciar sesión nuevamente.');
                      console.error('Error resending verification email:', error);
                    }
                  }}
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Reenviar correo de verificación
                </button>
              </p>
              <div className="mt-4">
                <Link
                  href="/auth/login"
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Volver al inicio de sesión
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
