import React from 'react';
import { Wrench, Package, Smartphone } from 'lucide-react';

const ProductCard = ({ product, onAdd }) => {
    // Determine product type
    const isRepair = product.category === 'Repairs';
    const isOutOfStock = !isRepair && product.quantity === 0;
    const isLowStock = !isRepair && product.quantity > 0 && product.quantity < 10;

    // Extract info
    const brand = product.model_info?.brand || product.brand || 'Unknown';
    const model = product.model_info?.model_name || product.model_name || product.name || 'Unnamed';
    const price = parseFloat(product.sell_price || product.price || 0);

    // Choose icon based on product type
    const Icon = isRepair ? Wrench : Smartphone;

    return (
        <button
            onClick={() => !isRepair && !isOutOfStock && onAdd(product)}
            disabled={isOutOfStock || isRepair}
            className={`p-4 rounded-2xl border-2 transition-all transform hover:scale-[1.03] duration-200 shadow-sm
                ${isOutOfStock || isRepair
                ? 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-60'
                : 'border-amber-100 bg-white hover:border-orange-400 hover:shadow-lg'}
            `}
        >
            {/* Icon */}
            <div className="mb-2 flex justify-center">
                <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-orange-500" />
                </div>
            </div>

            {/* Name */}
            <div className="font-semibold text-sm mb-1 text-gray-800 text-center line-clamp-2">
                {brand} {model}
            </div>

            {/* Details */}
            <div className="text-xs text-gray-500 text-center">
                {product.color && <span>{product.color}</span>}
                {product.storage && <span> • {product.storage}GB</span>}
                {product.ram && <span> • {product.ram}GB RAM</span>}
            </div>

            {/* Price */}
            <div className="text-lg font-bold text-orange-600 mt-1 text-center">
                RM {price.toFixed(2)}
            </div>

            {/* Stock / Status */}
            <div
                className={`text-xs mt-2 font-medium text-center ${
                    isRepair
                        ? product.status === 'completed'
                            ? 'text-green-600'
                            : product.status === 'in_progress'
                                ? 'text-orange-500'
                                : 'text-gray-500'
                        : isOutOfStock
                            ? 'text-red-500'
                            : isLowStock
                                ? 'text-orange-500'
                                : 'text-green-600'
                }`}
            >
                {isRepair
                    ? `🔧 ${product.status?.replace('_', ' ') || 'Pending'}`
                    : isOutOfStock
                        ? '⚠️ Out of Stock'
                        : `✓ ${product.quantity} in stock`}
            </div>
        </button>
    );
};

export default ProductCard;
