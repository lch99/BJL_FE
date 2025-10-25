export const addToCart = (cart, product) => {
    if (product.stock === 0) return cart;

    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        if (existing.quantity < product.stock) {
            return cart.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        }
        return cart; // stock limit reached
    } else {
        return [...cart, { ...product, quantity: 1 }];
    }
};

export const updateQuantity = (cart, products, id, newQty) => {
    const product = products.find(p => p.id === id);
    if (!product) return cart;

    if (newQty <= 0) {
        return cart.filter(item => item.id !== id);
    } else if (newQty <= product.stock) {
        return cart.map(item =>
            item.id === id ? { ...item, quantity: newQty } : item
        );
    }
    return cart;
};

export const removeFromCart = (cart, id) => {
    return cart.filter(item => item.id !== id);
};

export const clearCart = () => {
    return {
        cart: [],
        discount: 0,
        customerName: '',
        customerPhone: ''
    };
};
