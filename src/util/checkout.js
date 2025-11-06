// ========================= 💳 PAYMENT HANDLERS ========================= //

// Trigger payment modal with pre-filled total
export const initiatePayment = (cart, calculateTotal, setShowPaymentModal, setReceivedAmount) => {
    if (!cart?.length) return;
    setShowPaymentModal(true);
    setReceivedAmount(calculateTotal().toFixed(2));
};

// Complete the sale process
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
    if (!cart?.length) {
        alert('No items in cart.');
        return;
    }

    const total = calculateTotal();
    const received = parseFloat(receivedAmount) || 0;

    if (received < total) {
        alert('Received amount is less than total!');
        return;
    }

    // Generate transaction record
    const transaction = {
        id: `TXN-${Date.now()}`,
        date: new Date().toISOString(),
        customer: customerName?.trim() || 'Walk-in Customer',
        phone: customerPhone?.trim() || 'N/A',
        items: cart.map(item => ({ ...item })),
        subtotal: calculateSubtotal(),
        discount: calculateDiscount(),
        total,
        profit: calculateProfit(),
        paymentMethod,
        receivedAmount: received,
        change: parseFloat((received - total).toFixed(2)),
    };

    // Adjust product stock
    const updatedProducts = products.map(p => {
        const cartItem = cart.find(c => c.id === p.id);
        return cartItem
            ? { ...p, stock: Math.max(0, p.stock - cartItem.quantity) }
            : p;
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
