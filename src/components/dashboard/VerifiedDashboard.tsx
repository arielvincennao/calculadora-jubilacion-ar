'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Profile } from '@/hooks/useProfile';
import { useCalculations } from '@/hooks/useCalculations';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface VerifiedDashboardProps {
  profile: Profile;
}

export default function VerifiedDashboard({ profile }: VerifiedDashboardProps) {
  const { signOut } = useAuth();
  const { calculations, loading: calculationsLoading } = useCalculations();
  const [stats, setStats] = useState({
    totalCalculations: 0,
    totalReports: 0,
    lastActivity: 'Nunca',
    totalSalary: 0,
    totalResult: 0,
    averageCoe: 0
  });

  // Calcular estadísticas cuando cambien los cálculos
  useEffect(() => {
    if (calculations.length > 0) {
      const totalCalculations = calculations.length;
      
      setStats({
        totalCalculations,
        totalReports: 0,
        lastActivity: 'Hoy',
        totalSalary: 0,
        totalResult: 0,
        averageCoe: 0
      });
    } else {
      setStats({
        totalCalculations: 0,
        totalReports: 0,
        lastActivity: 'Hoy',
        totalSalary: 0,
        totalResult: 0,
        averageCoe: 0
      });
    }
  }, [calculations]);

  // Función para formatear moneda (no utilizada actualmente)
  // const formatCurrency = (amount: number): string => {
  //   return new Intl.NumberFormat('es-AR', {
  //     style: 'currency',
  //     currency: 'ARS',
  //     minimumFractionDigits: 0
  //   }).format(amount);
  // };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <button
            onClick={signOut}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Bienvenido, {profile.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Rol: <span className="font-medium text-green-600 dark:text-green-400">{profile.role}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Banner de Estado Verificado */}
        <div className="mt-8 mb-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                Cuenta Verificada
              </h3>
              <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                <p>
                  Tu cuenta ha sido verificada y tienes acceso completo a todas las funcionalidades del sistema.
                  Puedes realizar cálculos de jubilación, generar reportes y acceder a todas las herramientas disponibles.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Tarjeta de Estadísticas */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">
                Estadísticas
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Cálculos actuales</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {calculationsLoading ? (
                    <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-4 w-8 rounded"></div>
                  ) : (
                    stats.totalCalculations
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Última actividad</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {calculationsLoading ? (
                    <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-4 w-16 rounded"></div>
                  ) : (
                    stats.lastActivity
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Estado de la cuenta</span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  Verificado
                </span>
              </div>
            </div>
          </div>

          {/* Tarjeta de Acciones Rápidas */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">
                Acciones Rápidas
              </h3>
            </div>
            <div className="space-y-3">
              <Link href="/calculo" className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors block text-center">
                Nuevo Cálculo
              </Link>
              <Link href="/mis-calculos" className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors block text-center">
                Mis Cálculos
              </Link>
            </div>
          </div>

          {/* Tarjeta de Estado del Sistema */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">
                Estado del Sistema
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-600 dark:text-gray-300">Sistema operativo funcionando</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-600 dark:text-gray-300">Base de datos funcionando</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-600 dark:text-gray-300">API funcionando</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Funcionalidades Principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Panel de Cálculos */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Cálculos de Jubilación
            </h3>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Cálculo Básico</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  Calcula tu jubilación básica con los datos mínimos requeridos.
                </p>
                <Link href="/calculo">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Iniciar Cálculo
                  </button>
                </Link>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Cálculo Avanzado</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  Cálculo detallado con múltiples variables y escenarios.
                </p>
                <button
                  disabled
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cálculo Avanzado
                </button>
              </div>
            </div>
          </div>

          {/* Panel de Reportes */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Reportes y Análisis
            </h3>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Reporte Mensual</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  Genera un reporte detallado de tus cálculos del mes.
                </p>
                <button
                  disabled
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Generar Reporte Mensual
                </button>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Análisis Comparativo</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  Compara diferentes escenarios de jubilación.
                </p>
                <button
                  disabled
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Comparar Escenarios
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
} 