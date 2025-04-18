import axios from 'axios';
import {Product} from "../models/Product.ts";

const BASE_URL = 'https://fakestoreapi.com';


export const getProducts = async (): Promise<Product[]> => {
    const response = await axios.get(`${BASE_URL}/products/`);
    return response.data;
};

export const addProduct = async (product: Product): Promise<Product> => {
    const response = await axios.post(`${BASE_URL}/products`, product);
    return response.data;
};

export const deleteProduct = async (id: number): Promise<Product> => {
    const response = await axios.delete(`${BASE_URL}/products/${id}`);
    return response.data;
};

export const updateProduct = async (id: number, updatedProduct: Product): Promise<Product> => {
    const response = await axios.put(`${BASE_URL}/products/${id}`, updatedProduct);
    return response.data;
};