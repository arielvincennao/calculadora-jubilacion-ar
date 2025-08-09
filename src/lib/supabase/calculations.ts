import { createClient } from './client';

const supabase = createClient();
import { 
  Calculation, 
  CalculationWithMonths,
  CreateCalculationData,
  UpdateCalculationData 
} from '@/types/calculation';

export class CalculationService {
  // Obtener todos los cálculos del usuario
  static async getUserCalculations(): Promise<Calculation[]> {
    const { data, error } = await supabase
      .from('calculations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching calculations:', error);
      throw new Error('Error al obtener los cálculos');
    }

    return data || [];
  }

  // Obtener un cálculo específico con sus meses
  static async getCalculationById(id: string): Promise<CalculationWithMonths | null> {
    const { data: calculation, error: calculationError } = await supabase
      .from('calculations')
      .select('*')
      .eq('id', id)
      .single();

    if (calculationError) {
      console.error('Error fetching calculation:', calculationError);
      throw new Error('Error al obtener el cálculo');
    }

    if (!calculation) {
      return null;
    }

    const { data: months, error: monthsError } = await supabase
      .from('calculation_months')
      .select('*')
      .eq('calculation_id', id)
      .order('year, month');

    if (monthsError) {
      console.error('Error fetching calculation months:', monthsError);
      throw new Error('Error al obtener los meses del cálculo');
    }

    return {
      ...calculation,
      months: months || []
    };
  }

  // Crear un nuevo cálculo
  static async createCalculation(calculationData: CreateCalculationData): Promise<Calculation> {
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Authentication error:', authError);
      throw new Error('Usuario no autenticado');
    }
    
    const { data: calculation, error: calculationError } = await supabase
      .from('calculations')
      .insert({
        user_id: user.id, // ¡AQUÍ ESTABA EL PROBLEMA!
        name: calculationData.name,
        ud_value: calculationData.ud_value,
        start_date: calculationData.start_date,
        end_date: calculationData.end_date,
        total_salary: calculationData.total_salary,
        total_result: calculationData.total_result,
        average_coe: calculationData.average_coe,
        total_months: calculationData.total_months
      })
      .select()
      .single();

    if (calculationError) {
      console.error('Error creating calculation:', calculationError);
      console.error('Error details:', {
        message: calculationError.message,
        details: calculationError.details,
        hint: calculationError.hint,
        code: calculationError.code
      });
      throw new Error(`Error al crear el cálculo: ${calculationError.message}`);
    }

    // Insertar los meses del cálculo
    if (calculationData.months.length > 0) {
      const monthsData = calculationData.months.map(month => ({
        calculation_id: calculation.id,
        year: month.year,
        month: month.month,
        month_name: month.month_name,
        days: month.days,
        coe: month.coe,
        salary: month.salary,
        result: month.result
      }));

      const { error: monthsError } = await supabase
        .from('calculation_months')
        .insert(monthsData);

      if (monthsError) {
        console.error('Error creating calculation months:', monthsError);
        // Intentar eliminar el cálculo si falla la inserción de meses
        await this.deleteCalculation(calculation.id);
        throw new Error('Error al crear los meses del cálculo');
      }
    }

    return calculation;
  }

  // Actualizar un cálculo existente
  static async updateCalculation(id: string, updateData: UpdateCalculationData): Promise<Calculation> {
    const updateFields: Record<string, unknown> = {};
    
    // Solo incluir campos que no sean undefined
    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined && key !== 'months') {
        updateFields[key] = value;
      }
    });

    updateFields.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('calculations')
      .update(updateFields)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating calculation:', error);
      throw new Error('Error al actualizar el cálculo');
    }

    // Actualizar meses si se proporcionan
    if (updateData.months) {
      // Eliminar meses existentes
      await supabase
        .from('calculation_months')
        .delete()
        .eq('calculation_id', id);

      // Insertar nuevos meses
      if (updateData.months.length > 0) {
        const monthsData = updateData.months.map(month => ({
          calculation_id: id,
          year: month.year,
          month: month.month,
          month_name: month.month_name,
          days: month.days,
          coe: month.coe,
          salary: month.salary,
          result: month.result
        }));

        const { error: monthsError } = await supabase
          .from('calculation_months')
          .insert(monthsData);

        if (monthsError) {
          console.error('Error updating calculation months:', monthsError);
          throw new Error('Error al actualizar los meses del cálculo');
        }
      }
    }

    return data;
  }

  // Eliminar un cálculo
  static async deleteCalculation(id: string): Promise<void> {
    const { error } = await supabase
      .from('calculations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting calculation:', error);
      throw new Error('Error al eliminar el cálculo');
    }
  }

  // Duplicar un cálculo (para recalcular)
  static async duplicateCalculation(id: string, newName?: string): Promise<Calculation> {
    const originalCalculation = await this.getCalculationById(id);
    
    if (!originalCalculation) {
      throw new Error('Cálculo no encontrado');
    }

    const calculationData: CreateCalculationData = {
      name: newName || `${originalCalculation.name} (Copia)`,
      ud_value: originalCalculation.ud_value,
      start_date: originalCalculation.start_date,
      end_date: originalCalculation.end_date,
      total_salary: originalCalculation.total_salary,
      total_result: originalCalculation.total_result,
      average_coe: originalCalculation.average_coe,
      total_months: originalCalculation.total_months,
      months: originalCalculation.months.map(month => ({
        year: month.year,
        month: month.month,
        month_name: month.month_name,
        days: month.days,
        coe: month.coe,
        salary: month.salary,
        result: month.result
      }))
    };

    return await this.createCalculation(calculationData);
  }
}
