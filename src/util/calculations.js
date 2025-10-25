export const calculateSubtotal = (cart) => {
    return cart.reduce((sum, item) => sum + (item.sell_price * item.quantity), 0);
};

export const calculateDiscount = (cart, discount, discountType) => {
    const subtotal = calculateSubtotal(cart);
    if (discountType === 'percentage') {
        return (subtotal * discount) / 100;
    }
    return discount;
};

export const calculateTotal = (cart, discount, discountType) => {
    return calculateSubtotal(cart) - calculateDiscount(cart, discount, discountType);
};

export const calculateProfit = (cart, discount, discountType) => {
    const profit = cart.reduce((sum, item) => sum + ((item.price - item.cost) * item.quantity), 0);
    return profit - calculateDiscount(cart, discount, discountType);
};

export const getTodaySales = (transactions) => {
    const today = new Date().toDateString();
    return transactions
        .filter(t => new Date(t.date).toDateString() === today)
        .reduce((sum, t) => sum + t.total, 0);
};

export const getTodayProfit = (transactions) => {
    const today = new Date().toDateString();
    return transactions
        .filter(t => new Date(t.date).toDateString() === today)
        .reduce((sum, t) => sum + t.profit, 0);
};

export const getProductsByBrand = (products) => {
    const brandGroups = {};
    products.filter(p => p.category === 'Phones').forEach(product => {
        if (!brandGroups[product.brand]) {
            brandGroups[product.brand] = [];
        }
        brandGroups[product.brand].push(product);
    });
    return brandGroups;
};

export const getAccessoriesBySubcategory = (products) => {
    const subcategoryGroups = {};
    products.filter(p => p.category === 'Accessories').forEach(product => {
        const sub = product.subcategory || 'Other';
        if (!subcategoryGroups[sub]) {
            subcategoryGroups[sub] = [];
        }
        subcategoryGroups[sub].push(product);
    });
    return subcategoryGroups;
};

export const filterProducts = (products, searchTerm, selectedCategory) => {
    return products.filter(p => {
        const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.brand?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });
};