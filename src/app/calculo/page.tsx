'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CalculationService } from '@/lib/supabase/calculations';

// Estilos DatePicker
const datePickerStyles = `
  .react-datepicker {
    background-color: white;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-family: inherit;
  }
  
  .dark .react-datepicker {
    background-color: #374151;
    border-color: #4b5563;
    color: white;
  }
  
  .react-datepicker__header {
    background-color: #f3f4f6;
    border-bottom: 1px solid #d1d5db;
  }
  
  .dark .react-datepicker__header {
    background-color: #4b5563;
    border-bottom-color: #6b7280;
  }
  
  .react-datepicker__current-month {
    color: #111827;
  }
  
  .dark .react-datepicker__current-month {
    color: white;
  }
  
  .react-datepicker__day {
    color: #111827;
  }
  
  .dark .react-datepicker__day {
    color: white;
  }
  
  .react-datepicker__day:hover {
    background-color: #e5e7eb;
  }
  
  .dark .react-datepicker__day:hover {
    background-color: #6b7280;
  }
  
  .react-datepicker__day--selected {
    background-color: #3b82f6;
    color: white;
  }
  
  .react-datepicker__day--keyboard-selected {
    background-color: #3b82f6;
    color: white;
  }
  
  .react-datepicker__day--in-range {
    background-color: #dbeafe;
    color: #1e40af;
  }
  
  .dark .react-datepicker__day--in-range {
    background-color: #1e3a8a;
    color: white;
  }
  
  .react-datepicker__day--disabled {
    color: #9ca3af;
  }
  
  .dark .react-datepicker__day--disabled {
    color: #6b7280;
  }
`;

interface MonthData {
  year: number;
  month: number;
  monthName: string;
  days: number;
  coe: number;
  salary: number;
}

interface CalculationResult {
  month: MonthData;
  result: number;
  formula: string;
}

interface CalculationSummary {
  totalSalary: number;
  averageSalary: number;
  totalResult: number;
  averageResult: number;
  averageCoe: number;
  totalDays: number;
  totalMonths: number;
}

