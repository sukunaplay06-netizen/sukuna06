import { useState } from 'react';
import api from '../api/axios';

function loadRazorpayScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function PurchaseAll() {
  const [loading, setLoading] = useState(false);

  const handlePayAll = async () => {
    setLoading(true);

    const isLoaded = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!isLoaded) {
      alert('Razorpay SDK failed to load.');
      setLoading(false);
      return;
    }

    try {
      // Create order from backend
      const orderRes = await api.post('/courses/purchase-all/create-order', {
        affiliateId: localStorage.getItem('ref') || null,
      });

      const { id: order_id, amount, key } = orderRes.data;

      const options = {
        key,
        amount,
        currency: 'INR',
        name: "Leadsgurukul",
        description: "All Courses Access - Leadsgurukul",

        order_id,
        handler: async function (response) {
          try {
            const verifyRes = await api.post('/courses/purchase-all/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              affiliateId: localStorage.getItem('ref') || null,
              amount,
            });

            if (verifyRes.data.success) {
              alert('🎉 Payment successful! You are now enrolled in all courses.');
            } else {
              alert('❌ Payment verification failed.');
            }
          } catch (error) {
            console.error('Verification error:', error);
            alert('❌ An error occurred during verification.');
          }
        },
        prefill: {
          name: 'Your Name',
          email: 'user@example.com',
        },
        theme: {
          color: '#4f46e5',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Order creation error:', err);
      alert('❌ Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Buy All Courses</h1>
      <p className="mb-6 text-gray-700">Get access to every course available on the platform.</p>
      <button
        onClick={handlePayAll}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg disabled:opacity-60"
      >
        {loading ? 'Processing...' : 'Purchase All'}
      </button>
    </div>
  );
}

export default PurchaseAll;



