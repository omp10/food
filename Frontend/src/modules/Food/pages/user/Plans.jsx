import React, { useState } from "react";
import { Search, Filter, Star, Sparkles, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import BRAND_THEME from "@/config/brandTheme";
import AnimatedPage from "@food/components/user/AnimatedPage";

const Plans = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const { tokens } = BRAND_THEME;

  const filters = ["All", "Weekly", "Monthly", "Family", "Healthy", "Vegetarian"];

  const plans = [
    {
      id: 1,
      title: "Essential Polish Home Cooked",
      type: "Monthly Subscription",
      price: "1200 PLN",
      meals: "20 Meals/Month",
      rating: 4.8,
      reviews: 124,
      image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800",
      vendor: "Mama's Kitchen Warsaw",
      isSurprise: false,
    },
    {
      id: 2,
      title: "Chef's Surprise Box",
      type: "Weekly Discovery",
      price: "350 PLN",
      meals: "5 Mystery Meals",
      rating: 4.9,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800",
      vendor: "Warsaw Cloud Kitchen",
      isSurprise: true,
    },
    {
      id: 3,
      title: "High-Protein Fitness Plan",
      type: "2-Week Intense",
      price: "650 PLN",
      meals: "14 Meals",
      rating: 4.7,
      reviews: 210,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800",
      vendor: "FitFeast Bistro",
      isSurprise: false,
    }
  ];

  return (
    <AnimatedPage>
      <div className={`min-h-screen ${tokens.app.pageBackground} pb-24`}>
        {/* Header */}
        <div className="px-4 pt-8 pb-4">
          <h1 className={`text-3xl font-bold ${tokens.app.primaryText} mb-2`}>
            Meal Plans
          </h1>
          <p className={`${tokens.app.secondaryText} text-sm`}>
            Connect with local cooks and discovery your perfect subscription.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="px-4 mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for plans or vendors..."
              className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-white border ${tokens.app.border} focus:ring-2 focus:ring-[#1F7A63] outline-none transition-all`}
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                  activeFilter === filter
                    ? "bg-[#1F7A63] text-white"
                    : "bg-white text-gray-600 border border-gray-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Surprise Box Widget */}
        <div className="px-4 mb-8">
          <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-[#1F7A63] to-[#165948] text-white shadow-xl">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-yellow-300" />
                <span className="text-xs font-bold uppercase tracking-wider text-yellow-300">New Feature</span>
              </div>
              <h2 className="text-xl font-bold mb-2">The Surprise Box</h2>
              <p className="text-sm text-white/80 mb-4 max-w-[200px]">
                Let our top chefs choose your weekly menu. Unbox excitement!
              </p>
              <button className="px-5 py-2.5 bg-white text-[#1F7A63] rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all">
                Try Now <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-[-40px] right-[20px] w-32 h-32 bg-[#F5F5F0]/10 rounded-full blur-2xl" />
            <Zap className="absolute right-6 bottom-6 h-12 w-12 text-white/20" />
          </div>
        </div>

        {/* Plans Grid */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-bold ${tokens.app.primaryText}`}>Featured Plans</h3>
            <span className="text-sm text-[#1F7A63] font-medium">View all</span>
          </div>

          <div className="space-y-4">
            {plans.map((plan) => (
              <div key={plan.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="relative h-48">
                  <img src={plan.image} alt={plan.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-bold text-gray-800">{plan.rating}</span>
                  </div>
                  {plan.isSurprise && (
                    <div className="absolute top-4 left-4 bg-[#1F7A63] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      Surprise Box
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1 leading-tight">{plan.title}</h4>
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-[#1F7A63]" />
                        <span className="text-xs text-gray-500 font-medium">{plan.vendor}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Starts from</span>
                      <span className="text-lg font-bold text-[#1F7A63]">{plan.price}</span>
                    </div>
                    <button className="px-6 py-2 bg-[#F5F5F0] text-[#2B2B2B] rounded-xl text-sm font-bold hover:bg-gray-200 transition-all">
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Plans;
