'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { CalculationService } from '@/lib/supabase/calculations';
import { CalculationWithMonths } from '@/types/calculation';

interface MonthData {
  id: string;
  year: number;
  month: number;
  month_name: string;
  days: number;
  coe: number;
  salary: number;
  result: number;
}

export default function EditarCalculoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, loading: authLoading } = useAuth();
  const { loading: profileLoading } = useProfile();
  const router = useRouter();
  const [calculation, setCalculation] = useState<CalculationWithMonths | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados del formulario
  const [name, setName] = useState('');
  const [udValue, setUdValue] = useState(0);
  const [monthsData, setMonthsData] = useState<MonthData[]>([]);

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
        
        // Cargar datos en el formulario
        setName(data.name);
        setUdValue(data.ud_value);
        setMonthsData(data.months);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el cálculo');
        console.error('Error loading calculation:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCalculation();
  }, [id, user, router]);

  const calculateMonthlyResult = (salary: number, coe: number, ud: number): number => {
    return salary * ((ud - coe) / coe + 1);
  };

  const handleMonthChange = (index: number, field: 'coe' | 'salary', value: number) => {
    const updatedMonths = [...monthsData];
    updatedMonths[index] = {
      ...updatedMonths[index],
      [field]: value,
      result: calculateMonthlyResult(
        field === 'salary' ? value : updatedMonths[index].salary,
        field === 'coe' ? value : updatedMonths[index].coe,
        udValue
      )
    };
    setMonthsData(updatedMonths);
  };

  // Recalcular todos los resultados cuando cambie el valor UD
  useEffect(() => {
    if (monthsData.length > 0) {
      const updatedMonths = monthsData.map(month => ({
        ...month,
        result: calculateMonthlyResult(month.salary, month.coe, udValue)
      }));
      setMonthsData(updatedMonths);
    }
  }, [udValue]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const totalSalary = monthsData.reduce((sum, month) => sum + month.salary, 0);
      const totalResult = monthsData.reduce((sum, month) => sum + month.result, 0);
      const averageCoe = monthsData.reduce((sum, month) => sum + month.coe, 0) / monthsData.length;

      const updateData = {
        name,
        ud_value: udValue,
        total_salary: totalSalary,
        total_result: totalResult,
        average_coe: averageCoe,
        total_months: monthsData.length,
        months: monthsData.map(month => ({
          year: month.year,
          month: month.month,
          month_name: month.month_name,
          days: month.days,
          coe: month.coe,
          salary: month.salary,
          result: month.result
        }))
      };

      await CalculationService.updateCalculation(id, updateData);
      
      // Redirigir a la vista del cálculo
      router.push(`/mis-calculos/${id}`);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el cálculo');
      console.error('Error saving calculation:', err);
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(amount);
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Editar Cálculo
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Modifica los parámetros de tu cálculo existente
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/mis-calculos/${calculation.id}`}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Error al guardar
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notificación de Advertencia */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Cambios Pendientes
              </h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p>
                  Los cambios que realices en esta página solo se guardarán cuando hagas clic en &quot;Guardar Cambios&quot;. 
                  Para ver los resultados actualizados en tu cálculo, debes guardar primero.
                </p>
              </div>
            </div>
          </div>
        </div>



        {/* Formulario de Edición */}
        <div className="space-y-6">
          {/* Configuración Básica */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Configuración Básica
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Modifica el nombre y valor UD del cálculo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="calculationName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre del Cálculo
                </label>
                <input
                  type="text"
                  id="calculationName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={'Ej: Cálculo Periodo 2010 a 2025'}
                />
              </div>
              <div>
                <label htmlFor="udValue" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Valor UD (Unidad de Desarrollo)
                </label>
                <input
                  type="number"
                  id="udValue"
                  value={udValue}
                  onChange={(e) => setUdValue(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={'Valor UD'}
                />
              </div>
            </div>
          </div>

          {/* Tabla de Meses */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Editar Datos Mensuales
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Modifica los valores de COE y sueldo para cada mes.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Mes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      COE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Sueldo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Resultado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {monthsData.map((month, index) => (
                    <tr key={month.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {month.month_name} {month.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          value={month.coe}
                          onChange={(e) => handleMonthChange(index, 'coe', Number(e.target.value))}
                          className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          value={month.salary}
                          onChange={(e) => handleMonthChange(index, 'salary', Number(e.target.value))}
                          className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 dark:text-green-400">
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
    </div>
  );
}
