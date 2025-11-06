// ========================= 📱 PRODUCT UTILITIES ========================= //

// Group all phones by brand
export const getProductsByBrand = (products = []) => {
    const brandGroups = {};

    products
        .filter(p => p.category === 'Phones')
        .forEach(product => {
            const brand = product.brand || 'Unknown';
            if (!brandGroups[brand]) brandGroups[brand] = [];
            brandGroups[brand].push(product);
        });

    return brandGroups;
};

// Group all accessories by subcategory
export const getAccessoriesBySubcategory = (products = []) => {
    const subcategoryGroups = {};

    products
        .filter(p => p.category === 'Accessories')
        .forEach(product => {
            const subcategory = product.subcategory || 'Other';
            if (!subcategoryGroups[subcategory]) subcategoryGroups[subcategory] = [];
            subcategoryGroups[subcategory].push(product);
        });

    return subcategoryGroups;
};

// Filter products by keyword and category
export const filterProducts = (products = [], searchTerm = '', selectedCategory = 'All') => {
    const lowerSearch = searchTerm.toLowerCase();

    return products.filter(p => {
        const name = p.name?.toLowerCase() || '';
        const sku = p.sku?.toLowerCase() || '';
        const brand = p.brand?.toLowerCase() || '';
        const category = p.category || '';

        const matchesSearch =
            name.includes(lowerSearch) ||
            sku.includes(lowerSearch) ||
            brand.includes(lowerSearch);

        const matchesCategory = selectedCategory === 'All' || category === selectedCategory;

        return matchesSearch && matchesCategory;
    });
};
