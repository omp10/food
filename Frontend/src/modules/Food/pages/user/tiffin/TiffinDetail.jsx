import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useParams, useNavigate } from "react-router-dom"
import { 
  Star, 
  Clock, 
  MapPin, 
  ChevronLeft, 
  Share2, 
  Heart,
  Calendar,
  CheckCircle2,
  Info,
  ChevronRight,
  ArrowRight,
  Plus,
  Minus,
  Utensils
} from "lucide-react"

const TIFFIN_DETAILS = {
  "t1": {
    name: "Mom's Magic Kitchen",
    rating: 4.8,
    reviews: "1.2k+ reviews",
    address: "Model Town, Street 4, New Delhi",
    description: "Authentic North Indian homemade food prepared with fresh ingredients. No preservatives, no soda, just pure taste.",
    banner: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&auto=format&fit=crop&q=80",
    timings: {
      breakfast: "08:00 AM - 10:30 AM",
      lunch: "12:30 PM - 03:00 PM",
      dinner: "07:30 PM - 10:00 PM"
    },
    menu: [
      {
        id: "m1",
        name: "Standard Veg Thali",
        price: 80,
        description: "4 Roti, Rice, Dal, Seasonal Sabzi, Salad, Pickle",
        type: "Veg",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&auto=format&fit=crop&q=60"
      },
      {
        id: "m2",
        name: "Premium Veg Thali",
        price: 130,
        description: "4 Butter Roti, Pulao, Paneer Gravy, Dal Fry, Raita, Sweet, Papad",
        type: "Veg",
        image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&auto=format&fit=crop&q=60"
      },
      {
        id: "m3",
        name: "Healthy Oat Meal",
        price: 150,
        description: "Masala Oats, Boiled Veggies, Fresh Sprouts Salad",
        type: "Veg",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop&q=60"
      }
    ],
    plans: [
      { id: "daily", name: "Daily", discount: "0%" },
      { id: "weekly", name: "Weekly (6 Days)", discount: "10% OFF" },
      { id: "monthly", name: "Monthly (24 Days)", discount: "25% OFF" }
    ]
  }
}

