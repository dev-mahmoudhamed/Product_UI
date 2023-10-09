export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    userId: string;
    category: Category
}

export interface Category {
    id: number;
    name: string;
}

