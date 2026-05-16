import React from "react";
import { 
  Bell, 
  MapPin, 
  Search, 
  TrendingUp, 
  Clock, 
  Package, 
  Plus, 
  ChevronRight, 
  Crown, 
  Gift, 
  Zap,
  ArrowRight
} from "lucide-react";
import BRAND_THEME from "@/config/brandTheme";
import AnimatedPage from "@food/components/user/AnimatedPage";

// Demo Images
import kompotImg from "@food/assets/demo/kompot.png";
import pierogiImg from "@food/assets/demo/pierogi.png";
import dessertImg from "@food/assets/demo/dessert.png";
import corporateImg from "@food/assets/demo/corporate.png";
import giftImg from "@food/assets/demo/gift.png";

const Home = () => {
  const { tokens } = BRAND_THEME;

  const quickActions = [
    { label: "New Plan", icon: Plus, color: "bg-blue-100 text-blue-600" },
    { label: "Track", icon: Clock, color: "bg-orange-100 text-orange-600" },
    { label: "Rewards", icon: Gift, color: "bg-purple-100 text-purple-600" },
    { label: "Add-ons", icon: Zap, color: "bg-yellow-100 text-yellow-600" },
  ];

  return (
    <AnimatedPage>
      <div className={`min-h-screen ${tokens.app.pageBackground} pb-24`}>
        {/* Top Navigation / Status Bar */}
        <div className="px-4 pt-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1F7A63] flex items-center justify-center text-white font-bold">
              OP
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Warsaw, PL</p>
              <div className="flex items-center gap-1">
                <h2 className="font-bold text-gray-900">Hi, Ompar</h2>
                <MapPin className="h-3 w-3 text-[#1F7A63]" />
              </div>
            </div>
          </div>
          <button className="relative p-2.5 bg-white rounded-xl shadow-sm border border-gray-100">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>

        {/* Dashboard Search */}
        <div className="px-4 mb-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#1F7A63] transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Hungry for something home-cooked?"
              className="block w-full pl-11 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#1F7A63] focus:border-transparent outline-none transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Next Delivery Card */}
        <div className="px-4 mb-8">
          <div className="relative overflow-hidden bg-[#2B2B2B] rounded-3xl p-6 text-white shadow-xl">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#1F7A63] flex items-center justify-center">
                    <Package className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-widest text-[#1F7A63]">Next Delivery</span>
                </div>
                <span className="text-xs bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">In 2h 15m</span>
              </div>
              <h3 className="text-xl font-bold mb-1">Traditional Polish Lunch</h3>
              <p className="text-sm text-gray-400 mb-6 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> 12:30 PM - 1:30 PM • 15th Ave, Warsaw
              </p>
              <div className="flex items-center justify-between">
                 <div className="flex -space-x-3">
                   <img src="https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=100" className="w-10 h-10 rounded-full border-2 border-[#2B2B2B] object-cover" />
                   <div className="w-10 h-10 rounded-full border-2 border-[#2B2B2B] bg-[#1F7A63] flex items-center justify-center text-[10px] font-bold">
                     +2
                   </div>
                 </div>
                 <button className="px-5 py-2.5 bg-[#1F7A63] text-white rounded-xl text-sm font-bold hover:bg-[#165948] transition-all flex items-center gap-2">
                   Live Track <ArrowRight className="h-4 w-4" />
                 </button>
              </div>
            </div>
            {/* Background elements */}
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-[#1F7A63]/20 rounded-full blur-3xl"></div>
            <div className="absolute top-0 right-0 p-2 opacity-5">
               <TrendingUp className="h-32 w-32" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 mb-8">
           <div className="flex items-center justify-between mb-4">
             <h3 className="font-bold text-gray-900">Quick Actions</h3>
             <ChevronRight className="h-4 w-4 text-gray-400" />
           </div>
           <div className="grid grid-cols-4 gap-4">
             {quickActions.map((action) => (
               <div key={action.label} className="flex flex-col items-center gap-2">
                 <button className={`w-14 h-14 rounded-2xl ${action.color} flex items-center justify-center shadow-sm hover:scale-105 transition-transform`}>
                   <action.icon className="h-6 w-6" />
                 </button>
                 <span className="text-[11px] font-bold text-gray-600">{action.label}</span>
               </div>
             ))}
           </div>
        </div>

        {/* Loyalty Widget */}
        <div className="px-4 mb-8">
           <div className="bg-gradient-to-br from-[#F5F5F0] to-white rounded-3xl p-6 border border-[#1F7A63]/10 relative overflow-hidden">
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center border border-gray-50">
                   <Crown className="h-8 w-8 text-yellow-500" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 leading-tight">MealBox Elite</h4>
                  <p className="text-xs text-gray-500 mb-2">340 points to Silver Tier</p>
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-2/3 h-full bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="absolute right-[-10px] top-[-10px] opacity-10">
                 <Crown className="h-24 w-24" />
              </div>
           </div>
        </div>

        {/* Top Tiffin Providers */}
        <div className="px-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Top Tiffin Providers</h3>
            <span className="text-sm text-[#1F7A63] font-bold">View all</span>
          </div>
          <div className="space-y-4">
             {[
               { 
                 name: "Warsaw Home Bites", 
                 rating: "4.9", 
                 cuisine: "Traditional Polish", 
                 price: "25 PLN/meal", 
                 img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400",
                 tags: ["High Protein", "Monthly"]
               },
               { 
                 name: "Bistro Vistula", 
                 rating: "4.7", 
                 cuisine: "Modern European", 
                 price: "32 PLN/meal", 
                 img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=400",
                 tags: ["Vegan", "Weekly"]
               }
             ].map((provider, idx) => (
               <div key={idx} className="bg-white rounded-3xl p-4 border border-gray-50 shadow-sm flex gap-4 hover:shadow-md transition-all">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                    <img src={provider.img} alt={provider.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                     <div>
                        <div className="flex items-center justify-between mb-1">
                           <h4 className="font-bold text-gray-900 text-sm">{provider.name}</h4>
                           <div className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3 text-green-500" />
                              <span className="text-[10px] font-bold text-gray-400">{provider.rating}</span>
                           </div>
                        </div>
                        <p className="text-[10px] text-gray-500 font-medium mb-2">{provider.cuisine} • {provider.price}</p>
                        <div className="flex gap-1">
                           {provider.tags.map(tag => (
                             <span key={tag} className="text-[8px] px-2 py-0.5 bg-[#F5F5F0] text-[#1F7A63] rounded-full font-bold">{tag}</span>
                           ))}
                        </div>
                     </div>
                     <button className="mt-2 text-left text-[10px] font-bold text-[#1F7A63] flex items-center gap-1">
                        View Menu <ChevronRight className="h-3 w-3" />
                     </button>
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* Quick Add-ons Section */}
        <div className="px-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Popular Add-ons</h3>
            <span className="text-sm text-[#1F7A63] font-bold">See all</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
             {[
               { name: "Polish Kompot", price: "12 PLN", img: kompotImg },
               { name: "Extra Pierogi", price: "15 PLN", img: pierogiImg },
               { name: "Dessert Cake", price: "18 PLN", img: dessertImg }
             ].map((item, idx) => (
               <div key={idx} className="flex-shrink-0 w-40 bg-white rounded-2xl border border-gray-50 shadow-sm overflow-hidden">
                  <div className="h-28 w-full relative">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                    <button className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center text-[#1F7A63] hover:bg-[#1F7A63] hover:text-white transition-all">
                       <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="p-3">
                    <h5 className="text-xs font-bold text-gray-900 truncate">{item.name}</h5>
                    <p className="text-xs text-[#1F7A63] font-bold mt-1">{item.price}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* Explore More Categories */}
        <div className="px-4 pb-12">
           <h3 className="font-bold text-gray-900 mb-4">Explore More</h3>
           <div className="grid grid-cols-2 gap-4">
              <div className="relative overflow-hidden bg-[#1F7A63]/5 p-4 rounded-3xl border border-[#1F7A63]/10 h-32 flex flex-col justify-end">
                 <img src={corporateImg} className="absolute inset-0 w-full h-full object-cover opacity-20" alt="Corporate" />
                 <div className="relative z-10">
                   <h4 className="font-bold text-[#1F7A63] text-sm mb-1">Corporate Plans</h4>
                   <p className="text-[10px] text-gray-500 font-bold">Team Meals</p>
                 </div>
              </div>
              <div className="relative overflow-hidden bg-orange-50 p-4 rounded-3xl border border-orange-100 h-32 flex flex-col justify-end">
                 <img src={giftImg} className="absolute inset-0 w-full h-full object-cover opacity-20" alt="Gift" />
                 <div className="relative z-10">
                   <h4 className="font-bold text-orange-600 text-sm mb-1">Gift a Box</h4>
                   <p className="text-[10px] text-gray-500 font-bold">Share Love</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Home;
