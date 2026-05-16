import React, { useState } from "react";
import { Search, Package, MapPin, ChevronRight, RotateCcw, Truck, CheckCircle, Clock, ExternalLink } from "lucide-react";
import BRAND_THEME from "@/config/brandTheme";
import AnimatedPage from "@food/components/user/AnimatedPage";

const Orders = () => {
  const { tokens } = BRAND_THEME;
  const [activeTab, setActiveTab] = useState("Upcoming");

  const orders = {
    Upcoming: [
      {
        id: "DMB-82731",
        title: "Weekly Polish Comfort Plan",
        status: "In Transit",
        items: "2x Lunch Boxes",
        eta: "1:15 PM",
        address: "15th Ave, Warsaw, PL",
        price: "45.00 PLN",
        image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=200",
        trackingLink: "/food/user/orders/tracking/123"
      }
    ],
    Past: [
      {
        id: "DMB-82600",
        title: "Traditional Pierogi Dinner",
        status: "Delivered",
        date: "May 14, 2026",
        items: "1x Large Pierogi Box",
        price: "38.00 PLN",
        image: "https://images.unsplash.com/photo-1626244463372-2396160376d4?auto=format&fit=crop&q=80&w=200",
        refundStatus: "None"
      },
      {
        id: "DMB-82550",
        title: "Chef's Surprise Box",
        status: "Cancelled",
        date: "May 12, 2026",
        items: "1x Weekly Box",
        price: "350.00 PLN",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=200",
        refundStatus: "Refunded"
      }
    ]
  };

  return (
    <AnimatedPage>
      <div className={`min-h-screen ${tokens.app.pageBackground} pb-24`}>
        {/* Header */}
        <div className="px-4 pt-8 pb-4">
          <h1 className={`text-2xl font-bold ${tokens.app.primaryText} mb-6`}>My Orders</h1>
          
          <div className="flex gap-2 p-1 bg-[#F5F5F0] rounded-2xl border border-gray-100">
            {["Upcoming", "Past"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab
                    ? "bg-white text-[#1F7A63] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="px-4 space-y-4">
          {orders[activeTab].map((order) => (
            <div key={order.id} className="bg-white rounded-3xl p-5 border border-gray-50 shadow-sm hover:shadow-md transition-all">
               <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-[#F5F5F0] flex items-center justify-center text-[#1F7A63]">
                       <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{order.id}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Order ID</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                    order.status === "Delivered" ? "bg-green-100 text-green-600" :
                    order.status === "Cancelled" ? "bg-red-100 text-red-600" :
                    "bg-[#1F7A63]/10 text-[#1F7A63]"
                  }`}>
                    {order.status}
                  </div>
               </div>

               <div className="flex gap-4 mb-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                    <img src={order.image} alt={order.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1 leading-tight">{order.title}</h3>
                    <p className="text-xs text-gray-500 mb-1">{order.items}</p>
                    <p className="text-xs font-bold text-[#1F7A63]">{order.price}</p>
                  </div>
               </div>

               {activeTab === "Upcoming" ? (
                 <div className="bg-[#F5F5F0] rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                         <Truck className="h-4 w-4 text-[#1F7A63]" />
                         <span className="text-xs font-bold text-gray-700">Estimated Arrival: {order.eta}</span>
                      </div>
                    </div>
                    <button className="w-full py-3 bg-[#1F7A63] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#165948] transition-all">
                       Track Live <ExternalLink className="h-4 w-4" />
                    </button>
                 </div>
               ) : (
                 <div className="flex items-center justify-between pt-2">
                   <div className="flex items-center gap-4">
                     <button className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#1F7A63]">
                       <RotateCcw className="h-3.5 w-3.5" /> Reorder
                     </button>
                     {order.refundStatus !== "None" && (
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#1F7A63] bg-[#1F7A63]/5 px-2 py-1 rounded-md">
                          <CheckCircle className="h-3 w-3" /> {order.refundStatus}
                        </div>
                     )}
                   </div>
                   <button className="p-2 hover:bg-gray-50 rounded-full">
                     <ChevronRight className="h-5 w-5 text-gray-400" />
                   </button>
                 </div>
               )}
            </div>
          ))}
        </div>

        {/* Empty State Mockup */}
        {orders[activeTab].length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
             <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-gray-300" />
             </div>
             <h3 className="font-bold text-gray-900 mb-2">No orders found</h3>
             <p className="text-sm text-gray-500">You haven't placed any orders in this category yet.</p>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};

export default Orders;
