type ProductReview = {
  rating: number;
  comment: string;
  date: string; // ISO date string
  reviewerName: string;
  reviewerEmail: string;
};

type ProductDimensions = {
  width: number;
  height: number;
  depth: number;
};

type ProductMeta = {
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  barcode: string;
  qrCode: string;
};

export type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: ProductDimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: ProductReview[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: ProductMeta;
  thumbnail: string;
  images: string[];
};

// type ProductsResponse = {
//   products: Product[];
//   total: number;
//   skip: number;
//   limit: number;
// };
