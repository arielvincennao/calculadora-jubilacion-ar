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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Editar Cálculo
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {calculation.name}
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre del Cálculo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Nombre del cálculo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Valor UD
              </label>
              <input
                type="number"
                value={udValue}
                onChange={(e) => setUdValue(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Valor UD"
              />
            </div>
          </div>

          {/* Tabla de meses */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-600">
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold">Mes</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center font-semibold">COE</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center font-semibold">Sueldo</th>
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center font-semibold">Resultado</th>
                </tr>
              </thead>
              <tbody>
                {monthsData.map((month, index) => (
                  <tr key={month.id} className={index % 2 === 0 ? 'bg-white dark:bg-gray-700' : 'bg-gray-50 dark:bg-gray-600'}>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                      {month.month_name} {month.year}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                      <input
                        type="number"
                        value={month.coe}
                        onChange={(e) => handleMonthChange(index, 'coe', Number(e.target.value))}
                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-500 rounded text-center dark:bg-gray-600 dark:text-white"
                      />
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                      <input
                        type="number"
                        value={month.salary}
                        onChange={(e) => handleMonthChange(index, 'salary', Number(e.target.value))}
                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-500 rounded text-center dark:bg-gray-600 dark:text-white"
                      />
                    </td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center font-semibold">
                      {formatCurrency(month.result)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Resumen actualizado */}
          <div className="mt-8 bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Resumen Actualizado
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-600 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">UD</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {udValue.toLocaleString()}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-600 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Sueldo Total</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(monthsData.reduce((sum, month) => sum + month.salary, 0))}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-600 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Resultado Total</h3>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(monthsData.reduce((sum, month) => sum + month.result, 0))}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-600 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Meses</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {monthsData.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
