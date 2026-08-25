import React from 'react';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-[calc(100vh-5rem)] overflow-hidden flex flex-col items-center justify-center bg-[#fdfaf6] p-6 font-sans">
      
      {/* Success Icon */}
      <div className="bg-[#12c669] rounded-full p-4 mb-5 shadow-sm">
        <Check className="text-white" size={36} strokeWidth={4} />
      </div>

      {/* Heading */}
      <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
        Order Placed!
      </h1>

      {/* Subtext */}
      <p className="text-gray-500 text-center text-sm md:text-base max-w-md mb-8 leading-relaxed">
        Thank you for your purchase. Your order is being prepared. You can track your order status in the "My Orders" section.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => navigate("/account")}
          className="bg-[#fc5a32] hover:bg-[#e84c25] text-white font-medium py-3 px-8 rounded-lg transition duration-200 shadow-sm"
        >
          Back to my orders
        </button>
        <button
          onClick={() => navigate("/")}
          className="border border-[#fc5a32] text-[#fc5a32] hover:bg-[#fff0eb] font-medium py-3 px-8 rounded-lg transition duration-200"
        >
          Back to home
        </button>
      </div>

    </div>
  );
};

export default OrderSuccess;