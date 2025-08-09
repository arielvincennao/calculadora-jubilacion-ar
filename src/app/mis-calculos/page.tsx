'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useCalculations } from '@/hooks/useCalculations';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MisCalculosPage() {
  const { user } = useAuth();
  const { loading: profileLoading } = useProfile();
  const { calculations, loading, deleteCalculation } = useCalculations();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'result'>('date');



  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
  }, [user, router]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const filteredAndSortedCalculations = calculations
    .filter(calc => 
      calc.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'result':
          return b.total_result - a.total_result;
        case 'date':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });



  const handleEdit = (calculationId: string) => {
    router.push(`/mis-calculos/${calculationId}/editar`);
  };

  const handleView = (calculationId: string) => {
    router.push(`/mis-calculos/${calculationId}`);
  };

  const handleDelete = async (calculationId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este cálculo?')) {
      try {
        await deleteCalculation(calculationId);
      } catch (error) {
        console.error('Error deleting calculation:', error);
      }
    }
  };

  if (profileLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Cargando cálculos...</p>
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
               Mis Cálculos
             </h1>
             <p className="text-gray-600 dark:text-gray-300 mt-2">
               Gestiona y accede a todos tus cálculos de jubilación
             </p>
           </div>
           <div className="flex gap-3">
             <Link
               href="/dashboard"
               className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center"
             >
               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
               </svg>
               Volver
             </Link>
             <Link
               href="/calculo"
               className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
             >
               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
               </svg>
               Nuevo Cálculo
             </Link>
           </div>
         </div>

        {/* Filtros y Búsqueda */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Buscar cálculos
              </label>
              <input
                type="text"
                id="search"
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ordenar por
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'result')}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="date">Fecha de creación</option>
                <option value="name">Nombre</option>
                <option value="result">Resultado</option>
              </select>
            </div>
          </div>
        </div>

        

        {/* Lista de Cálculos */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Cálculos ({filteredAndSortedCalculations.length})
            </h2>
          </div>

          {filteredAndSortedCalculations.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No se encontraron cálculos
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {searchTerm ? 'No hay cálculos que coincidan con tu búsqueda.' : 'Aún no has realizado ningún cálculo.'}
              </p>
              {!searchTerm && (
                <Link
                  href="/calculo"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Crear mi primer cálculo
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAndSortedCalculations.map((calculation) => (
                <div key={calculation.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1 mb-4 lg:mb-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {calculation.name}
                          </h3>
                                                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                             <div>
                               <span className="text-gray-500 dark:text-gray-400">Período:</span>
                                                              <p className="font-medium text-gray-900 dark:text-white">
                                 {formatDate(calculation.start_date)} - {formatDate(calculation.end_date)}
                               </p>
                             </div>
                             <div>
                               <span className="text-gray-500 dark:text-gray-400">UD:</span>
                               <p className="font-medium text-gray-900 dark:text-white">
                                 {calculation.ud_value.toLocaleString()}
                               </p>
                             </div>
                             <div>
                               <span className="text-gray-500 dark:text-gray-400">Resultado:</span>
                               <p className="font-medium text-green-600 dark:text-green-400">
                                 {formatCurrency(calculation.total_result)}
                               </p>
                             </div>
                           </div>
                           <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400">
                             <span>Creado: {formatDate(calculation.created_at)}</span>
                             <span className="mx-2">•</span>
                             <span>{calculation.total_months} meses</span>
                           </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleView(calculation.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Ver
                      </button>
                      
                                             <button
                         onClick={() => handleEdit(calculation.id)}
                         className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center"
                       >
                         <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                         </svg>
                         Editar
                       </button>
                      <button
                        onClick={() => handleDelete(calculation.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
