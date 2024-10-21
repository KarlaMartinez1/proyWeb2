// Importamos los módulos necesarios
const express = require('express'); // Framework web para Node.js
const axios = require('axios'); // Librería para hacer solicitudes HTTP
const cors = require('cors'); // Middleware para permitir solicitudes entre dominios
const morgan = require('morgan');

// Creamos una instancia de Express
const app = express();
const PORT = process.env.PORT || 5000; // Definimos el puerto en el que escuchará el servidor

// Middleware para parsear el cuerpo de las solicitudes
app.use(express.json()); // Permite manejar solicitudes con contenido JSON
app.use(cors()); // Permitir solicitudes de diferentes dominios (CORS)
app.use(morgan('dev'));

let carrito = []; // Arreglo de productos en el carrito

// Ruta para obtener productos de la API de Fake Store (GET)
app.get('/items/products', async (req, res) => {
    try {
        const response = await axios.get('https://fakestoreapi.com/products'); // Petición a la API
        const products = response.data; // Obtenemos los productos
        res.json(products); // Devolvemos los productos como respuesta en formato JSON
    } catch (error) {
        console.error('Error al obtener los productos:', error.message);
        res.status(500).send('Error al obtener los productos');
    }
});

// Ruta para obtener un producto específico por ID (GET)
app.get('/items/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const response = await axios.get(`https://fakestoreapi.com/products/${id}`);
        const product = response.data;
        res.json(product); // Devolvemos el producto específico
    } catch (error) {
        console.error('Error al obtener el producto:', error.message);
        res.status(500).send('Error al obtener el producto');
    }
});

// Ruta para agregar un producto al carrito (POST)
app.post('/items/cart/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const response = await axios.get(`https://fakestoreapi.com/products/${id}`);
        const product = response.data;

        const item = { ...product, isPurchased: false };
        carrito.push(item); // Agregamos el producto al carrito

        res.json(item); // Devolvemos el producto agregado
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error.message);
        res.status(500).send('Error al agregar el producto al carrito');
    }
});

// Ruta para obtener todos los productos en el carrito (GET)
app.get('/items/cart', (req, res) => {
    res.json(carrito); // Devolvemos el carrito con los productos agregados
});

// Ruta para eliminar un producto del carrito por ID (DELETE)
app.delete('/items/cart/delete/:id', (req, res) => {
    const { id } = req.params;
    const index = carrito.findIndex(item => item.id === parseInt(id));

    if (index !== -1) {
        carrito.splice(index, 1); // Eliminamos el producto del carrito
        res.send(`Producto con ID ${id} eliminado del carrito.`);
    } else {
        res.status(404).send('Producto no encontrado en el carrito.');
    }
});

// Ruta para marcar un producto como comprado en el carrito (PUT)
app.put('/items/cart/:id', (req, res) => {
    const { id } = req.params;
    const product = carrito.find(item => item.id === parseInt(id));

    if (!product) {
        return res.status(404).send('Producto no encontrado en el carrito.');
    }

    product.isPurchased = true;
    res.send(`Producto ${product.title} marcado como comprado.`);
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
