export interface Calculation {
  id: string;
  user_id: string;
  name: string;
  ud_value: number;
  start_date: string;
  end_date: string;
  total_salary: number;
  total_result: number;
  average_coe: number;
  total_months: number;
  created_at: string;
  updated_at: string;
}

export interface CalculationMonth {
  id: string;
  calculation_id: string;
  year: number;
  month: number;
  month_name: string;
  days: number;
  coe: number;
  salary: number;
  result: number;
  created_at: string;
}

export interface CalculationWithMonths extends Calculation {
  months: CalculationMonth[];
}

export interface CreateCalculationData {
  name: string;
  ud_value: number;
  start_date: string;
  end_date: string;
  total_salary: number;
  total_result: number;
  average_coe: number;
  total_months: number;
  months: Omit<CalculationMonth, 'id' | 'calculation_id' | 'created_at'>[];
}

export interface UpdateCalculationData {
  name?: string;
  ud_value?: number;
  start_date?: string;
  end_date?: string;
  total_salary?: number;
  total_result?: number;
  average_coe?: number;
  total_months?: number;
  months?: Omit<CalculationMonth, 'id' | 'calculation_id' | 'created_at'>[];
}
