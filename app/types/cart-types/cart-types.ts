export interface CartItem {
  id: number;
  user_id: string;
  product_id: number;
  product_category_id: number;
  design_category_id: number;
  quantity: number;
  products?: {
    name: string;
    price: number;
    size: string;
    image_url: string | string[];
  };
}