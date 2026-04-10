import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { deliveryAPI } from '@food/api';
import { initRazorpayPayment } from '@food/utils/razorpay';
import { toast } from 'sonner';
import {
  ShoppingBag, Search, Package, X, ChevronRight,
  Loader2, ShoppingCart, CheckCircle2, Clock, ListOrdered, Store
} from 'lucide-react';
import { BRAND_THEME } from '@/config/brandTheme';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const RUPEE = '₹';
const statusColor = (s) => {
  const map = { confirmed: 'bg-blue-100 text-blue-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700', pending: 'bg-yellow-100 text-yellow-700' };
  return map[s] || 'bg-gray-100 text-gray-600';
};

// ─── Product Card ──────────────────────────────────────────────────────────────

function ProductCard({ product, onOrder }) {
  const hasStock = (product.variants || []).some(v => v.stock > 0);
  const lowestPrice = (product.variants || []).length > 0
    ? Math.min(...product.variants.map(v => Number(v.price) || 0))
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden active:scale-[0.98] transition-all cursor-pointer"
      onClick={() => onOrder(product)}
    >
      <div className="relative h-32 bg-slate-50">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-8 h-8 text-slate-300" />
          </div>
        )}
        {!hasStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-black/60 rounded-full">Out of Stock</span>
          </div>
        )}
        {product.category && (
          <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/90 text-slate-700 shadow-sm">
            {product.category}
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-bold text-slate-900 text-[15px] leading-tight line-clamp-1">{product.name}</h3>
        <div className="flex items-center justify-between mt-2 gap-2">
          <div className="min-w-0">
            {(product.variants || []).length > 0 ? (
              <p className="text-base font-black text-slate-900 truncate">
                {RUPEE}{(product.variants[0]?.price) || 0}
              </p>
            ) : (
              <p className="text-base font-black text-slate-900 truncate">
                {RUPEE}{Number(product.price) || 0}
              </p>
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onOrder(product); }}
            disabled={!hasStock}
            className="shrink-0 inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-full text-white disabled:opacity-40 shadow-sm transition-all hover:shadow-md active:scale-95"
            style={{ backgroundColor: hasStock ? BRAND_THEME.colors.brand.primary : '#9CA3AF' }}
          >
            <ShoppingCart className="w-3.5 h-3.5" /> Order
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Order Modal ───────────────────────────────────────────────────────────────

function OrderModal({ product, onClose, onSuccess }) {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (product) {
      const firstAvailable = (product.variants || []).find(v => v.stock > 0);
      setSelectedVariant(firstAvailable || null);
      setQuantity(1);
      setPaymentMethod('razorpay');
    }
  }, [product]);

  if (!product) return null;

  const totalAmount = selectedVariant ? selectedVariant.price * quantity : 0;
  const maxQty = selectedVariant ? selectedVariant.stock : 0;

  const handlePlace = async () => {
    if (!selectedVariant) { toast.error('Please select a variant'); return; }
    try {
      setPlacing(true);
      const res = await deliveryAPI.placeStoreOrder({
        productId: product._id,
        variantId: selectedVariant._id,
        quantity,
        paymentMethod: 'razorpay'
      });
      
      const sessionData = res?.data?.data || res?.data;
      if (!sessionData?.razorpayOrderId) throw new Error("Could not initialize payment");
      
      const orderData = sessionData.order;

      await initRazorpayPayment({
        key: sessionData.razorpayKeyId,
        amount: sessionData.amount,
        order_id: sessionData.razorpayOrderId,
        name: 'Store Shop',
        description: `Order for ${product.name}`,
        handler: async (response) => {
          try {
            await deliveryAPI.verifyStoreOrder({
              orderId: orderData._id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });
            toast.success('Order placed and payment verified!');
            onSuccess();
            onClose();
          } catch (err) {
            toast.error('Payment verification failed');
          }
        },
        onError: (err) => {
          toast.error(err.description || 'Payment Failed');
          setPlacing(false);
        },
        onClose: () => {
          setPlacing(false);
        }
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to initialize order');
      setPlacing(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[800] flex items-end">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={onClose} />
        <motion.div
          initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative w-full bg-white rounded-t-3xl shadow-2xl overflow-hidden"
        >
          {/* Product Header */}
          <div className="relative h-40 bg-gray-100">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><Package className="w-14 h-14 text-gray-300" /></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-white active:scale-90 transition-all">
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-4 left-4">
              <p className="text-white font-black text-lg leading-tight">{product.name}</p>
              {product.category && <p className="text-white/70 text-xs font-medium">{product.category}</p>}
            </div>
          </div>

          <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Variants */}
            <div>
              {product.variants.length > 1 && <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Select Variant</p>}
              <div className="space-y-1.5">
                {(product.variants || []).map(v => (
                  <button
                    key={v._id}
                    disabled={v.stock === 0}
                    onClick={() => { setSelectedVariant(v); setQuantity(1); }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border-2 transition-all ${
                      selectedVariant?._id === v._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center gap-3">
                      {product.variants.length > 1 && (
                        <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${selectedVariant?._id === v._id ? 'border-blue-500' : 'border-gray-300'}`}>
                          {selectedVariant?._id === v._id && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                        </div>
                      )}
                      <div className="text-left">
                        <p className="font-bold text-gray-900 text-sm">{v.name}</p>
                        <p className="text-[10px] text-gray-500">Stock: {v.stock}</p>
                      </div>
                    </div>
                    <p className="font-black text-gray-900">{RUPEE}{v.price}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            {selectedVariant && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Quantity</p>
                <div className="flex items-center gap-4">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-700 font-bold text-lg active:scale-90 transition-all">−</button>
                  <span className="text-lg font-black text-gray-900 min-w-[1.5rem] text-center">{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(maxQty, q + 1))} disabled={quantity >= maxQty} className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-700 font-bold text-lg disabled:opacity-40 active:scale-90 transition-all">+</button>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Payment Method</p>
              <div className="grid grid-cols-1">
                <button
                  className="w-full flex items-center justify-between p-3 rounded-xl border-2 border-blue-500 bg-blue-50 transition-all text-left"
                >
                  <div>
                    <p className="font-bold text-sm text-gray-900">Online Payment</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Pay via Razorpay</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                </button>
              </div>
            </div>

            {/* Total + CTA */}
            {selectedVariant && (
              <div className="pt-1">
                <div className="flex items-center justify-between mb-3 px-1">
                  <p className="text-sm font-bold text-gray-600">Total Amount</p>
                  <p className="text-xl font-black text-gray-900">{RUPEE}{totalAmount}</p>
                </div>
                <button
                  onClick={handlePlace}
                  disabled={placing}
                  className="w-full py-3 rounded-xl text-white font-black text-[15px] tracking-wide flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
                  style={{ background: BRAND_THEME.gradients.primary }}
                >
                  {placing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
                  {placing ? 'Placing Order...' : 'Confirm Order'}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// ─── Order History Item ────────────────────────────────────────────────────────

function OrderHistoryItem({ order }) {
  const isStandard = order.variantName === "Standard";
  
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex gap-3.5">
        <div className="w-11 h-11 rounded-full bg-orange-50 flex items-center justify-center shrink-0 border border-orange-100 overflow-hidden">
           {order.productImage ? (
             <img src={order.productImage} alt={order.productName} className="w-full h-full object-cover" />
           ) : (
             <Package className="w-5 h-5 text-orange-500" />
           )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-0.5">
            <p className="font-bold text-gray-900 text-[15px] truncate pr-2">{order.productName || 'Store Item'}</p>
            <p className="font-black text-gray-900 text-[15px]">{RUPEE}{order.totalAmount}</p>
          </div>
          
          <div className="flex justify-between items-center mb-2.5">
            <p className="text-xs text-gray-500">
              {!isStandard && <span className="font-medium text-gray-700">{order.variantName}</span>}
              {!isStandard && " × "}
              <span className="font-medium">{order.quantity} item{order.quantity > 1 ? 's' : ''}</span>
            </p>
            <p className="text-[10px] text-gray-400 font-semibold">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${statusColor(order.orderStatus)}`}>
              {order.orderStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function ShopV2() {
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'orders'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [ordersLoaded, setOrdersLoaded] = useState(false);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoadingProducts(true);
      const res = await deliveryAPI.getStoreProducts({ limit: 100 });
      const list = res?.data?.data?.products || res?.data?.products || [];
      setProducts(list);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      setLoadingOrders(true);
      const res = await deliveryAPI.getMyStoreOrders({ limit: 50 });
      const list = res?.data?.data?.orders || [];
      setOrders(list);
      setOrdersLoaded(true);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    if (activeTab === 'orders' && !ordersLoaded) fetchOrders();
  }, [activeTab, ordersLoaded, fetchOrders]);

  const filteredProducts = products.filter(p =>
    !searchQuery ||
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md" style={{ background: BRAND_THEME.gradients.primary }}>
            <Store className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-black text-gray-900 text-base leading-tight">Partner Shop</h1>
            <p className="text-[10px] text-gray-400 font-medium">Exclusive items for you</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-gray-100">
          {[
            { key: 'browse', label: 'Browse', icon: ShoppingBag },
            { key: 'orders', label: 'My Orders', icon: ListOrdered },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold transition-all border-b-2 ${
                activeTab === tab.key ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-400'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.key === 'orders' && orders.length > 0 && (
                <span className="w-5 h-5 text-[10px] font-black rounded-full bg-blue-500 text-white flex items-center justify-center">{orders.length > 9 ? '9+' : orders.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-28">
        {activeTab === 'browse' ? (
          <>
            {/* Search */}
            <div className="px-4 pt-4 pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent shadow-sm"
                  style={{ focusRingColor: BRAND_THEME.colors.brand.primary }}
                />
              </div>
            </div>

            {loadingProducts ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: BRAND_THEME.colors.brand.primary }} />
                <p className="text-sm text-gray-500 font-medium">Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Package className="w-12 h-12 text-gray-300" />
                <p className="text-sm font-bold text-gray-600">No products available</p>
                <p className="text-xs text-gray-400">Check back later for new items</p>
              </div>
            ) : (
              <div className="px-4 pt-2 pb-4 grid grid-cols-2 gap-3">
                {filteredProducts.map(p => (
                  <ProductCard key={p._id} product={p} onOrder={setSelectedProduct} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="px-4 pt-4 space-y-3">
            {loadingOrders ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-7 h-7 animate-spin" style={{ color: BRAND_THEME.colors.brand.primary }} />
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <ShoppingCart className="w-12 h-12 text-gray-300" />
                <p className="text-sm font-bold text-gray-600">No orders yet</p>
                <p className="text-xs text-gray-400">Browse products and place your first order</p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="mt-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-md"
                  style={{ background: BRAND_THEME.gradients.primary }}
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <>
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3.5 mb-2 mt-1 mx-2 flex items-start gap-3 shadow-sm">
                   <div className="bg-blue-100 p-1.5 rounded-lg shrink-0 mt-0.5">
                     <Store className="w-5 h-5 text-blue-600" />
                   </div>
                   <div>
                     <p className="text-xs font-black text-blue-900 mb-1">Admin will contact you soon!</p>
                     <p className="text-[11px] text-blue-800 leading-snug">
                       All orders are processed manually. Keep your payment proof ready, our team will reach out to fulfill your order.
                     </p>
                   </div>
                </div>
                
                <div className="flex items-center justify-between pb-2 px-2 mt-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{orders.length} Order{orders.length !== 1 ? 's' : ''}</p>
                  <button onClick={fetchOrders} className="text-xs font-bold" style={{ color: BRAND_THEME.colors.brand.primary }}>Refresh</button>
                </div>
                
                <div className="space-y-3 px-1 pb-4">
                  {orders.map(o => <OrderHistoryItem key={o._id} order={o} />)}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Order Modal */}
      {selectedProduct && (
        <OrderModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSuccess={() => {
            fetchProducts();
            setOrdersLoaded(false); // force refetch on next tab switch
          }}
        />
      )}
    </div>
  );
}
