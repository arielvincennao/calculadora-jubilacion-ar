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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header con botones */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Ver Cálculo
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {calculation.name}
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/mis-calculos"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Volver
              </Link>
              <Link
                href={`/mis-calculos/${calculation.id}/editar`}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Editar
              </Link>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Imprimir
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido del cálculo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 print-container">
          {/* Información del cálculo */}
          <div className="text-center border-b-2 border-gray-300 pb-4 mb-6">
            <h1 className="text-2xl font-bold text-black mb-3">
              {calculation.name}
            </h1>
            <div className="text-gray-700 space-y-1">
              <p className="text-lg">
                Período: {formatDate(calculation.start_date)} a {formatDate(calculation.end_date)}
              </p>
              <p className="text-base">
                Generado el: {formatDate(calculation.created_at)}
              </p>
            </div>
          </div>

          {/* Tabla de resultados */}
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Mes</th>
                  <th className="border border-gray-300 px-4 py-2 text-right font-semibold">COE</th>
                  <th className="border border-gray-300 px-4 py-2 text-right font-semibold">Sueldo</th>
                  <th className="border border-gray-300 px-4 py-2 text-right font-semibold">Resultado</th>
                </tr>
              </thead>
              <tbody>
                {calculation.months.map((month, index) => (
                  <tr key={month.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-300 px-4 py-2">
                      {month.month_name} {month.year}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      {month.coe.toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      {formatCurrency(month.salary)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right font-semibold">
                      {formatCurrency(month.result)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Resumen del cálculo */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Resumen del Cálculo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-600 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">UD</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {calculation.ud_value.toLocaleString()}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-600 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Sueldo Total</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(calculation.total_salary)}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-600 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Resultado Total</h3>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(calculation.total_result)}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-600 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Meses</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {calculation.total_months}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos para impresión */}
      <style jsx global>{`
        @media print {
          .print-container {
            padding: 20px !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .bg-gray-50, .bg-gray-100, .bg-white {
            background: white !important;
          }
          .text-gray-900, .text-gray-700, .text-gray-500 {
            color: black !important;
          }
          .border-gray-300 {
            border-color: #000 !important;
          }
        }
      `}</style>
    </div>
  );
}
