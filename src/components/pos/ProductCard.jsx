import React from 'react';

const ProductCard = ({ product, onAdd }) => {
    const isOutOfStock = product.quantity === 0;
    const isLowStock = product.quantity < 10 && product.quantity > 0;

    return (
        <button
            onClick={() => onAdd(product)}
            disabled={isOutOfStock}
            className={`p-4 rounded-2xl border-2 transition-all transform hover:scale-[1.03] duration-200
                ${isOutOfStock
                ? 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-60'
                : 'border-amber-100 bg-white hover:border-orange-400 hover:shadow-lg'}
            `}
        >
            <div className="text-4xl mb-2">{product.image || '📱'}</div>
            <div className="font-semibold text-sm mb-1 text-gray-800 line-clamp-2">
                {product.name}
            </div>

            {product.storage && (
                <div className="text-xs text-gray-500">{product.storage}</div>
            )}
            {product.color && (
                <div className="text-xs text-gray-400 mb-2">{product.color}</div>
            )}

            <div className="text-lg font-bold text-orange-600">
                ${product.sell_price}
            </div>

            <div
                className={`text-xs mt-2 font-medium ${
                    isOutOfStock
                        ? 'text-red-500'
                        : isLowStock
                            ? 'text-orange-500'
                            : 'text-green-600'
                }`}
            >
                {isOutOfStock
                    ? '⚠️ Out of Stock'
                    : `✓ ${product.quantity} in stock`}
            </div>
        </button>
    );
};

export default ProductCard;
