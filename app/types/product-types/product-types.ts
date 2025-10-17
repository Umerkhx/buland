export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  design_category_id: number;
  size: string;
  image_url: string | string[];
}

export interface ProductCategory {
  id: number;
  name: string;
}

export interface DesignCategory {
  id: number;
  name: string;
}