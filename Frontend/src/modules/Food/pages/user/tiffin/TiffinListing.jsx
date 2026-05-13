import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { 
  Star, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Utensils, 
  Search, 
  Filter,
  ArrowRight,
  Leaf,
  Flame,
  ChefHat,
  Timer
} from "lucide-react"
import PageNavbar from "@food/components/user/PageNavbar"

const TIFFIN_CENTERS = [
  {
    id: "t1",
    name: "Mom's Magic Kitchen",
    rating: 4.8,
    reviews: 1240,
    distance: "1.2 km",
    time: "25-30 min",
    priceRange: "₹80 - ₹150",
    tags: ["Home Cooked", "Pure Veg"],
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60",
    description: "Authentic Ghar ka khana with fresh ingredients and lots of love.",
    speciality: "Standard North Indian Thali"
  },
  {
    id: "t2",
    name: "Sai Tiffin Services",
    rating: 4.5,
    reviews: 850,
    distance: "2.5 km",
    time: "35-40 min",
    priceRange: "₹70 - ₹130",
    tags: ["Hygienic", "Veg & Non-Veg"],
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=60",
    description: "Pocket-friendly and delicious meals for students and professionals.",
    speciality: "Paneer Butter Masala Special"
  },
  {
    id: "t3",
    name: "HealthBox Tiffins",
    rating: 4.9,
    reviews: 2100,
    distance: "3.0 km",
    time: "30-35 min",
    priceRange: "₹120 - ₹250",
    tags: ["Healthy", "Customizable"],
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=60",
    description: "Calorie counted, high protein tiffins designed by nutritionists.",
    speciality: "Quinoa & Grilled Chicken Bowl"
  },
  {
    id: "t4",
    name: "Punjabi Tadka Tiffins",
    rating: 4.7,
    reviews: 560,
    distance: "1.8 km",
    time: "20-25 min",
    priceRange: "₹90 - ₹180",
    tags: ["Spicy", "Authentic"],
    image: "https://images.unsplash.com/photo-1601050634127-6ce18644ed17?w=800&auto=format&fit=crop&q=60",
    description: "Rich flavors of Punjab delivered right to your desk.",
    speciality: "Dal Makhani & Lachha Paratha"
  }
]

export default function TiffinListing() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState("All")

  const filters = ["All", "Pure Veg", "Non-Veg", "Healthy", "Home Cooked"]

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <PageNavbar title="Tiffin Centers" />

      {/* Hero Section */}
      <div className="relative h-64 md:h-80 overflow-hidden bg-orange-600">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=1200&auto=format&fit=crop&q=80" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl md:text-5xl font-black text-white mb-2 italic">
              Home-Style <span className="text-orange-400">Tiffins</span>
            </h1>
            <p className="text-gray-200 text-sm md:text-lg max-w-lg">
              Freshly cooked meals delivered daily. The warmth of home, anywhere you go.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search for tiffin centers or meals..."
              className="w-full pl-11 pr-4 py-3 bg-gray-100 rounded-2xl border-none focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all ${
                  activeFilter === filter 
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-105" 
                    : "bg-white text-gray-600 border border-gray-200 hover:border-orange-300"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tiffin Listing Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-orange-500" />
            Popular Tiffin Centers
          </h2>
          <div className="flex items-center gap-1 text-orange-500 text-sm font-bold">
            Sort by <Filter className="w-4 h-4" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {TIFFIN_CENTERS.map((center, idx) => (
            <motion.div
              key={center.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.01 }}
              onClick={() => navigate(`/food/user/tiffin/${center.id}`)}
              className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-gray-100 cursor-pointer group"
            >
              <div className="flex flex-col sm:flex-row h-full">
                <div className="sm:w-2/5 relative h-48 sm:h-auto overflow-hidden">
                  <img 
                    src={center.image} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <div className="bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter text-orange-600 flex items-center gap-1">
                      <Flame className="w-3 h-3" /> Trending
                    </div>
                  </div>
                </div>

                <div className="sm:w-3/5 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-black text-gray-900 line-clamp-1 group-hover:text-orange-500 transition-colors">
                        {center.name}
                      </h3>
                      <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-md">
                        <Star className="w-3.5 h-3.5 text-green-600 fill-green-600" />
                        <span className="text-xs font-bold text-green-700">{center.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-500 text-xs font-medium mb-3">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {center.distance}</span>
                      <span className="flex items-center gap-1"><Timer className="w-3 h-3" /> {center.time}</span>
                    </div>

                    <p className="text-gray-400 text-xs line-clamp-2 mb-4 leading-relaxed italic">
                      "{center.description}"
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {center.tags.map(tag => (
                        <span key={tag} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Starting at</span>
                      <span className="text-lg font-black text-orange-600">{center.priceRange.split('-')[0]}</span>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-orange-50 group-hover:bg-orange-500 flex items-center justify-center transition-all">
                      <ArrowRight className="w-5 h-5 text-orange-500 group-hover:text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Safety Section */}
      <div className="max-w-7xl mx-auto px-4 mt-8 mb-12">
        <div className="bg-gradient-to-br from-gray-900 to-slate-800 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full" />
          <div className="relative z-10 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-orange-500" />
              </div>
              <span className="text-orange-500 font-black tracking-widest uppercase text-xs">Certified Hygiene</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
              Safe & Healthy <br /><span className="text-orange-400">Home-Cooked</span> Meals
            </h2>
            <p className="text-gray-400 max-w-md mb-6 font-medium">
              Every tiffin center undergoes a 20-point quality check before onboarding. We ensure your food is prepared in a clean environment.
            </p>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-2xl font-black transition-all shadow-lg shadow-orange-500/20">
              Join as a Home Cook
            </button>
          </div>
          <div className="relative w-full max-w-sm">
            <motion.img 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              src="https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=60" 
              className="rounded-2xl shadow-2xl rotate-3"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
