import { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getProducts, deleteProduct } from '../services/fakeStoreService.ts';
import { Button, Box, Typography, Snackbar, Alert, IconButton, Stack } from '@mui/material';
import { AddProductDialog } from './AddProductDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {Product} from "../models/Product.ts";

export function Tabla() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const fetchProducts = () => {
        setLoading(true);
        getProducts()
            .then((data) => setProducts(data))
            .catch((err) => console.error('Error al cargar productos:', err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de eliminar este producto?')) {
            try {
                await deleteProduct(id);
                fetchProducts();
                setSnackbarOpen(true);
            } catch (error) {
                console.error('Error al eliminar producto:', error);
            }
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setDialogOpen(true);
    };

    const columns: GridColDef[] = [
        {field: 'id', headerName: 'ID', flex: 1},
        {field: 'title', headerName: 'Nombre del Producto', flex: 3},
        {field: 'price', headerName: 'Precio', type: 'number', flex: 2},
        {field: 'category', headerName: 'Categoría', flex: 3},
        {
            field: 'image',
            headerName: 'Imagen',
            width: 100,
            renderCell: (params) => (
                <img src={params.value} alt="img" style={{width: 50, height: 50}}/>
            ),
        },
        {
            field: 'actions',
            headerName: 'Acciones',
            width: 120,
            renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    <IconButton onClick={() => handleEdit(params.row)}>
                        <EditIcon/>
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
                        <DeleteIcon/>
                    </IconButton>
                </Stack>
            ),
        },
    ];

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Ejercicio ABET - CRUD Fake Store API</Typography>
                <Button variant="contained" onClick={() => {
                    setEditingProduct(null);
                    setDialogOpen(true);
                }}>
                    Añadir Producto
                </Button>
            </Box>

            <DataGrid
                rows={products}
                columns={columns}
                loading={loading}
                getRowId={(row) => row.id}
                pageSizeOptions={[5, 10, 100]}
                initialState={{
                    pagination: {paginationModel: {page: 0, pageSize: 5}},
                }}
                sx={{border: 0}}
            />

            <AddProductDialog
                open={dialogOpen}
                onClose={() => {
                    setDialogOpen(false);
                    setEditingProduct(null);
                }}
                onProductAdded={() => {
                    fetchProducts();
                    setSnackbarOpen(true);
                }}
                productToEdit={editingProduct}
            />

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="success" variant="filled">
                    OK
                </Alert>
            </Snackbar>
        </Box>
    );
}