export default function TiffinDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activePlan, setActivePlan] = useState("daily")
  const [selectedItems, setSelectedItems] = useState({})
  const [isFavorite, setIsFavorite] = useState(false)

  const center = TIFFIN_DETAILS[id] || TIFFIN_DETAILS["t1"] // Fallback for demo

  const updateQuantity = (itemId, delta) => {
    setSelectedItems(prev => {
      const current = prev[itemId] || 0
      const next = Math.max(0, current + delta)
      return { ...prev, [itemId]: next }
    })
  }

  const totalQuantity = Object.values(selectedItems).reduce((a, b) => a + b, 0)

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Sticky Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-transparent">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg text-gray-900"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex gap-2">
          <button className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg text-gray-900">
            <Share2 className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg text-gray-900"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-rose-500 text-rose-500" : ""}`} />
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="h-[300px] md:h-[400px] relative overflow-hidden">
        <img 
          src={center.banner} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
      </div>

      {/* Center Info Card */}
      <div className="relative -mt-20 mx-4 bg-white rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-2xl font-black text-gray-900 leading-tight">
            {center.name}
          </h1>
          <div className="bg-green-600 px-3 py-1 rounded-xl flex items-center gap-1 shadow-lg shadow-green-600/20">
            <Star className="w-4 h-4 text-white fill-white" />
            <span className="text-sm font-black text-white">{center.rating}</span>
          </div>
        </div>

        <p className="text-gray-500 text-sm font-medium mb-4 flex items-center gap-1">
          <MapPin className="w-4 h-4" /> {center.address}
        </p>

        <div className="flex items-center gap-6 py-4 border-y border-gray-50">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Time</span>
            <span className="text-sm font-black text-gray-900 flex items-center gap-1">
              <Clock className="w-4 h-4 text-orange-500" /> 30-40 min
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Distance</span>
            <span className="text-sm font-black text-gray-900">1.2 km</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Reviews</span>
            <span className="text-sm font-black text-gray-900">{center.reviews}</span>
          </div>
        </div>

        <p className="mt-4 text-gray-400 text-sm italic leading-relaxed">
          {center.description}
        </p>
      </div>

      {/* Subscription Plans */}
      <div className="mt-8 px-4">
        <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-orange-500" /> Choose Your Plan
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {center.plans.map(plan => (
            <button
              key={plan.id}
              onClick={() => setActivePlan(plan.id)}
              className={`p-3 rounded-2xl flex flex-col items-center text-center transition-all ${
                activePlan === plan.id 
                  ? "bg-orange-500 text-white shadow-xl shadow-orange-500/30 scale-105" 
                  : "bg-gray-50 text-gray-600 border border-transparent"
              }`}
            >
              <span className="text-sm font-black">{plan.name}</span>
              {plan.discount !== "0%" && (
                <span className={`text-[10px] font-bold mt-1 ${activePlan === plan.id ? "text-orange-200" : "text-orange-600"}`}>
                  {plan.discount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Delivery Schedule */}
      <div className="mt-8 px-4">
        <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100">
          <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-tight">
            <Info className="w-4 h-4 text-slate-400" /> Delivery Slots
          </h3>
          <div className="space-y-3">
            {Object.entries(center.timings).map(([key, val]) => (
              <div key={key} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-gray-100/50">
                <span className="text-xs font-bold capitalize text-gray-600">{key}</span>
                <span className="text-xs font-black text-gray-900">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="mt-10 px-4">
        <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
          <Utensils className="w-5 h-5 text-orange-500" /> Today's Special Menu
        </h2>
        
        <div className="space-y-6">
          {center.menu.map((item, idx) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex gap-4 group"
            >
              <div className="relative w-28 h-28 flex-shrink-0">
                <img 
                  src={item.image} 
                  className="w-full h-full object-cover rounded-2xl shadow-md transition-transform group-hover:scale-105" 
                />
                <div className="absolute top-1.5 left-1.5 w-4 h-4 bg-white border border-gray-100 rounded flex items-center justify-center">
                  <div className={`w-2 h-2 rounded-full ${item.type === 'Veg' ? 'bg-green-600' : 'bg-red-600'}`} />
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h4 className="font-black text-gray-900 group-hover:text-orange-500 transition-colors">{item.name}</h4>
                  <p className="text-xs text-gray-400 font-medium line-clamp-2 mt-1">{item.description}</p>
                  <div className="mt-2 text-lg font-black text-gray-900">₹{item.price}</div>
                </div>
                
                <div className="flex justify-end">
                  {selectedItems[item.id] ? (
                    <div className="flex items-center bg-orange-500 rounded-xl p-1 shadow-lg shadow-orange-500/20">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center text-white"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-white font-black">{selectedItems[item.id]}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center text-white"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="bg-white border-2 border-orange-500 text-orange-500 font-black px-6 py-1.5 rounded-xl hover:bg-orange-500 hover:text-white transition-all shadow-sm"
                    >
                      ADD
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Cart Bottom Bar */}
      <AnimatePresence>
        {totalQuantity > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-6 left-4 right-4 z-[60] bg-orange-600 rounded-3xl p-4 flex items-center justify-between shadow-[0_20px_40px_rgba(249,115,22,0.4)]"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-orange-100 uppercase tracking-widest">{totalQuantity} Items Added</span>
                <span className="text-lg font-black text-white">₹{Object.entries(selectedItems).reduce((acc, [id, qty]) => acc + (center.menu.find(m => m.id === id)?.price || 0) * qty, 0)}</span>
              </div>
            </div>
            <button className="bg-white text-orange-600 px-6 py-3 rounded-2xl font-black flex items-center gap-2 group">
              Proceed <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
