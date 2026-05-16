import React, { useState } from "react";
import { ChevronLeft, ChevronRight, SkipForward, RefreshCw, Calendar as CalendarIcon, Clock, MapPin, ChevronDown } from "lucide-react";
import BRAND_THEME from "@/config/brandTheme";
import AnimatedPage from "@food/components/user/AnimatedPage";

const Calendar = () => {
  const { tokens } = BRAND_THEME;
  const [selectedDay, setSelectedDay] = useState(1); // 0-6 for Mon-Sun

  const weekDays = [
    { name: "Mon", date: "18", id: 0 },
    { name: "Tue", date: "19", id: 1 },
    { name: "Wed", date: "20", id: 2 },
    { name: "Thu", date: "21", id: 3 },
    { name: "Fri", date: "22", id: 4 },
    { name: "Sat", date: "23", id: 5 },
    { name: "Sun", date: "24", id: 6 },
  ];

  const menuItems = [
    {
      id: 1,
      title: "Traditional Pierogi Ruskie",
      description: "Handmade potato & cheese dumplings with caramelized onions.",
      time: "12:30 PM - 1:30 PM",
      vendor: "Mama's Kitchen",
      image: "https://images.unsplash.com/photo-1626244463372-2396160376d4?auto=format&fit=crop&q=80&w=400",
      type: "Lunch",
      status: "Scheduled"
    },
    {
      id: 2,
      title: "Goulash with Buckwheat",
      description: "Hearty beef goulash served with roasted buckwheat and pickles.",
      time: "6:30 PM - 7:30 PM",
      vendor: "Warsaw Cloud Kitchen",
      image: "https://images.unsplash.com/photo-1547592115-33989c45037d?auto=format&fit=crop&q=80&w=400",
      type: "Dinner",
      status: "Scheduled"
    }
  ];

  return (
    <AnimatedPage>
      <div className={`min-h-screen ${tokens.app.pageBackground} pb-24`}>
        {/* Header */}
        <div className="px-4 pt-8 pb-4 bg-white border-b border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className={`text-2xl font-bold ${tokens.app.primaryText}`}>Delivery Calendar</h1>
              <div className="flex items-center gap-1 text-[#1F7A63] mt-0.5">
                <span className="text-sm font-medium">May 2026</span>
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
            <button className="p-2.5 bg-[#F5F5F0] rounded-xl text-[#2B2B2B]">
              <CalendarIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Week Selector */}
          <div className="flex justify-between mb-2">
            {weekDays.map((day) => (
              <button
                key={day.id}
                onClick={() => setSelectedDay(day.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${
                  selectedDay === day.id
                    ? "bg-[#1F7A63] text-white shadow-lg shadow-[#1F7A63]/20"
                    : "text-gray-400 hover:bg-gray-50"
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider">{day.name}</span>
                <span className="text-lg font-bold">{day.date}</span>
                {selectedDay === day.id && (
                  <div className="w-1 h-1 bg-white rounded-full mt-0.5" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Action Center */}
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-bold ${tokens.app.primaryText}`}>Today's Menu</h3>
            <div className="flex gap-2">
               <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600">
                 <SkipForward className="h-3.5 w-3.5" /> Skip
               </button>
               <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600">
                 <RefreshCw className="h-3.5 w-3.5" /> Swap
               </button>
            </div>
          </div>

          {/* Menu Preview */}
          <div className="space-y-4">
            {menuItems.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm flex gap-4">
                <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-[#1F7A63] uppercase tracking-wider">{item.type}</span>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                       <Clock className="h-3 w-3" /> {item.time}
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-500 line-clamp-1 mb-2">{item.description}</p>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span className="text-[10px] text-gray-400 font-medium">{item.vendor}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tomorrow Preview */}
        <div className="px-4 pb-8">
           <div className="bg-gradient-to-br from-white to-[#F5F5F0] rounded-3xl p-6 border border-gray-100">
             <div className="flex items-center justify-between mb-4">
               <div>
                 <h4 className="font-bold text-gray-900">Tomorrow's Sneak Peek</h4>
                 <p className="text-xs text-gray-500">Scheduled for May 19</p>
               </div>
               <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-50">
                 <ChevronRight className="h-5 w-5 text-gray-400" />
               </div>
             </div>
             <div className="flex items-center gap-3">
               <div className="flex -space-x-2">
                 <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=100" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                 <img src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=100" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
               </div>
               <span className="text-xs font-medium text-gray-700">Healthy Salad Box + Smoothie</span>
             </div>
           </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Calendar;
