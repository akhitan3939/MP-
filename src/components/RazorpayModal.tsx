import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  Sparkles, 
  Lock,
  CheckCircle2,
  Zap,
  Tag,
  Check,
  Building2,
  Smartphone,
  CreditCard,
  QrCode,
  ExternalLink,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { OrderTransaction } from '../types';

export const RazorpayModal: React.FC = () => {
  const { 
    isRazorpayModalOpen, 
    closeRazorpayModal, 
    selectedSeriesForPurchase, 
    currentUser, 
    coupons, 
    completePurchase, 
    lang,
    navigate,
    openAuthModal,
    showToast 
  } = useApp();

  // Coupon State
  const [couponInput, setCouponInput] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);

  // Flow & State
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [activePaymentLinkId, setActivePaymentLinkId] = useState<string>('');
  const [activePaymentUrl, setActivePaymentUrl] = useState<string>('');
  const [completedOrder, setCompletedOrder] = useState<OrderTransaction | null>(null);
  const [verificationError, setVerificationError] = useState<string>('');

  const pollingIntervalRef = useRef<any>(null);

  // Clear states when modal closes or opens
  useEffect(() => {
    if (isRazorpayModalOpen) {
      setCompletedOrder(null);
      setIsProcessing(false);
      setIsVerifying(false);
      setActivePaymentLinkId('');
      setActivePaymentUrl('');
      setVerificationError('');
    } else {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    }
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [isRazorpayModalOpen, selectedSeriesForPurchase]);

  // Clean polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  if (!isRazorpayModalOpen || !selectedSeriesForPurchase) return null;

  const originalPrice = selectedSeriesForPurchase.price;
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const payablePrice = Math.max(0, originalPrice - discountAmount);
  const basePriceWithoutGst = +(payablePrice / 1.18).toFixed(2);
  const gstAmount = +(payablePrice - basePriceWithoutGst).toFixed(2);

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    const found = coupons.find(c => c.code.toUpperCase() === code && c.isActive);

    if (!found) {
      showToast(lang === 'hi' ? '❌ अमान्य या समाप्त कूपन कोड' : '❌ Invalid or expired coupon code');
      return;
    }

    if (originalPrice < found.minAmount) {
      showToast(lang === 'hi' ? `⚠️ न्यूनतम ₹${found.minAmount} की राशि आवश्यक है` : `⚠️ Minimum ₹${found.minAmount} cart value required`);
      return;
    }

    let calculatedDiscount = 0;
    if (found.discountType === 'flat') {
      calculatedDiscount = found.discountValue;
    } else {
      calculatedDiscount = Math.round((originalPrice * found.discountValue) / 100);
    }

    setAppliedCoupon({ code: found.code, discount: calculatedDiscount });
    setActivePaymentLinkId('');
    setActivePaymentUrl('');
    setVerificationError('');
    showToast(lang === 'hi' ? `🎉 कूपन "${found.code}" लागू! ₹${calculatedDiscount} की छूट मिली` : `🎉 Coupon "${found.code}" applied! ₹${calculatedDiscount} saved`);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setActivePaymentLinkId('');
    setActivePaymentUrl('');
    setVerificationError('');
    showToast(lang === 'hi' ? 'कूपन हटा दिया गया' : 'Coupon removed');
  };

  // Verify payment status against live Razorpay API
  const verifyLivePaymentStatus = async (linkId: string, showToastOnFail = false) => {
    if (!linkId) return false;
    setIsVerifying(true);
    setVerificationError('');

    try {
      const res = await fetch('/api/payment/check-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentLinkId: linkId })
      }).then(r => r.json());

      setIsVerifying(false);

      if (res?.isPaid) {
        // Stop polling
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }

        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch {
          // safe fallback
        }

        const order = completePurchase(
          selectedSeriesForPurchase,
          'UPI' as any,
          appliedCoupon?.code,
          appliedCoupon?.discount || 0
        );

        const fullOrder: OrderTransaction = order || {
          id: `tx_${Date.now()}`,
          orderId: `order_live_${Date.now()}`,
          razorpayPaymentId: res.paymentId || `pay_live_${Date.now()}`,
          userId: currentUser?.id || 'guest',
          userName: currentUser?.name || 'Student',
          userEmail: currentUser?.email || 'student@mpparikshasetu.in',
          userPhone: currentUser?.phone || '9876543210',
          seriesId: selectedSeriesForPurchase.id,
          seriesTitle: selectedSeriesForPurchase.titleHi,
          amount: originalPrice,
          discount: discountAmount,
          gstAmount: gstAmount,
          finalAmount: payablePrice,
          paymentMethod: 'UPI',
          status: 'SUCCESS',
          couponCode: appliedCoupon?.code,
          createdAt: new Date().toISOString(),
          invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`
        };

        setCompletedOrder(fullOrder);
        showToast(lang === 'hi' ? '✅ Razorpay भुगतान सत्यापित! टेस्ट सीरीज अनलॉक हो गई है।' : '✅ Payment verified! Test series unlocked.');
        return true;
      } else {
        if (showToastOnFail) {
          setVerificationError(
            lang === 'hi' 
              ? 'Razorpay से अभी भुगतान प्राप्त नहीं हुआ है। कृपया पहले Razorpay विंडो पर पेमेंट पूरा करें।' 
              : 'Payment not yet confirmed on Razorpay. Please complete transaction first.'
          );
        }
        return false;
      }
    } catch (err) {
      console.error('Verify status err:', err);
      setIsVerifying(false);
      if (showToastOnFail) {
        setVerificationError(lang === 'hi' ? 'भुगतान सत्यापन में समस्या आई, कृपया पुनः जांचें।' : 'Verification error, please retry.');
      }
      return false;
    }
  };

  // Launch Live Razorpay Payment Flow
  const launchLiveRazorpay = async () => {
    if (!currentUser) {
      closeRazorpayModal();
      openAuthModal('register');
      showToast(lang === 'hi' ? '🔐 कृपया पेमेंट करने से पहले लॉगिन या रजिस्ट्रेशन करें ताकि टेस्ट आपके खाते में सुरक्षित रहे।' : '🔐 Please login or register first before making payment.');
      return;
    }

    setIsProcessing(true);
    setVerificationError('');

    try {
      const res = await fetch('/api/payment/create-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seriesId: selectedSeriesForPurchase.id,
          seriesTitle: selectedSeriesForPurchase.titleHi,
          amount: payablePrice,
          userId: currentUser.id,
          userName: currentUser.name,
          userEmail: currentUser.email,
          userPhone: currentUser.phone,
          couponCode: appliedCoupon?.code
        })
      }).then(r => r.json());

      setIsProcessing(false);

      if (res?.success && res.paymentUrl && res.paymentLinkId) {
        setActivePaymentLinkId(res.paymentLinkId);
        setActivePaymentUrl(res.paymentUrl);

        // Open Razorpay hosted checkout in new tab
        const payWindow = window.open(res.paymentUrl, '_blank');
        if (!payWindow || payWindow.closed || typeof payWindow.closed === 'undefined') {
          window.location.href = res.paymentUrl;
        }

        // Start automatic polling every 3 seconds to check for live payment receipt
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }

        pollingIntervalRef.current = setInterval(() => {
          verifyLivePaymentStatus(res.paymentLinkId, false);
        }, 3000);

      } else {
        throw new Error(res?.message || 'Failed to initialize live gateway');
      }
    } catch (err: any) {
      console.error('Razorpay Error:', err);
      setIsProcessing(false);
      showToast(lang === 'hi' ? 'Razorpay लाइव लिंक नहीं खुल सका, पुनः प्रयास करें' : 'Unable to open Razorpay, please retry');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {lang === 'hi' ? 'Razorpay लाइव गेटवे' : 'Razorpay Live Gateway'}
              </span>
              <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Live
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              {lang === 'hi' ? 'टेस्ट सीरीज पैकेज अनलॉक करें' : 'Unlock Test Series Package'}
            </h2>
          </div>
          
          <button 
            id="close-razorpay-modal-btn"
            onClick={closeRazorpayModal}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors relative z-10 cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* SUCCESS SCREEN */}
          {completedOrder ? (
            <div className="text-center py-4 space-y-5">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  {lang === 'hi' ? '🎉 भुगतान सत्यापित एवं सफल!' : '🎉 Payment Verified & Successful!'}
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  {lang === 'hi' 
                    ? 'Razorpay से पुष्टि प्राप्त हो गई है। सभी टेस्ट सेट्स आपके खाते में अनलॉक हो चुके हैं।'
                    : 'Confirmed from Razorpay. All test sets are now unlocked in your account.'}
                </p>
              </div>

              {/* Receipt Summary Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>{lang === 'hi' ? 'ऑर्डर ID' : 'Order ID'}:</span>
                  <span className="font-mono font-medium text-slate-900">{completedOrder.id}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{lang === 'hi' ? 'Razorpay Payment ID' : 'Payment ID'}:</span>
                  <span className="font-mono font-medium text-emerald-700">{completedOrder.razorpayPaymentId}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{lang === 'hi' ? 'पैकेज' : 'Package'}:</span>
                  <span className="font-medium text-slate-900 text-right">{completedOrder.seriesTitle}</span>
                </div>
                <div className="flex justify-between text-slate-600 pt-2 border-t border-slate-200">
                  <span className="font-semibold text-slate-900">{lang === 'hi' ? 'कुल प्राप्त राशि' : 'Amount Paid'}:</span>
                  <span className="font-bold text-emerald-700 text-base">₹{completedOrder.finalAmount}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  id="go-to-tests-after-pay"
                  onClick={() => {
                    closeRazorpayModal();
                    navigate('tests');
                  }}
                  className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  {lang === 'hi' ? 'अभी टेस्ट देना शुरू करें' : 'Start Practicing Now'}
                </button>
              </div>
            </div>
          ) : activePaymentLinkId ? (
            /* LIVE VERIFICATION PENDING SCREEN */
            <div className="py-2 space-y-4 text-center">
              <div className="w-16 h-16 bg-blue-50 border-2 border-blue-200 rounded-full flex items-center justify-center mx-auto text-blue-600">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {lang === 'hi' ? 'Razorpay पर लाइव भुगतान की प्रतीक्षा...' : 'Waiting for Razorpay Payment...'}
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  {lang === 'hi' 
                    ? `कृपया Razorpay पेज पर ₹${payablePrice} का भुगतान (GPay / PhonePe / QR / Card) से पूरा करें।`
                    : `Please complete ₹${payablePrice} payment on Razorpay page using UPI, QR or Cards.`}
                </p>
              </div>

              {/* Status Box */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-left space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>{lang === 'hi' ? 'सुरक्षित लाइव वेरिफिकेशन मोड' : 'Live Verification Active'}</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  {lang === 'hi'
                    ? 'जैसे ही Razorpay को आपका भुगतान प्राप्त होगा, सिस्टम स्वतः पुष्टि करके टेस्ट सीरीज को तुरंत अनलॉक कर देगा।'
                    : 'As soon as Razorpay receives your payment, the system will automatically confirm and unlock your tests.'}
                </p>
              </div>

              {verificationError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2 text-left animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{verificationError}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  id="manual-check-status-btn"
                  onClick={() => verifyLivePaymentStatus(activePaymentLinkId, true)}
                  disabled={isVerifying}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{lang === 'hi' ? 'सत्यापन हो रहा है...' : 'Verifying with Razorpay...'}</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      <span>{lang === 'hi' ? 'भुगतान स्थिति अभी जांचें (Check Status)' : 'Verify Payment Status Now'}</span>
                    </>
                  )}
                </button>

                {activePaymentUrl && (
                  <a
                    id="reopen-payment-link-btn"
                    href={activePaymentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors text-center"
                  >
                    {lang === 'hi' ? '🔗 Razorpay पेमेंट पेज दोबारा खोलें' : '🔗 Reopen Razorpay Payment Page'}
                  </a>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Package Summary Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 flex items-start justify-between">
                <div>
                  <span className="inline-block bg-blue-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider mb-1.5">
                    {selectedSeriesForPurchase.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base leading-tight">
                    {lang === 'hi' ? selectedSeriesForPurchase.titleHi : selectedSeriesForPurchase.titleEn}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    {selectedSeriesForPurchase.totalTests} Mock Tests • 4,000+ Real Exam Questions • 1 Year Access
                  </p>
                </div>
                <div className="text-right pl-3">
                  <div className="text-2xl font-black text-blue-900">
                    ₹{payablePrice}
                  </div>
                  {appliedCoupon && (
                    <div className="text-xs text-slate-500 line-through">
                      ₹{originalPrice}
                    </div>
                  )}
                </div>
              </div>

              {/* Linked Student Account Banner */}
              {currentUser ? (
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                      {currentUser.name?.charAt(0) || 'U'}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-emerald-950 flex items-center gap-1.5 truncate">
                        <span>{currentUser.name}</span>
                        <span className="text-[10px] bg-emerald-200/70 text-emerald-900 font-semibold px-1.5 py-0.2 rounded">
                          {lang === 'hi' ? 'सत्यापित खाता' : 'Verified Account'}
                        </span>
                      </div>
                      <div className="text-[11px] text-emerald-700 truncate font-mono">
                        +91 {currentUser.phone} • {currentUser.email}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 pl-2">
                    <span className="text-[10px] text-slate-500 block">{lang === 'hi' ? 'रोल/आईडी' : 'Roll ID'}</span>
                    <span className="text-[11px] font-mono font-bold text-slate-700">{currentUser.id}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-amber-950">{lang === 'hi' ? '🔒 लॉगिन आवश्यक है' : '🔒 Login Required'}</div>
                    <div className="text-[11px] text-amber-800">{lang === 'hi' ? 'टेस्ट अनलॉक करने हेतु पहले खाता बनाएं' : 'Sign up to unlock tests permanently'}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      closeRazorpayModal();
                      openAuthModal('register');
                    }}
                    className="px-3 py-1.5 bg-[#7A2A1E] text-[#D4A017] font-bold rounded-lg text-xs hover:bg-[#5E1F16]"
                  >
                    {lang === 'hi' ? 'साइन-अप / लॉगिन' : 'Sign Up / Login'}
                  </button>
                </div>
              )}

              {/* Coupon Code Section */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-blue-600" />
                  {lang === 'hi' ? 'कूपन कोड लगाएं' : 'Have a Coupon Code?'}
                </label>

                {appliedCoupon ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                          <span>{appliedCoupon.code}</span>
                          <span className="text-xs bg-emerald-200/70 text-emerald-800 px-1.5 py-0.5 rounded font-semibold">
                            -₹{appliedCoupon.discount} OFF
                          </span>
                        </div>
                        <p className="text-xs text-emerald-700">
                          {lang === 'hi' ? 'कूपन सफलतापूर्वक लागू हो गया है' : 'Coupon code successfully applied'}
                        </p>
                      </div>
                    </div>
                    <button
                      id="remove-coupon-btn"
                      onClick={handleRemoveCoupon}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 underline px-2 py-1 cursor-pointer"
                    >
                      {lang === 'hi' ? 'हटाएं' : 'Remove'}
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        id="coupon-input-box"
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="उदा. MPGOVT50, PATWARI100"
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-600 uppercase"
                      />
                      <button
                        id="apply-coupon-btn"
                        onClick={() => handleApplyCoupon()}
                        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-colors shadow-sm cursor-pointer"
                      >
                        {lang === 'hi' ? 'लागू करें' : 'Apply'}
                      </button>
                    </div>

                    {/* Quick Available Coupons */}
                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] text-slate-500 font-medium">
                        {lang === 'hi' ? 'उपलब्ध कूपन:' : 'Available:'}
                      </span>
                      {coupons.filter(c => c.isActive).slice(0, 3).map(coupon => (
                        <button
                          key={coupon.code}
                          onClick={() => handleApplyCoupon(coupon.code)}
                          className="text-[11px] font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          {coupon.code}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>{lang === 'hi' ? 'मूल पैकेज मूल्य' : 'Base Price'}</span>
                  <span>₹{originalPrice}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>{lang === 'hi' ? 'कूपन छूट' : 'Coupon Discount'} ({appliedCoupon.code})</span>
                    <span>- ₹{appliedCoupon.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500 text-xs">
                  <span>{lang === 'hi' ? 'जीएसटी (18% शामिल)' : 'GST (18% Included)'}</span>
                  <span>₹{gstAmount}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-bold">
                  <span className="text-slate-900">{lang === 'hi' ? 'कुल देय राशि' : 'Total Payable Amount'}</span>
                  <span className="text-2xl text-blue-700 font-black">₹{payablePrice}</span>
                </div>
              </div>

              {/* Supported Payment Channels */}
              <div className="border border-slate-200 rounded-xl p-3.5 bg-white">
                <p className="text-xs font-semibold text-slate-600 mb-2">
                  {lang === 'hi' ? 'Razorpay पर सभी भुगतान विकल्प उपलब्ध हैं:' : 'Supported payment methods on Razorpay:'}
                </p>
                <div className="grid grid-cols-4 gap-2 text-center text-xs text-slate-700">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex flex-col items-center gap-1">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                    <span className="text-[11px] font-medium">UPI / GPay</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex flex-col items-center gap-1">
                    <QrCode className="w-4 h-4 text-indigo-600" />
                    <span className="text-[11px] font-medium">UPI QR</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex flex-col items-center gap-1">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span className="text-[11px] font-medium">All Cards</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex flex-col items-center gap-1">
                    <Building2 className="w-4 h-4 text-violet-600" />
                    <span className="text-[11px] font-medium">NetBanking</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-1">
                <button
                  id="direct-razorpay-pay-btn"
                  onClick={launchLiveRazorpay}
                  disabled={isProcessing}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-base rounded-xl shadow-lg shadow-blue-500/25 transition-all transform active:scale-[0.99] flex items-center justify-center gap-2.5 disabled:opacity-75 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{lang === 'hi' ? 'Razorpay लाइव लिंक तैयार हो रहा है...' : 'Connecting to Razorpay...'}</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
                      <span>
                        {lang === 'hi' ? `₹${payablePrice} भुगतान करें (Razorpay पर जाएं)` : `Pay ₹${payablePrice} on Razorpay`}
                      </span>
                      <ExternalLink className="w-4 h-4 ml-1 opacity-90" />
                    </>
                  )}
                </button>

                <div className="flex flex-col items-center justify-center gap-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lang === 'hi' ? 'Razorpay द्वारा 256-बिट सुरक्षित भुगतान' : '256-bit encrypted by Razorpay'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <button
                      type="button"
                      onClick={() => {
                        closeRazorpayModal();
                        navigate('terms', { tab: 'terms' });
                      }}
                      className="hover:text-blue-600 underline cursor-pointer"
                    >
                      {lang === 'hi' ? 'नियम व शर्तें' : 'Terms & Conditions'}
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => {
                        closeRazorpayModal();
                        navigate('refund', { tab: 'refund' });
                      }}
                      className="hover:text-blue-600 underline cursor-pointer"
                    >
                      {lang === 'hi' ? 'रिफंड नीति' : 'Refund Policy'}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
