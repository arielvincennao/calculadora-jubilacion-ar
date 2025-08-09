import { useState, useEffect, useCallback } from 'react';
import { CalculationService } from '@/lib/supabase/calculations';
import { Calculation, CalculationWithMonths, CreateCalculationData, UpdateCalculationData } from '@/types/calculation';

export function useCalculations() {
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar cálculos del usuario
  const loadCalculations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await CalculationService.getUserCalculations();
      setCalculations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los cálculos');
      console.error('Error loading calculations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear nuevo cálculo
  const createCalculation = useCallback(async (calculationData: CreateCalculationData) => {
    try {
      setError(null);
      const newCalculation = await CalculationService.createCalculation(calculationData);
      setCalculations(prev => [newCalculation, ...prev]);
      return newCalculation;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el cálculo');
      console.error('Error creating calculation:', err);
      throw err;
    }
  }, []);

  // Actualizar cálculo
  const updateCalculation = useCallback(async (id: string, updateData: UpdateCalculationData) => {
    try {
      setError(null);
      const updatedCalculation = await CalculationService.updateCalculation(id, updateData);
      setCalculations(prev => 
        prev.map(calc => calc.id === id ? updatedCalculation : calc)
      );
      return updatedCalculation;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el cálculo');
      console.error('Error updating calculation:', err);
      throw err;
    }
  }, []);

  // Eliminar cálculo
  const deleteCalculation = useCallback(async (id: string) => {
    try {
      setError(null);
      await CalculationService.deleteCalculation(id);
      setCalculations(prev => prev.filter(calc => calc.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el cálculo');
      console.error('Error deleting calculation:', err);
      throw err;
    }
  }, []);

  // Duplicar cálculo
  const duplicateCalculation = useCallback(async (id: string, newName?: string) => {
    try {
      setError(null);
      const duplicatedCalculation = await CalculationService.duplicateCalculation(id, newName);
      setCalculations(prev => [duplicatedCalculation, ...prev]);
      return duplicatedCalculation;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al duplicar el cálculo');
      console.error('Error duplicating calculation:', err);
      throw err;
    }
  }, []);

  // Obtener cálculo específico
  const getCalculationById = useCallback(async (id: string): Promise<CalculationWithMonths | null> => {
    try {
      setError(null);
      return await CalculationService.getCalculationById(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener el cálculo');
      console.error('Error getting calculation:', err);
      throw err;
    }
  }, []);

  // Cargar cálculos al montar el componente
  useEffect(() => {
    loadCalculations();
  }, [loadCalculations]);

  return {
    calculations,
    loading,
    error,
    loadCalculations,
    createCalculation,
    updateCalculation,
    deleteCalculation,
    duplicateCalculation,
    getCalculationById
  };
}
