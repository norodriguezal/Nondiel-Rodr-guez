export type Category = 'vr' | 'ar';

export interface ContentNode {
  id: string;
  title: string;
  shortDescription?: string;
  fullContent: string;
  category: Category;
  x: number; // percentage 0-100 (mapped to 0-360 degrees)
  y: number; // percentage 0-100 (Vertical position)
  z?: number; // Optional depth offset for parallax
  color: string;
  connections?: string[];
}