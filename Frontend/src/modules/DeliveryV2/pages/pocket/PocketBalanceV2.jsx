import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, AlertTriangle, Loader2,
  TrendingUp, Gift, ArrowDownCircle, HandCoins, Scissors, Wallet, Info
} from 'lucide-react';
import { deliveryAPI } from '@food/api';
import { toast } from 'sonner';
import { formatCurrency } from '@food/utils/currency';
import useDeliveryBackNavigation from '../../hooks/useDeliveryBackNavigation';
import BRAND_THEME from '@/config/brandTheme';

export const PocketBalanceV2 = () => {
  const navigate = useNavigate();
  const goBack = useDeliveryBackNavigation();
  const [loading, setLoading] = useState(true);
  const [walletState, setWalletState] = useState({
    pocketBalance: 0,
    weeklyEarnings: 0,
    totalBonus: 0,
    totalWithdrawn: 0,
    cashCollected: 0,
    deductions: 0,
    withdrawalLimit: 100,
    withdrawableAmount: 0,
    canWithdraw: false
  });
  const [withdrawSubmitting, setWithdrawSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileRes, earningsRes, walletRes] = await Promise.all([
          deliveryAPI.getProfile(),
          deliveryAPI.getEarnings({ period: 'week' }),
          deliveryAPI.getWallet()
        ]);
        const summary = earningsRes?.data?.data?.summary || {};
        const wallet = walletRes?.data?.data?.wallet || {};
        const pocketBalance = Number(wallet.pocketBalance) || 0;
        const withdrawalLimit = Number(wallet.deliveryWithdrawalLimit) || 100;
        const withdrawableAmount = pocketBalance;
        setWalletState({
          pocketBalance,
          weeklyEarnings: Number(summary.totalEarnings) || 0,
          totalBonus: Number(wallet.totalBonus) || 0,
          totalWithdrawn: Number(wallet.totalWithdrawn) || 0,
          cashCollected: Number(wallet.cashInHand) || 0,
          deductions: 0,
          withdrawalLimit,
          withdrawableAmount,
          canWithdraw: withdrawableAmount >= withdrawalLimit
        });
      } catch (err) {
        toast.error('Failed to load pocket details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleWithdraw = async () => {
    const profileRes = await deliveryAPI.getProfile();
    const profile = profileRes?.data?.data?.profile || {};
    const bank = profile?.documents?.bankDetails;
    if (!bank?.accountNumber) {
      toast.error("Please add bank details first");
      navigate("/food/delivery/profile/details");
      return;
    }
    setWithdrawSubmitting(true);
    try {
      const res = await deliveryAPI.createWithdrawalRequest({
        amount: walletState.withdrawableAmount,
        paymentMethod: 'bank_transfer'
      });
      if (res?.data?.success) {
        toast.success("Withdrawal request submitted");
        goBack();
      }
    } catch (err) {
      toast.error("Withdrawal failed");
    } finally {
      setWithdrawSubmitting(false);
    }
  };

  const detailRows = [
    { icon: TrendingUp, label: "Weekly Earnings", value: formatCurrency(walletState.weeklyEarnings), color: "text-green-600", bg: "bg-green-50" },
    { icon: Gift, label: "Bonus", value: formatCurrency(walletState.totalBonus), color: "text-blue-600", bg: "bg-blue-50" },
    { icon: ArrowDownCircle, label: "Withdrawn", value: formatCurrency(walletState.totalWithdrawn), color: "text-purple-600", bg: "bg-purple-50" },
    { icon: HandCoins, label: "Cash Collected", value: formatCurrency(walletState.cashCollected), color: "text-orange-600", bg: "bg-orange-50" },
    { icon: Scissors, label: "Deductions", value: formatCurrency(walletState.deductions), color: "text-red-500", bg: "bg-red-50" },
    { icon: Wallet, label: "Pocket Balance", value: formatCurrency(walletState.pocketBalance), color: "text-gray-800", bg: "bg-gray-100" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24" style={{ fontFamily: "'Poppins', sans-serif" }}>

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-50">
        <button
          onClick={goBack}
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 active:scale-90 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-base font-bold text-gray-900">Pocket Balance</h1>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-7 h-7 animate-spin" style={{ color: BRAND_THEME.colors.brand.primary }} />
          <p className="text-gray-400 text-xs font-medium">Loading balance...</p>
        </div>
      ) : (
        <div className="px-4 pt-4 space-y-3">

          {/* Warning Banner */}
          {!walletState.canWithdraw && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3 flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-800">Withdrawal Disabled</p>
                <p className="text-[10px] text-amber-600 font-medium mt-0.5 leading-relaxed">
                  {walletState.withdrawableAmount <= 0
                    ? 'Your withdrawable amount is ₹0'
                    : `Min. withdrawal is ₹${walletState.withdrawalLimit}. You have ₹${walletState.withdrawableAmount.toFixed(0)}.`}
                </p>
              </div>
            </div>
          )}

          {/* Balance Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 pt-5 pb-4 text-center">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Withdrawable Amount</p>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-4">
                ₹{walletState.withdrawableAmount.toFixed(0)}
              </h2>
              <button
                onClick={handleWithdraw}
                disabled={!walletState.canWithdraw || withdrawSubmitting}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                  !walletState.canWithdraw
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'text-white'
                }`}
                style={
                  walletState.canWithdraw
                    ? { backgroundColor: BRAND_THEME.colors.brand.primary }
                    : undefined
                }
              >
                {withdrawSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {withdrawSubmitting ? 'Processing...' : 'Withdraw to Bank'}
              </button>
            </div>

            {/* Min withdrawal note */}
            <div className="bg-gray-50 px-5 py-2.5 flex items-center gap-2 border-t border-gray-100">
              <Info className="w-3 h-3 text-gray-400 shrink-0" />
              <p className="text-[10px] text-gray-400 font-medium">
                Min. withdrawal: ₹{walletState.withdrawalLimit}
              </p>
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-50">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Breakdown</p>
            </div>
            <div className="divide-y divide-gray-50">
              {detailRows.map(({ icon: Icon, label, value, color, bg }, idx) => (
                <div key={idx} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-3.5 h-3.5 ${color}`} />
                    </div>
                    <p className="text-sm font-medium text-gray-700">{label}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">{value}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default PocketBalanceV2;
