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
  image_id: string;
  image_url: string;
  recommendation: string;
  ingredients: string[];
}

export interface PlateDataTestType {
  filename: string;
  image_url: string;
  prompt_used: string;
}
