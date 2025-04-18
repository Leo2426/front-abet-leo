import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { addProduct, updateProduct } from '../services/fakeStoreService.ts';
import { Product } from '../models/Product';

interface Props {
    open: boolean;
    onClose: () => void;
    onProductAdded: () => void;
    productToEdit?: Product | null;
}

export function AddProductDialog({ open, onClose, onProductAdded, productToEdit }: Props) {
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        category: '',
        image: '',
    });

    useEffect(() => {
        if (productToEdit) {
            setFormData({
                title: productToEdit.title,
                price: String(productToEdit.price),
                description: productToEdit.description,
                category: productToEdit.category,
                image: productToEdit.image,
            });
        } else {
            setFormData({
                title: '',
                price: '',
                description: '',
                category: '',
                image: '',
            });
        }
    }, [productToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const payload = {
            title: formData.title,
            price: parseFloat(formData.price),
            description: formData.description,
            category: formData.category,
            image: formData.image,
        };

        try {
            if (productToEdit) {
                await updateProduct(productToEdit.id!, payload);
            } else {
                await addProduct(payload);
            }
            onProductAdded();
            onClose();
        } catch (error) {
            console.error('Error al guardar el producto:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{productToEdit ? 'Editar Producto' : 'Añadir Producto'}</DialogTitle>
            <DialogContent sx={{ display: 'grid', gap: 2, minWidth: 400 }}>
                <TextField
                    name="title"
                    label="Título"
                    value={formData.title}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                <TextField
                    name="price"
                    label="Precio"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                <TextField
                    name="description"
                    label="Descripción"
                    value={formData.description}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                <TextField
                    name="category"
                    label="Categoría"
                    value={formData.category}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                <TextField
                    name="image"
                    label="URL de la Imagen"
                    value={formData.image}
                    onChange={handleChange}
                    fullWidth
                    required
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="error">
                    Cancelar
                </Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    {productToEdit ? 'Actualizar' : 'Guardar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}