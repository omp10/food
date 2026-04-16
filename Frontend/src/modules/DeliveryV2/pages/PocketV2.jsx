import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet, IndianRupee, ChevronRight,
  ShieldCheck, FileText, LayoutGrid,
  Receipt, Loader2, AlertCircle, X, TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { deliveryAPI } from '@food/api';
import { toast } from 'sonner';
import { formatCurrency } from '@food/utils/currency';
import { initRazorpayPayment } from "@food/utils/razorpay";
import { getCompanyNameAsync } from "@food/utils/businessSettings";
import BRAND_THEME from "@/config/brandTheme";

export const PocketV2 = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [walletState, setWalletState] = useState({
    totalBalance: 0,
    cashInHand: 0,
    availableCashLimit: 0,
    totalCashLimit: 0,
    weeklyEarnings: 0,
    weeklyOrders: 0,
    payoutAmount: 0,
    payoutPeriod: 'No recent payout',
    bankDetailsFilled: false
  });

  const [activeOffer, setActiveOffer] = useState({
    targetAmount: 0,
    targetOrders: 0,
    currentOrders: 0,
    currentEarnings: 0,
    validTill: '',
    isLive: false
  });

  const [showDepositPopup, setShowDepositPopup] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositing, setDepositing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileRes, earningsRes, walletRes] = await Promise.all([
          deliveryAPI.getProfile(),
          deliveryAPI.getEarnings({ period: 'week' }),
          deliveryAPI.getWallet()
        ]);
        const profile = profileRes?.data?.data?.profile || {};
        const summary = earningsRes?.data?.data?.summary || {};
        const wallet = walletRes?.data?.data?.wallet || {};
        const activeAddonsRes = await deliveryAPI.getActiveEarningAddons().catch(() => null);
        const activeOfferPayload =
          activeAddonsRes?.data?.data?.activeOffer ||
          activeAddonsRes?.data?.activeOffer ||
          null;

        const bankDetails = profile?.documents?.bankDetails;
        const isFilled = !!(bankDetails?.accountNumber);

        setWalletState({
          totalBalance: Number(wallet.pocketBalance) || 0,
          cashInHand: Number(wallet.cashInHand) || 0,
          availableCashLimit: Number(wallet.availableCashLimit) || 0,
          totalCashLimit: Number(wallet.totalCashLimit) || 0,
          weeklyEarnings: Number(summary.totalEarnings) || 0,
          weeklyOrders: Number(summary.totalOrders) || 0,
          payoutAmount: Number(wallet.lastPayout?.amount || wallet.totalWithdrawn || 0),
          payoutPeriod: wallet.lastPayout
            ? new Date(wallet.lastPayout.date).toLocaleDateString()
            : 'No recent payout',
          bankDetailsFilled: isFilled
        });

        setActiveOffer({
          targetAmount: Number(activeOfferPayload?.targetAmount) || 0,
          targetOrders: Number(activeOfferPayload?.targetOrders) || 0,
          currentOrders: Number(activeOfferPayload?.currentOrders) || 0,
          currentEarnings: Number(activeOfferPayload?.currentEarnings) || 0,
          validTill: activeOfferPayload?.validTill || '',
          isLive: Boolean(activeOfferPayload)
        });
      } catch (err) {
        toast.error('Failed to load wallet data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeposit = async () => {
    const amt = parseFloat(depositAmount);
    if (!depositAmount || isNaN(amt) || amt < 1) {
      toast.error("Enter a valid amount (minimum ₹1)");
      return;
    }
    if (amt > walletState.cashInHand) {
      toast.error(`Cannot exceed cash in hand (₹${walletState.cashInHand})`);
      return;
    }
    try {
      setDepositing(true);
      const orderRes = await deliveryAPI.createDepositOrder(amt);
      const data = orderRes?.data?.data;
      const rp = data?.razorpay;
      if (!rp?.orderId) {
        toast.error("Payment initialization failed");
        setDepositing(false);
        return;
      }
      const profileRes = await deliveryAPI.getProfile();
      const profile = profileRes?.data?.data?.profile || {};
      const companyName = await getCompanyNameAsync();
      await initRazorpayPayment({
        key: rp.key,
        amount: rp.amount,
        currency: rp.currency || "INR",
        order_id: rp.orderId,
        name: companyName,
        description: `Cash limit deposit - ₹${amt}`,
        prefill: { name: profile.name, email: profile.email, contact: profile.phone },
        handler: async (res) => {
          try {
            const verifyRes = await deliveryAPI.verifyDepositPayment({
              razorpay_order_id: res.razorpay_order_id,
              razorpay_payment_id: res.razorpay_payment_id,
              razorpay_signature: res.razorpay_signature,
              amount: amt
            });
            if (verifyRes?.data?.success) {
              toast.success("Deposit successful");
              setShowDepositPopup(false);
              setDepositAmount("");
              window.location.reload();
            }
          } catch (err) {
            toast.error("Verification failed");
          } finally {
            setDepositing(false);
          }
        },
        onError: () => setDepositing(false),
        onClose: () => setDepositing(false)
      });
    } catch (err) {
      setDepositing(false);
      toast.error("Deposit failed to start");
    }
  };

  const hasActiveOffer = activeOffer.isLive && (activeOffer.targetAmount > 0 || activeOffer.targetOrders > 0);
  const ordersProgress = activeOffer.targetOrders > 0
    ? Math.min(activeOffer.currentOrders / activeOffer.targetOrders, 1) : 0;
  const earningsProgress = activeOffer.targetAmount > 0
    ? Math.min(activeOffer.currentEarnings / activeOffer.targetAmount, 1) : 0;

  const formatOfferValidTill = (validTill) => {
    if (!validTill) return '';
    const parsed = new Date(validTill);
    if (Number.isNaN(parsed.getTime())) return String(validTill);
    return parsed.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const getCurrentWeekRange = () => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const fmt = (d) => `${d.getDate()} ${d.toLocaleString('en-US', { month: 'short' })}`;
    return `${fmt(start)} – ${fmt(end)}`;
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <Loader2 className="w-7 h-7 animate-spin" style={{ color: BRAND_THEME.colors.brand.primary }} />
      <p className="text-xs font-medium text-gray-400">Loading Pocket...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-28" style={{ fontFamily: "'Poppins', sans-serif" }}>

      {/* Bank Details Banner */}
      {!walletState.bankDetailsFilled && (
        <div
          className="px-4 py-3 flex items-center gap-3"
          style={{ backgroundColor: BRAND_THEME.colors.brand.primary }}
        >
          <AlertCircle className="w-4 h-4 text-white shrink-0" />
          <p className="flex-1 text-xs font-semibold text-white">Add bank details to enable payouts</p>
          <button
            onClick={() => navigate('/food/delivery/profile/details')}
            className="text-xs font-bold bg-white px-3 py-1.5 rounded-lg shrink-0"
            style={{ color: BRAND_THEME.colors.brand.primary }}
          >
            Add
          </button>
        </div>
      )}

      <div className="px-4 pt-4 space-y-3">

        {/* Weekly Earnings Card */}
        <div
          onClick={() => navigate('/food/delivery/earnings')}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden active:scale-[0.99] transition-all cursor-pointer"
        >
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                This Week · {getCurrentWeekRange()}
              </p>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
            <div className="flex items-end gap-3">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                ₹{walletState.weeklyEarnings.toFixed(0)}
              </h2>
              <span className="text-xs text-gray-400 font-medium mb-1">{walletState.weeklyOrders} orders</span>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-2 border-t border-gray-50 flex items-center gap-1.5">
            <TrendingUp className="w-3 h-3 text-green-500" />
            <p className="text-[10px] text-gray-400 font-medium">Weekly earnings — tap to view details</p>
          </div>
        </div>

        {/* Earnings Guarantee Card */}
        {hasActiveOffer && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-gray-50">
              <div>
                <p className="text-sm font-bold text-gray-900">Earnings Guarantee</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-[10px] text-gray-400 font-medium">
                    Live · Valid till {formatOfferValidTill(activeOffer.validTill)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-base font-black text-gray-900">₹{activeOffer.targetAmount}</p>
                <p className="text-[10px] text-gray-400 font-medium">{activeOffer.targetOrders} orders</p>
              </div>
            </div>

            {/* Progress */}
            <div className="px-4 py-4 grid grid-cols-2 gap-4">
              {/* Orders Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Orders</p>
                  <p className="text-xs font-bold text-gray-800">{activeOffer.currentOrders}/{activeOffer.targetOrders}</p>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: BRAND_THEME.colors.brand.primary }}
                    initial={{ width: 0 }}
                    animate={{ width: `${ordersProgress * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
              {/* Earnings Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Earned</p>
                  <p className="text-xs font-bold text-gray-800">₹{activeOffer.currentEarnings}</p>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: BRAND_THEME.colors.brand.primary }}
                    initial={{ width: 0 }}
                    animate={{ width: `${earningsProgress * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pocket Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Pocket Balance */}
          <button
            onClick={() => navigate('/food/delivery/pocket/balance')}
            className="w-full px-4 py-3.5 border-b border-gray-50 flex items-center justify-between active:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
                <Wallet className="w-4 h-4 text-gray-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800">Pocket Balance</p>
                <p className="text-[10px] text-gray-400 font-medium">Withdrawal hub</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-gray-900">₹{walletState.totalBalance.toFixed(0)}</span>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
          </button>

          {/* Cash Limit */}
          <button
            onClick={() => navigate('/food/delivery/pocket/cash-limit')}
            className="w-full px-4 py-3.5 border-b border-gray-50 flex items-center justify-between active:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800">Cash Limit</p>
                <p className="text-[10px] text-gray-400 font-medium">Available to collect</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-gray-900">₹{walletState.availableCashLimit.toFixed(0)}</span>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
          </button>

          {/* Deposit Cash Button */}
          <div className="px-4 py-3">
            <button
              onClick={() => setShowDepositPopup(true)}
              className="w-full py-3 text-white rounded-xl font-bold text-sm active:scale-95 transition-all"
              style={{ backgroundColor: BRAND_THEME.colors.brand.primary }}
            >
              Deposit Cash
            </button>
          </div>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              icon: IndianRupee,
              label: "Last Payout",
              sub: `₹${walletState.payoutAmount}`,
              bg: "bg-blue-50",
              color: "text-blue-600",
              route: '/food/delivery/pocket/payout'
            },
            {
              icon: Receipt,
              label: "Settlement",
              sub: "Limit",
              bg: "bg-orange-50",
              color: "text-orange-600",
              route: '/food/delivery/pocket/limit-settlement'
            },
            {
              icon: FileText,
              label: "Deductions",
              sub: "History",
              bg: "bg-red-50",
              color: "text-red-500",
              route: '/food/delivery/pocket/deductions'
            },
          ].map(({ icon: Icon, label, sub, bg, color, route }) => (
            <button
              key={label}
              onClick={() => navigate(route)}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3.5 flex flex-col items-start active:bg-gray-50 transition-colors"
            >
              <div className={`w-8 h-8 ${bg} rounded-xl flex items-center justify-center mb-2`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <p className="text-xs font-semibold text-gray-800 leading-tight">{label}</p>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">{sub}</p>
            </button>
          ))}
        </div>

        {/* Statement */}
        <button
          onClick={() => navigate('/food/delivery/pocket/details')}
          className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3.5 flex items-center justify-between active:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center">
              <LayoutGrid className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-800">Pocket Statement</p>
              <p className="text-[10px] text-gray-400 font-medium">Full transaction history</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300" />
        </button>

      </div>

      {/* Deposit Modal */}
      <AnimatePresence>
        {showDepositPopup && (
          <div className="fixed inset-0 z-[1000] flex items-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDepositPopup(false)}
              className="absolute inset-0 bg-black/50"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full bg-white rounded-t-3xl px-5 pt-5 pb-8 shadow-2xl"
            >
              {/* Handle */}
              <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

              {/* Close */}
              <button
                onClick={() => setShowDepositPopup(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>

              <h3 className="text-base font-bold text-gray-900 mb-0.5">Deposit Cash</h3>
              <p className="text-xs text-gray-400 font-medium mb-5">Settle your cash in hand to increase limit</p>

              {/* Cash in hand */}
              <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between mb-4 border border-gray-100">
                <span className="text-xs font-medium text-gray-500">Cash in hand</span>
                <span className="text-sm font-bold text-gray-900">₹{walletState.cashInHand}</span>
              </div>

              {/* Amount Input */}
              <div className="relative mb-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full border border-gray-200 rounded-xl py-3.5 pl-9 pr-4 text-base font-bold text-gray-900 outline-none focus:border-gray-400 transition-colors bg-white"
                />
              </div>
              <p className="text-[10px] text-gray-400 font-medium mb-5">Minimum ₹1 · Instant limit update</p>

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={handleDeposit}
                  disabled={depositing}
                  className="w-full py-3.5 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-60"
                  style={{ backgroundColor: BRAND_THEME.colors.brand.primary }}
                >
                  {depositing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  {depositing ? 'Processing...' : 'Proceed to Pay'}
                </button>
                <button
                  onClick={() => setShowDepositPopup(false)}
                  className="w-full py-2.5 text-gray-400 font-medium text-sm"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PocketV2;