export default function CalculoPage() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();

  const router = useRouter();

  const [calculationName, setCalculationName] = useState<string>('');
  const [udValue, setUdValue] = useState<number>(1);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [isCalculating, setIsCalculating] = useState(false);
  const [showMonths, setShowMonths] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [monthsData, setMonthsData] = useState<MonthData[]>([]);
  const [calculationResults, setCalculationResults] = useState<CalculationResult[]>([]);
  const [calculationSummary, setCalculationSummary] = useState<CalculationSummary | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!profileLoading && profile && profile.role !== 'Verificado') {
      router.push('/dashboard');
    }
  }, [profile, profileLoading, router]);

  // Genera los meses entre dos fechas
  const generateMonths = (start: Date, end: Date): MonthData[] => {
    const months: MonthData[] = [];
    const currentDate = new Date(start.getFullYear(), start.getMonth(), 1);
    const endDate = new Date(end.getFullYear(), end.getMonth(), 1);

    while (currentDate <= endDate) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const monthName = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
      const days = new Date(year, month + 1, 0).getDate();

      months.push({
        year,
        month,
        monthName,
        days,
        coe: 1,
        salary: 0
      });

      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return months;
  };

  const handleGenerateMonths = () => {
    if (startDate && endDate && startDate <= endDate) {
      const months = generateMonths(startDate, endDate);
      setMonthsData(months);
      setShowMonths(true);
      setShowResults(false);
    }
  };

  const handleMonthChange = (index: number, field: 'coe' | 'salary', value: number) => {
    const updatedMonths = [...monthsData];
    updatedMonths[index] = { ...updatedMonths[index], [field]: value };
    setMonthsData(updatedMonths);
  };

  // Función para calcular el resultado mensual
  const calculateMonthlyResult = (salary: number, coe: number, ud: number): number => {
    if (coe === 0) return 0;
    return salary * ((ud - coe) / coe + 1);
  };

  // Función para generar el informe
  const generateReport = () => {
    const results: CalculationResult[] = monthsData.map(month => {
      const result = calculateMonthlyResult(month.salary, month.coe, udValue);
      const formula = `${month.salary} * ((${udValue} - ${month.coe}) / ${month.coe} + 1) = ${result.toFixed(2)}`;

      return {
        month,
        result,
        formula
      };
    });

    const totalSalary = monthsData.reduce((sum, month) => sum + month.salary, 0);
    const averageSalary = totalSalary / monthsData.length;
    const totalResult = results.reduce((sum, result) => sum + result.result, 0);
    const averageResult = totalResult / results.length;
    const averageCoe = monthsData.reduce((sum, month) => sum + month.coe, 0) / monthsData.length;
    const totalDays = monthsData.reduce((sum, month) => sum + month.days, 0);

    const summary: CalculationSummary = {
      totalSalary,
      averageSalary,
      totalResult,
      averageResult,
      averageCoe,
      totalDays,
      totalMonths: monthsData.length
    };

    setCalculationResults(results);
    setCalculationSummary(summary);
    setShowResults(true);
  };

  const handleCalculate = async () => {
    setIsCalculating(true);

    try {
      // Generar el reporte
      generateReport();

      // Guardar en Supabase
      const calculationData = {
        name: calculationName || 'Cálculo sin nombre',
        ud_value: udValue,
        start_date: startDate?.toISOString().split('T')[0] || '',
        end_date: endDate?.toISOString().split('T')[0] || '',
        total_salary: monthsData.reduce((sum, month) => sum + month.salary, 0),
        total_result: monthsData.reduce((sum, month) => sum + calculateMonthlyResult(month.salary, month.coe, udValue), 0),
        average_coe: monthsData.reduce((sum, month) => sum + month.coe, 0) / monthsData.length,
        total_months: monthsData.length,
        months: monthsData.map(month => ({
          year: month.year,
          month: month.month,
          month_name: month.monthName,
          days: month.days,
          coe: month.coe,
          salary: month.salary,
          result: calculateMonthlyResult(month.salary, month.coe, udValue)
        }))
      };

      await CalculationService.createCalculation(calculationData);
      
      // Mostrar mensaje de éxito
      alert('Cálculo guardado exitosamente');
      
    } catch (error) {
      console.error('Error saving calculation:', error);
      alert('Error al guardar el cálculo. Por favor, inténtalo de nuevo.');
    } finally {
      setIsCalculating(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(amount);
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

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Cargando...</p>
        </div>
      </div>
    );
  }



  if (!user || !profile || profile.role !== 'Verificado') {
    return null;
  }

  return (
    <>
      <style jsx global>{datePickerStyles}</style>
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
                    {calculationName || 'Cálculo sin nombre'}
                  </h1>
                  <div className="text-gray-700 space-y-1">
                    <p className="text-lg">
                      Período: {startDate?.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })} a {endDate?.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-base">
                      Valor UD: {udValue}
                    </p>
                    <p className="text-base">
                      Generado el: {new Date().toLocaleDateString('es-ES', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Header */}
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 ${isPrinting ? 'no-print' : ''}`}>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Nuevo Cálculo
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Configura los parámetros para generar un nuevo cálculo
              </p>
            </div>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-center w-full sm:w-auto"
            >
              Volver al Dashboard
            </Link>
          </div>

          {!showMonths ? (
            /* Panel Principal */
            <div className="space-y-6">
              {/* Nombre del Cálculo */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Nombre del Cálculo
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Asigna un nombre descriptivo a tu cálculo.
                  </p>
                </div>

                <div>
                  <label htmlFor="calculationName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre del Cálculo
                  </label>
                  <input
                    type="text"
                    id="calculationName"
                    value={calculationName}
                    onChange={(e) => setCalculationName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder={'Ej: Cálculo Periodo 2010 a 2025'}
                  />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Este nombre te ayudará a identificar y organizar tus cálculos.
                  </p>
                </div>
              </div>

              {/* Configuración UD y Período */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

                  {/* Configuración UD */}
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Configuración UD (Unidad de Desarrollo)
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        Establece el valor de la Unidad de Desarrollo que se aplicará a todos los meses del cálculo.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="udValue" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Valor UD
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            id="udValue"
                            value={udValue}
                            onChange={(e) => setUdValue(Number(e.target.value))}
                            min="0.01"
                            step="0.01"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Ingresa el valor UD"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 dark:text-gray-400 text-sm">UD</span>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          Este valor se aplicará uniformemente a todos los meses del período de cálculo.
                        </p>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                              Información UD
                            </h3>
                            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                              <p>
                                La Unidad de Desarrollo es un valor de referencia que se utiliza para calcular
                                los montos de jubilación. Este valor se mantiene constante durante todo el período.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Configuración de Meses */}
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Período de Cálculo
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        Define el período exacto para tu cálculo de jubilación seleccionando mes y año.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Mes Inicial
                        </label>
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          selectsStart
                          startDate={startDate || undefined}
                          endDate={endDate || undefined}
                          dateFormat="MMMM yyyy"
                          showMonthYearPicker
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholderText="Selecciona mes inicial"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Mes Final
                        </label>
                        <DatePicker
                          selected={endDate}
                          onChange={(date) => setEndDate(date)}
                          selectsEnd
                          startDate={startDate || undefined}
                          endDate={endDate || undefined}
                          minDate={startDate || undefined}
                          dateFormat="MMMM yyyy"
                          showMonthYearPicker
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholderText="Selecciona mes final"
                        />
                      </div>

                      {/* Información Adicional */}
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 sm:p-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                              Nota Importante
                            </h3>
                            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                              <p>
                                Selecciona el mes inicial y final del período que deseas calcular.
                                Luego podrás configurar el COE y sueldo para cada mes individualmente.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row gap-4 justify-end">
                    <Link
                      href="/dashboard"
                      className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center w-full sm:w-auto"
                    >
                      Cancelar
                    </Link>
                    <button
                      onClick={handleGenerateMonths}
                      disabled={!startDate || !endDate || startDate > endDate || udValue <= 0}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center w-full sm:w-auto"
                    >
                      Siguiente
                      <svg
                        className="w-5 h-5 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : !showResults ? (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Configuración de Meses
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                      Configura el COE y sueldo para cada mes del período seleccionado
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => setShowMonths(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center"
                    >
                      Volver
                    </button>
                    <button
                      onClick={handleCalculate}
                      disabled={isCalculating}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                      {isCalculating ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Calculando...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          Calcular
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Información del Cálculo */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-4">
                  Información del Cálculo
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-blue-700 dark:text-blue-300">
                  <div>
                    <span>Nombre: </span>
                    <span className="font-medium">{calculationName || 'Sin nombre'}</span>
                  </div>
                  <div>
                    <span>Valor UD: </span>
                    <span className="font-medium">{udValue} UD</span>
                  </div>
                  <div>
                    <span>Período: </span>
                    <span className="font-medium">
                      {startDate?.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })} - {endDate?.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <div>
                    <span>Total meses: </span>
                    <span className="font-medium">{monthsData.length}</span>
                  </div>
                </div>
              </div>

              {/* Lista de Meses */}
              <div className="space-y-4">
                {monthsData.map((month, index) => (
                  <div key={`${month.year}-${month.month}`} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                        {month.monthName}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {month.days} días
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          COE (Coeficiente de Equivalencia)
                        </label>
                        <input
                          type="number"
                          value={month.coe}
                          onChange={(e) => handleMonthChange(index, 'coe', Number(e.target.value))}
                          min="0"
                          step="0.01"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Ingresa el COE"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Sueldo
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={month.salary}
                            onChange={(e) => handleMonthChange(index, 'salary', Number(e.target.value))}
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-12"
                            placeholder="Ingresa el sueldo"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 dark:text-gray-400 text-sm">$</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Resultados del Cálculo */
            <div className="space-y-6">
              {/* Header de Resultados */}
              <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${isPrinting ? 'no-print' : ''}`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Resultados del Cálculo
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                      Informe detallado del cálculo de jubilación
                    </p>
                  </div>
                  <div className={`flex gap-3 w-full sm:w-auto ${isPrinting ? 'no-print' : ''}`}>
                     <button
                       onClick={handlePrint}
                       className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center w-full sm:w-auto"
                     >
                       <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                       </svg>
                       Imprimir
                     </button>
                   </div>
                </div>
              </div>

              {/* Información Adicional */}
              <div className={`bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 sm:p-6 ${isPrinting ? 'no-print' : ''}`}>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                      Cálculo Completado
                    </h3>
                    <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                      <p>
                        El cálculo ha sido completado y guardado exitosamente. Puedes imprimir este informe o encontrarlo en el historial de tu perfil para referencia futura.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información del Cálculo */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-4">
                  Información del Cálculo
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-blue-700 dark:text-blue-300">
                  <div>
                    <span>Nombre: </span>
                    <span className="font-medium">{calculationName || 'Sin nombre'}</span>
                  </div>
                  <div>
                    <span>Valor UD: </span>
                    <span className="font-medium">{udValue} UD</span>
                  </div>
                  <div>
                    <span>Período: </span>
                    <span className="font-medium">
                      {startDate?.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })} - {endDate?.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <div>
                    <span>Total meses: </span>
                    <span className="font-medium">{monthsData.length}</span>
                  </div>
                </div>
              </div>

              {/* Panel de Resumen */}
              {calculationSummary && (
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
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(calculationSummary.totalSalary)}</p>
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
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(calculationSummary.totalResult)}</p>
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
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(calculationSummary.averageResult)}</p>
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
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">{calculationSummary.totalMonths}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
                      {calculationResults.map((result, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white capitalize">
                            {result.month.monthName}
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {result.month.coe}
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {formatCurrency(result.month.salary)}
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 dark:text-green-400">
                            {formatCurrency(result.result)}
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>


            </div>
          )}
        </div>
      </div>
    </>
  );
}
