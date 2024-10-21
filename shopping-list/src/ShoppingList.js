import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Importa el archivo de estilos

const API_URL = 'http://localhost:5000/items';

function ShoppingList() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchId, setSearchId] = useState(''); // Estado para almacenar el ID de búsqueda
    const [searchedProduct, setSearchedProduct] = useState(null); // Estado para almacenar el producto encontrado

    // Fetch todos los productos al cargar el componente
    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await axios.get(`${API_URL}/products`);
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        }
        fetchProducts();
    }, []);

    // Fetch carrito al cargar el componente
    useEffect(() => {
        async function fetchCart() {
            try {
                const response = await axios.get(`${API_URL}/cart`);
                setCart(response.data);
            } catch (error) {
                console.error('Error fetching cart:', error);
            }
        }
        fetchCart();
    }, []);

    // Función para buscar un producto por ID
    const searchById = async () => {
        try {
            const response = await axios.get(`${API_URL}/products/${searchId}`);
            setSearchedProduct(response.data); // Guardamos el producto encontrado
        } catch (error) {
            console.error('Error fetching product by ID:', error);
            setSearchedProduct(null); // Si no se encuentra, limpiamos la búsqueda
        }
    };

    // Función para agregar al carrito
    const addToCart = async (productId) => {
        try {
            const response = await axios.post(`${API_URL}/cart/${productId}`);
            setCart([...cart, response.data]);
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    };

    // Función para marcar como comprado
    const markAsPurchased = async (productId) => {
        try {
            await axios.put(`${API_URL}/cart/${productId}`);
            setCart(cart.map(item =>
                item.id === productId ? { ...item, isPurchased: true } : item
            ));
        } catch (error) {
            console.error('Error marking product as purchased:', error);
        }
    };

    // Función para eliminar del carrito
    const removeFromCart = async (productId) => {
        try {
            await axios.delete(`${API_URL}/cart/delete/${productId}`);
            setCart(cart.filter(item => item.id !== productId));
        } catch (error) {
            console.error('Error removing product from cart:', error);
        }
    };

    return (
        <div>
            <h1>Lista de Compras</h1>

            {/* Sección de búsqueda por ID */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Buscar por ID"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                />
                <button onClick={searchById}>Buscar</button>
            </div>

            {/* Mostrar producto encontrado por ID */}
            {searchedProduct && (
                <div className="searched-product">
                    <h2>Producto Encontrado</h2>
                    <div className="product-card">
                        <img src={searchedProduct.image} alt={searchedProduct.title} className="product-image" />
                        <div className="product-details">
                            <h3>{searchedProduct.title}</h3>
                            <p>Price: ${searchedProduct.price}</p>
                            <button onClick={() => addToCart(searchedProduct.id)}>Agregar al carrito</button>
                        </div>
                    </div>
                </div>
            )}

            <h2>Productos Disponibles</h2>
            <ul className="product-list">
                {products.map(product => (
                    <li key={product.id} className="product-card">
                        <img src={product.image} alt={product.title} className="product-image" />
                        <div className="product-details">
                            <h3>{product.title}</h3>
                            <p>Price: ${product.price}</p>
                            <button onClick={() => addToCart(product.id)}>Agregar al carrito</button>
                        </div>
                    </li>
                ))}
            </ul>

            <h2>Carrito de Compras</h2>
            <ul className="cart-list">
                {cart.map(item => (
                    <li key={item.id} className="cart-item">
                        <img src={item.image} alt={item.title} className="cart-image" />
                        <div className="cart-details">
                            {item.isPurchased ? (
                                <span className="strike">{item.title}</span>
                            ) : (
                                <span>{item.title}</span>
                            )}
                            - ${item.price}
                            {!item.isPurchased && (
                                <button onClick={() => markAsPurchased(item.id)}>Marcar como comprado</button>
                            )}
                            <button onClick={() => removeFromCart(item.id)}>Eliminar</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ShoppingList;
