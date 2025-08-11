'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { CalculationService } from '@/lib/supabase/calculations';
import { CalculationWithMonths } from '@/types/calculation';

export default function VerCalculoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, loading: authLoading } = useAuth();
  const { loading: profileLoading } = useProfile();
  const router = useRouter();
  const [calculation, setCalculation] = useState<CalculationWithMonths | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const loadCalculation = async () => {
      try {
        setLoading(true);
        const data = await CalculationService.getCalculationById(id);
        if (!data) {
          setError('Cálculo no encontrado');
          return;
        }
        setCalculation(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el cálculo');
        console.error('Error loading calculation:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCalculation();
  }, [id, user, router]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handlePrint = () => {
    setIsPrinting(true);
    
    // Esperar un momento para que el DOM se actualice
    setTimeout(() => {
      window.print();
      
      // Restaurar la vista después de imprimir
      setTimeout(() => {
        setIsPrinting(false);
      }, 1000);
    }, 100);
  };

  if (authLoading || profileLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Cargando cálculo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong>
            <p className="mt-2">{error}</p>
          </div>
          <Link
            href="/mis-calculos"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver a Mis Cálculos
          </Link>
        </div>
      </div>
    );
  }

  if (!calculation) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">Cálculo no encontrado</p>
          <Link
            href="/mis-calculos"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Volver a Mis Cálculos
          </Link>
        </div>
      </div>
    );
  }

  // Calcular el promedio de resultados
  const averageResult = calculation.total_result / calculation.total_months;

  return (
    <>
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .print-container {
            padding: 20px !important;
            margin: 0 !important;
          }
        }
        @media screen {
          .print-only {
            display: none !important;
          }
        }
      `}</style>
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8 ${isPrinting ? 'print-container' : ''}`}>
        <div className="max-w-7xl mx-auto">
          {/* Información de Impresión */}
          {isPrinting && (
            <div className="print-only mb-8">
              <div className="text-center border-b-2 border-gray-300 pb-4 mb-6">
                <h1 className="text-2xl font-bold text-black mb-3">
                  {calculation.name}
                </h1>
                <div className="text-gray-700 space-y-1">
                  <p className="text-lg">
                    Período: {formatDate(calculation.start_date)} a {formatDate(calculation.end_date)}
                  </p>
                  <p className="text-base">
                    Valor UD: {calculation.ud_value}
                  </p>
                  <p className="text-base">
                    Generado el: {formatDate(calculation.created_at)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 ${isPrinting ? 'no-print' : ''}`}>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Ver Cálculo
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link
                href="/mis-calculos"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center"
              >
                Volver
              </Link>
              <Link
                href={`/mis-calculos/${calculation.id}/editar`}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-center"
              >
                Editar
              </Link>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Imprimir
              </button>
            </div>
          </div>

          {/* Información del Cálculo */}
          <div className={`bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 sm:p-6 ${isPrinting ? 'no-print' : ''}`}>
            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-4">
              Información del Cálculo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-blue-700 dark:text-blue-300">
              <div>
                <span>Nombre: </span>
                <span className="font-medium">{calculation.name}</span>
              </div>
              <div>
                <span>Valor UD: </span>
                <span className="font-medium">{calculation.ud_value} UD</span>
              </div>
              <div>
                <span>Período: </span>
                <span className="font-medium">
                  {formatDate(calculation.start_date)} - {formatDate(calculation.end_date)}
                </span>
              </div>
            </div>
          </div>
          <br />
          {/* Panel de Resumen */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 sm:p-6">
            <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-6">
              Resumen del Cálculo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Sueldo Total</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(calculation.total_salary)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Resultado Total</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(calculation.total_result)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Promedio Mensual</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(averageResult)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Meses</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{calculation.total_months}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <br />
          {/* Tabla de Resultados Detallados */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Detalle Mensual
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Resultados calculados para cada mes del período
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Mes
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      COE
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Sueldo
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Resultado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {calculation.months.map((month) => (
                    <tr key={month.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {month.month_name}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {month.coe}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {formatCurrency(month.salary)}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(month.result)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
