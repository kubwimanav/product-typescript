export interface Products { 

    
        id: Number;
        title: String;
        description: String;
        price: Number;
        discountPercentage: Number;
    rating: {
        rate: Number;
        count: Number;
        };
    stock: Number;
    category: String;
        tags: String[];
        brand: String;
        sku: String;
        weight: Number;
        dimensions: {
            width: Number;
            height: Number;
            depth: Number;
        };
        warrantyInformation: String;
        shippingInformation: String;
        availabilityStatus: String;
        reviews: {
            rating: Number;
            comment: String;
            date: String;
            reviewerName: String;
            reviewerEmail: String;
        } [];
        returnPolicy: String;
        minimumOrderQuantity: Number;
        meta: {
            createdAt: String;
            updatedAt: String;
            barcode: String;
            qrCode: String;
        };
        thumbnail: String;
        image: String;
}
    
export interface Category {
    name: String;
    slug: String;
    url: String;
}

    