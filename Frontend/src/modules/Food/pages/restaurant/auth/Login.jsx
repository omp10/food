import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Input } from "@food/components/ui/input"
import { Button } from "@food/components/ui/button"
import BRAND_THEME from "@/config/brandTheme"

export default function RestaurantLogin() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState("")
  const [error, setError] = useState("")
  const isValid = phone.replace(/\D/g, "").length === 10

  const handleSendOTP = async () => {
    if (!isValid) {
      setError("Enter a valid 10-digit number")
      return
    }
    setError("")
    // TODO: integrate restaurant login OTP API
    navigate("/food/restaurant/otp")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto h-14 w-14 rounded-2xl flex items-center justify-center" style={{ background: BRAND_THEME.gradients.primary }}>
            <span className="text-white text-2xl">🛵</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Restaurant Login</h1>
          <p className="text-sm text-gray-500">Continue with your phone number</p>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Registered mobile number</label>
          <div className="flex gap-2 items-stretch w-full">
            <div className="flex items-center px-4 h-12 border border-gray-200 bg-gray-50 text-gray-900 rounded-xl shrink-0">
              <span className="text-base font-medium">+91</span>
            </div>
            <Input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter 10-digit number"
              className="h-12 flex-1"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <p className="text-xs text-gray-500">We’ll send a verification code via SMS.</p>
        </div>

        <Button
          disabled={!isValid}
          onClick={handleSendOTP}
          className="w-full h-12 text-white font-semibold"
          style={{ background: BRAND_THEME.gradients.primary, boxShadow: `0 12px 28px -18px ${BRAND_THEME.colors.brand.primaryDark}` }}
        >
          Get Verification Code
        </Button>

        <p className="text-[11px] text-center text-gray-500">
          By continuing, you agree to our <Link to="/food/restaurant/terms" className="font-semibold" style={{ color: BRAND_THEME.colors.brand.primary }}>Terms of Service</Link> &amp; <Link to="/food/restaurant/privacy" className="font-semibold" style={{ color: BRAND_THEME.colors.brand.primary }}>Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}
