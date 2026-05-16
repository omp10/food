import { Link, useLocation } from "react-router-dom"
import { Home, Layers, Calendar, Package, User } from "lucide-react"
import BRAND_THEME from "@/config/brandTheme"

export default function BottomNavigation() {
  const location = useLocation()
  const pathname = location.pathname
  const { navigation } = BRAND_THEME.tokens

  // Check active routes
  const isHome = pathname === "/food" || pathname === "/food/" || pathname === "/food/user" || pathname === "/food/user/"
  const isPlans = pathname.startsWith("/food/user/plans") || pathname.startsWith("/food/plans")
  const isCalendar = pathname.startsWith("/food/user/calendar") || pathname.startsWith("/food/calendar")
  const isOrders = pathname.startsWith("/food/user/orders") || pathname.startsWith("/food/orders")
  const isProfile = pathname.startsWith("/food/user/profile") || pathname.startsWith("/food/profile")

  const tabs = [
    { label: "Home", icon: Home, path: "/food/user", active: isHome },
    { label: "Plans", icon: Layers, path: "/food/user/plans", active: isPlans },
    { label: "Calendar", icon: Calendar, path: "/food/user/calendar", active: isCalendar },
    { label: "Orders", icon: Package, path: "/food/user/orders", active: isOrders },
    { label: "Profile", icon: User, path: "/food/user/profile", active: isProfile },
  ]

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 right-0 ${navigation.surface} border-t ${navigation.border} z-50 shadow-[0_-4px_16px_rgba(0,0,0,0.05)] pb-safe`}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <Link
              key={tab.label}
              to={tab.path}
              className={`flex flex-1 flex-col items-center justify-center gap-1 h-full transition-all duration-300 relative ${
                tab.active ? navigation.activeText : navigation.inactiveText
              }`}
            >
              <div className={`p-1 rounded-xl transition-all duration-300 ${tab.active ? "bg-[#1F7A63]/10 scale-110" : ""}`}>
                <Icon
                  className={`h-5 w-5 ${tab.active ? "stroke-[2.5px]" : "stroke-[1.5px]"}`}
                />
              </div>
              <span
                className={`text-[10px] font-medium transition-all duration-300 ${
                  tab.active ? "opacity-100 translate-y-0" : "opacity-70"
                }`}
              >
                {tab.label}
              </span>
              {tab.active && (
                <div className={`absolute -top-[1px] left-1/2 -translate-x-1/2 w-8 h-1 ${navigation.indicator} rounded-b-full shadow-[0_2px_4px_rgba(31,122,99,0.3)]`} />
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

