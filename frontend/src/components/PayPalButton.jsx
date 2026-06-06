import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
const API_URL = 'https://nurture-orphan-api.onrender.com/api';
const PayPalButton = ({ amount, onSuccess, onError }) => {
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  const createOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/paypal/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount })
      });
      
      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('Error:', error);
      onError?.(error);
    }
  };

  const onApprove = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/paypal/capture-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderId: data.orderID })
      });
      
      const result = await response.json();
      if (result.success) {
        onSuccess?.(result);
      }
    } catch (error) {
      console.error('Error:', error);
      onError?.(error);
    }
  };

  if (!clientId) return <div>Loading PayPal...</div>;

  return (
    <PayPalScriptProvider options={{ clientId, currency: "USD" }}>
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
        style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay' }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
