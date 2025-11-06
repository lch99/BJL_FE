// ========================= 🛒 CART MANAGEMENT ========================= //

// Add a product to cart
export const addToCart = (cart = [], product = {}) => {
    if (!product || product.stock <= 0) return cart; // no stock

    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        // only increase if stock allows
        if (existing.quantity < product.stock) {
            return cart.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        }
        return cart; // limit reached
    }

    // add as new item
    return [...cart, { ...product, quantity: 1 }];
};

// Update item quantity safely
export const updateQuantity = (cart = [], products = [], id, newQty) => {
    const product = products.find(p => p.id === id);
    if (!product) return cart;

    if (newQty <= 0) {
        // remove item when quantity hits zero
        return cart.filter(item => item.id !== id);
    }

    if (newQty > product.stock) {
        // prevent exceeding stock
        return cart;
    }

    return cart.map(item =>
        item.id === id ? { ...item, quantity: newQty } : item
    );
};

// Remove a specific item
export const removeFromCart = (cart = [], id) => {
    return cart.filter(item => item.id !== id);
};

// Clear everything and reset customer session
export const clearCart = () => ({
    cart: [],
    discount: 0,
    discountType: 'fixed',
    customerName: '',
    customerPhone: '',
});
