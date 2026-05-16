import React from "react";
import { 
  User, 
  Settings, 
  Heart, 
  Shield, 
  Bell, 
  CreditCard, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  Leaf, 
  Truck, 
  Crown, 
  Briefcase,
  Lock
} from "lucide-react";
import BRAND_THEME from "@/config/brandTheme";
import AnimatedPage from "@food/components/user/AnimatedPage";

const Profile = () => {
  const { tokens } = BRAND_THEME;

  const menuSections = [
    {
      title: "My Activity",
      items: [
        { label: "Elite Loyalty Program", icon: Crown, color: "text-yellow-500", detail: "Gold Tier" },
        { label: "Dietary Preferences", icon: Leaf, color: "text-green-500", detail: "Vegetarian" },
        { label: "Delivery Preferences", icon: Truck, color: "text-[#1F7A63]", detail: "Photo Proof" },
      ]
    },
    {
      title: "Settings",
      items: [
        { label: "Profile Settings", icon: User, color: "text-blue-500" },
        { label: "Payment Methods", icon: CreditCard, color: "text-purple-500" },
        { label: "B2B / Business Account", icon: Briefcase, color: "text-gray-700" },
      ]
    },
    {
      title: "Privacy & Support",
      items: [
        { label: "Data & GDPR", icon: Lock, color: "text-red-500" },
        { label: "Help & Support", icon: HelpCircle, color: "text-orange-500" },
        { label: "Terms & Privacy", icon: Shield, color: "text-slate-500" },
      ]
    }
  ];

  return (
    <AnimatedPage>
      <div className={`min-h-screen ${tokens.app.pageBackground} pb-24`}>
        {/* Profile Header */}
        <div className="px-6 pt-12 pb-8 bg-white border-b border-gray-100 rounded-b-[3rem] shadow-sm">
           <div className="flex flex-col items-center">
              <div className="relative mb-4">
                 <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1F7A63] to-[#165948] p-1 shadow-lg shadow-[#1F7A63]/20">
                    <img 
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200" 
                      className="w-full h-full rounded-full border-4 border-white object-cover" 
                      alt="Profile"
                    />
                 </div>
                 <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-100">
                    <Settings className="h-4 w-4 text-gray-600" />
                 </button>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Ompar</h2>
              <p className="text-sm text-gray-500 font-medium">ompar@dailymealbox.pl</p>
              
              <div className="flex gap-4 mt-6 w-full max-w-xs">
                 <div className="flex-1 bg-[#F5F5F0] p-3 rounded-2xl text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Orders</p>
                    <p className="text-lg font-bold text-gray-900">42</p>
                 </div>
                 <div className="flex-1 bg-[#F5F5F0] p-3 rounded-2xl text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Savings</p>
                    <p className="text-lg font-bold text-[#1F7A63]">240zł</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Menu Sections */}
        <div className="px-4 py-8 space-y-8">
           {menuSections.map((section) => (
             <div key={section.title}>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] px-2 mb-4">{section.title}</h3>
                <div className="bg-white rounded-3xl overflow-hidden border border-gray-50 shadow-sm">
                   {section.items.map((item, idx) => (
                     <button 
                       key={item.label}
                       className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                         idx !== section.items.length - 1 ? "border-b border-gray-50" : ""
                       }`}
                     >
                        <div className="flex items-center gap-4">
                           <div className={`w-10 h-10 rounded-xl bg-[#F5F5F0] flex items-center justify-center ${item.color}`}>
                              <item.icon className="h-5 w-5" />
                           </div>
                           <div className="text-left">
                              <p className="text-sm font-bold text-gray-900">{item.label}</p>
                              {item.detail && <p className="text-[10px] text-[#1F7A63] font-bold">{item.detail}</p>}
                           </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-300" />
                     </button>
                   ))}
                </div>
             </div>
           ))}

           {/* Logout Button */}
           <button className="w-full flex items-center justify-center gap-3 py-4 bg-white border border-red-50 text-red-500 rounded-3xl font-bold hover:bg-red-50 transition-all mb-4 shadow-sm">
              <LogOut className="h-5 w-5" />
              Sign Out
           </button>
           
           <div className="text-center py-4">
              <p className="text-[10px] text-gray-300 font-bold tracking-widest">DAILYMEALBOX V2.4.0</p>
           </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Profile;
