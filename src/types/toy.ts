export type Toy = {
  id: string;
  name: string;
  category: string[];
  price: number;
  images: string[];
  popularity?: number;
  slug?: string;
  stock: string;
};