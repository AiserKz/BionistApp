export interface PlateSection {
  name: string;
  items: string[];
  value: number;
  [key: string]: any;
}

export interface PlateData {
  summary: string;
  totalCalories: number;
  plate: PlateSection[];
  imageUrl: string;
  recommendation: string;
  ingredients: string[];
}
