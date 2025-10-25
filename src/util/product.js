// Group phones by brand
export const getProductsByBrand = (products) => {
    const brandGroups = {};
    products.filter(p => p.category === 'Phones').forEach(product => {
        if (!brandGroups[product.brand]) brandGroups[product.brand] = [];
        brandGroups[product.brand].push(product);
    });
    return brandGroups;
};

// Group accessories by subcategory
export const getAccessoriesBySubcategory = (products) => {
    const subcategoryGroups = {};
    products.filter(p => p.category === 'Accessories').forEach(product => {
        const sub = product.subcategory || 'Other';
        if (!subcategoryGroups[sub]) subcategoryGroups[sub] = [];
        subcategoryGroups[sub].push(product);
    });
    return subcategoryGroups;
};

// Filter products by search term and category
export const filterProducts = (products, searchTerm, selectedCategory) => {
    return products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.brand?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });
};
