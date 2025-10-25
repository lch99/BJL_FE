export const initiatePayment = (cart, calculateTotal, setShowPaymentModal, setReceivedAmount) => {
    if (cart.length === 0) return;
    setShowPaymentModal(true);
    setReceivedAmount(calculateTotal().toFixed(2));
};

export const completeSale = ({
                                 cart,
                                 products,
                                 transactions,
                                 customerName,
                                 customerPhone,
                                 paymentMethod,
                                 receivedAmount,
                                 calculateSubtotal,
                                 calculateDiscount,
                                 calculateTotal,
                                 calculateProfit,
                                 setProducts,
                                 setTransactions,
                                 setLastReceipt,
                                 clearCart,
                                 setShowPaymentModal,
                                 setShowReceiptModal
                             }) => {
    const total = calculateTotal();
    const received = parseFloat(receivedAmount) || 0;

    if (received < total) {
        alert('Received amount is less than total!');
        return;
    }

    const transaction = {
        id: `TXN-${Date.now()}`,
        date: new Date().toISOString(),
        customer: customerName || 'Walk-in Customer',
        phone: customerPhone || 'N/A',
        items: cart.map(item => ({ ...item })),
        subtotal: calculateSubtotal(),
        discount: calculateDiscount(),
        total: total,
        profit: calculateProfit(),
        paymentMethod: paymentMethod,
        receivedAmount: received,
        change: received - total
    };

    // Update products stock
    const updatedProducts = products.map(p => {
        const cartItem = cart.find(c => c.id === p.id);
        if (cartItem) {
            return { ...p, stock: p.stock - cartItem.quantity };
        }
        return p;
    });

    // Update state
    setProducts(updatedProducts);
    setTransactions([transaction, ...transactions]);
    setLastReceipt(transaction);
    clearCart();
    setShowPaymentModal(false);
    setShowReceiptModal(true);

    return transaction;
};
