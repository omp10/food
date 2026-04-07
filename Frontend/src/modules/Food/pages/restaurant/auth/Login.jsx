import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ShieldCheck, AlertCircle } from "lucide-react"
import { Button } from "@food/components/ui/button"
import { Card, CardContent } from "@food/components/ui/card"
import { Label } from "@food/components/ui/label"
import { restaurantAPI } from "@food/api"
import { useCompanyName } from "@food/hooks/useCompanyName"
import { getCachedSettings, loadBusinessSettings } from "@food/utils/businessSettings"
import BRAND_THEME from "@/config/brandTheme"

const DEFAULT_COUNTRY_CODE = "+91"
const countryCodes = [
  { code: DEFAULT_COUNTRY_CODE, country: "IN", flag: "India" },
]

export default function RestaurantLogin() {
  const companyName = useCompanyName()
  const navigate = useNavigate()
  const phoneInputRef = useRef(null)
  const [logoUrl, setLogoUrl] = useState("")
  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem("restaurantLoginPhone")
    return {
      phone: saved || "",
      countryCode: DEFAULT_COUNTRY_CODE,
    }
  })
  const [error, setError] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [keyboardInset, setKeyboardInset] = useState(0)

  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return undefined

    // preload logo from business setup
    const syncBranding = async () => {
      const cached = getCachedSettings()
      if (cached?.logo?.url) setLogoUrl(cached.logo.url)
      try {
        const settings = await loadBusinessSettings()
        if (settings?.logo?.url) setLogoUrl(settings.logo.url)
      } catch (err) {
        /* silent */
      }
    }
    syncBranding()

    const updateKeyboardInset = () => {
      const viewport = window.visualViewport
      const inset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)
      setKeyboardInset(inset > 0 ? inset : 0)
    }

    updateKeyboardInset()
    window.visualViewport.addEventListener("resize", updateKeyboardInset)
    window.visualViewport.addEventListener("scroll", updateKeyboardInset)

    return () => {
      window.visualViewport.removeEventListener("resize", updateKeyboardInset)
      window.visualViewport.removeEventListener("scroll", updateKeyboardInset)
    }
  }, [])

  const validatePhone = (phone, countryCode) => {
    if (!phone || phone.trim() === "") return "Phone number is required"

    const digitsOnly = phone.replace(/\D/g, "")
    if (digitsOnly.length < 7) return "Phone number must be at least 7 digits"
    if (digitsOnly.length > 15) return "Phone number is too long"

    if (digitsOnly.length !== 10) return "Indian phone number must be 10 digits"
    if (!["6", "7", "8", "9"].includes(digitsOnly[0])) {
      return "Invalid Indian mobile number"
    }

    return ""
  }

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10)
    setFormData((prev) => ({ ...prev, phone: value }))
    sessionStorage.setItem("restaurantLoginPhone", value)

    if (error) {
      setError(validatePhone(value, formData.countryCode))
    }
  }

  const ensurePhoneFieldVisible = () => {
    window.setTimeout(() => {
      phoneInputRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }, 180)
  }

  const handleSendOTP = async () => {
    const phoneError = validatePhone(formData.phone, formData.countryCode)
    setError(phoneError)
    if (phoneError) return

    const fullPhone = `${formData.countryCode || DEFAULT_COUNTRY_CODE} ${formData.phone}`.trim()

    try {
      setIsSending(true)
      await restaurantAPI.sendOTP(fullPhone, "login")

      const authData = {
        method: "phone",
        phone: fullPhone,
        isSignUp: false,
        module: "restaurant",
      }
      sessionStorage.setItem("restaurantAuthData", JSON.stringify(authData))
      navigate("/food/restaurant/otp")
    } catch (apiErr) {
      const message =
        apiErr?.response?.data?.message ||
        apiErr?.response?.data?.error ||
        "Failed to send OTP. Please try again."
      setError(message)
    } finally {
      setIsSending(false)
    }
  }

  const isValidPhone = !validatePhone(formData.phone, formData.countryCode)

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ background: "linear-gradient(180deg, #f7faff 0%, #ffffff 35%)", paddingBottom: keyboardInset ? `${keyboardInset + 24}px` : undefined }}
    >
      <div className="w-full max-w-sm space-y-3.5">
        <div className="text-center space-y-1.5 sm:space-y-2">
          <div className="flex justify-center">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${companyName} logo`}
                className="h-20 w-20 object-contain"
              />
            ) : (
              <div
                className="h-16 w-16 flex items-center justify-center"
                style={{
                  background: "transparent",
                }}
              >
                <ShieldCheck className="w-8 h-8 text-blue-600" />
              </div>
            )}
          </div>
          {/* Intentionally left blank per request (remove title/subtitle) */}
        </div>

        <Card className="rounded-3xl shadow-md border border-blue-100/70 bg-white">
          <CardContent className="pt-5 pb-6 px-4 sm:px-5 space-y-4">
            <div className="flex flex-col items-center space-y-1">
              <div className="text-center space-y-1">
                <h2 className="text-xl font-bold text-gray-900">Login</h2>
                <p className="text-sm text-gray-600">Continue with your phone number.</p>
                <div className="flex justify-center">
                  <div className="w-12 h-0.5 bg-blue-600 rounded-full mt-2" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold tracking-wide text-gray-600">
                Registered Mobile Number
              </Label>
              <div
                className="flex items-center gap-2 rounded-2xl border bg-white px-3 py-2 shadow-[0_10px_26px_-20px_rgba(37,99,235,0.55)]"
                style={{ borderColor: BRAND_THEME.colors.brand.primary }}
              >
                <span className="text-gray-500">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-gray-800 text-sm">{formData.countryCode}</span>
                </div>
                <div className="h-5 w-px bg-blue-100" />
                <input
                  ref={phoneInputRef}
                  type="tel"
                  maxLength={10}
                  inputMode="numeric"
                  autoComplete="tel-national"
                  enterKeyHint="done"
                  placeholder="Mobile number"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  onFocus={ensurePhoneFieldVisible}
                  className="flex-1 border-0 focus:outline-none focus:ring-0 text-base font-medium text-gray-900 placeholder-gray-400"
                  style={{ WebkitTextFillColor: "#0f172a" }}
                />
              </div>
              {error && (
                <div className="flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle className="h-3 w-3" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <Button
              onClick={handleSendOTP}
              disabled={!isValidPhone || isSending}
              className="w-full h-11 rounded-2xl text-white text-base font-semibold shadow-lg transition-all duration-300"
              style={
                isValidPhone && !isSending
                  ? {
                      background: BRAND_THEME.gradients.primary,
                      boxShadow: `0 16px 38px -18px ${BRAND_THEME.colors.brand.primaryDark}`,
                    }
                  : {
                      backgroundColor: "#e5e7eb",
                      color: "#94a3b8",
                    }
              }
            >
              {isSending ? "Processing..." : "Get Verification Code"}
            </Button>

            <div className="text-center text-[11px] text-gray-500 font-semibold space-y-1">
              <p>We will send verification updates via SMS.</p>
              <div className="flex items-center justify-center gap-1 text-blue-700 font-semibold">
                <button
                  type="button"
                  onClick={() => navigate("/food/restaurant/terms")}
                  className="underline underline-offset-2"
                >
                  Terms of Service
                </button>
                <span className="text-gray-400">&</span>
                <button
                  type="button"
                  onClick={() => navigate("/food/restaurant/privacy")}
                  className="underline underline-offset-2"
                >
                  Privacy Policy
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

