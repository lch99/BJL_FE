// ============================= 🧮 CORE CALCULATIONS ============================= //

export const calculateSubtotal = (cart = []) =>
    cart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);

export const calculateDiscount = (cart = [], discount = 0, discountType = 'fixed') => {
    const subtotal = calculateSubtotal(cart);
    return discountType === 'percentage' ? (subtotal * discount) / 100 : discount;
};

export const calculateTotal = (cart = [], discount = 0, discountType = 'fixed') =>
    calculateSubtotal(cart) - calculateDiscount(cart, discount, discountType);

export const calculateProfit = (cart = [], discount = 0, discountType = 'fixed') => {
    const grossProfit = cart.reduce(
        (sum, item) =>
            sum + (((item.price || 0) - (item.cost_price || item.cost || 0)) * (item.quantity || 0)),
        0
    );
    return grossProfit - calculateDiscount(cart, discount, discountType);
};

// ============================= 📅 SALES REPORTING ============================= //

export const getTodaySales = (transactions = []) => {
    const today = new Date().toDateString();
    return transactions
        .filter((t) => new Date(t.date || t.sale_date).toDateString() === today)
        .reduce((sum, t) => sum + (t.total || t.total_amount || 0), 0);
};

export const getTodayProfit = (transactions = []) => {
    const today = new Date().toDateString();
    return transactions
        .filter((t) => new Date(t.date || t.sale_date).toDateString() === today)
        .reduce((sum, t) => sum + (t.profit || t.total_profit || 0), 0);
};

// ============================= 📆 WEEKLY / MONTHLY ANALYTICS ============================= //

export const getWeeklySales = (transactions = []) => {
    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 6); // Last 7 days including today

    const weeklyData = {};

    for (let i = 0; i < 7; i++) {
        const date = new Date(weekAgo);
        date.setDate(weekAgo.getDate() + i);
        const key = date.toLocaleDateString('en-US', { weekday: 'short' });
        weeklyData[key] = 0;
    }

    transactions.forEach((t) => {
        const date = new Date(t.date || t.sale_date);
        if (date >= weekAgo && date <= now) {
            const key = date.toLocaleDateString('en-US', { weekday: 'short' });
            weeklyData[key] += t.total || t.total_amount || 0;
        }
    });

    return weeklyData;
};

export const getWeeklyProfit = (transactions = []) => {
    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 6);

    const weeklyData = {};

    for (let i = 0; i < 7; i++) {
        const date = new Date(weekAgo);
        date.setDate(weekAgo.getDate() + i);
        const key = date.toLocaleDateString('en-US', { weekday: 'short' });
        weeklyData[key] = 0;
    }

    transactions.forEach((t) => {
        const date = new Date(t.date || t.sale_date);
        if (date >= weekAgo && date <= now) {
            const key = date.toLocaleDateString('en-US', { weekday: 'short' });
            weeklyData[key] += t.profit || t.total_profit || 0;
        }
    });

    return weeklyData;
};

export const getMonthlySales = (transactions = []) => {
    const monthlyData = {};

    transactions.forEach((t) => {
        const date = new Date(t.date || t.sale_date);
        const key = date.toLocaleDateString('en-US', { month: 'short' });
        monthlyData[key] = (monthlyData[key] || 0) + (t.total || t.total_amount || 0);
    });

    return monthlyData;
};

export const getMonthlyProfit = (transactions = []) => {
    const monthlyData = {};

    transactions.forEach((t) => {
        const date = new Date(t.date || t.sale_date);
        const key = date.toLocaleDateString('en-US', { month: 'short' });
        monthlyData[key] = (monthlyData[key] || 0) + (t.profit || t.total_profit || 0);
    });

    return monthlyData;
};

// ============================= 🧱 INVENTORY GROUPING ============================= //

export const getProductsByBrand = (products) => {
    return products.reduce((groups, product) => {
        const brand =
            product.model_info?.brand ||
            product.brand ||
            'Unknown Brand';

        if (!groups[brand]) groups[brand] = [];
        groups[brand].push(product);
        return groups;
    }, {});
};

export const getAccessoriesBySubcategory = (products = []) => {
    const subcategoryGroups = {};
    products
        .filter((p) => p.category === 'Accessories')
        .forEach((product) => {
            const sub = product.subcategory || product.type || 'Other';
            if (!subcategoryGroups[sub]) subcategoryGroups[sub] = [];
            subcategoryGroups[sub].push(product);
        });
    return subcategoryGroups;
};

// ============================= 🔧 REPAIRS ============================= //

export const getRepairsByStatus = (repairs = []) => {
    const statusGroups = {};
    repairs.forEach((r) => {
        const status = r.repair_status || 'pending';
        if (!statusGroups[status]) statusGroups[status] = [];
        statusGroups[status].push(r);
    });
    return statusGroups;
};

// ============================= 🔍 FILTERING ============================= //

export const filterProducts = (products = [], searchTerm = '', selectedCategory = 'All') => {
    const term = searchTerm.toLowerCase();
    return products.filter((p) => {
        const matchesSearch =
            p.name?.toLowerCase().includes(term) ||
            p.sku?.toLowerCase().includes(term) ||
            p.brand?.toLowerCase().includes(term) ||
            p.model?.toLowerCase().includes(term);
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });
};
