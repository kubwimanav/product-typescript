export interface Products { 
    
        id: number;
        title: String;
        description: String;
        price: number;
        discountPercentage: number;
    rating: number;
    stock: number;
    category: string;
        tags: String[];
        brand: String;
        sku: string;
        weight: number;
        dimensions: {
            width: number;
            height: number;
            depth: number;
        };
        warrantyInformation: String;
        shippingInformation: String;
        availabilityStatus: String;
        reviews: {
            rating: number;
            comment: String;
            date: String;
            reviewerName: String;
            reviewerEmail: String;
        } [];
        returnPolicy: String;
        minimumOrderQuantity: number;
        meta: {
            createdAt: String;
            updatedAt: String;
            barcode: String;
            qrCode: String;
        };
        thumbnail: String;
    images: String;

}

    
export interface Category {
    name: String;
    slug: String;
    url: String;
}

export interface Type{
    id: string;
    title: String;
}

export interface Type {

  carts: [
    {
      id: number;
      products: [
        {
          id: number;
          title: string;
          price: number;
          quantity: number;
          total: number;
          discountPercentage: number;
          discountedTotal: number;
          thumbnail: string;
        }
      ];
      total: number;
      discountedTotal: number;
      userId: number;
      totalProducts: number;
      totalQuantity: number;
    }
  ];
}
    