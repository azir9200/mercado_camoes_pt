'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../../context/LanguageContext';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  fetchOrders,
  updateOrderStatus,
  fetchLuggageBookings,
  updateLuggageBookingStatus,
  fetchStoreInfo,
  updateLuggageRates,
  loginAdmin,
  isStoredAdminAuthenticated,
  logoutAdmin,
  AUTHORIZED_ADMIN_CREDENTIALS
} from '../../../lib/api';
import { Product, Category, Order, OrderStatus, LuggageBookingConfirmation } from '../../../types';
import {
  Package,
  FolderTree,
  DollarSign,
  ClipboardList,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Save,
  RefreshCw,
  ExternalLink,
  MessageCircle,
  Eye,
  EyeOff,
  X,
  Sliders,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  LogOut,
  Phone,
  KeyRound,
  ArrowUpRight
} from 'lucide-react';

export default function AdminPage() {
  const { lang, t } = useLanguage();
  const isPt = lang === 'pt';

  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'rates' | 'orders'>('products');

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<LuggageBookingConfirmation[]>([]);
  const [rates, setRates] = useState({ oneHour: 2.50, threeHours: 5.00, oneDay: 8.00, extraHour: 1.50 });
  const [loading, setLoading] = useState(true);
  const [savingRate, setSavingRate] = useState(false);
  const [ratesSavedAlert, setRatesSavedAlert] = useState(false);

  // Admin Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [loginIdentifier, setLoginIdentifier] = useState<string>('+351 920 319 177');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Filters & Search
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState<string>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Modals
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form states
  const [prodForm, setProdForm] = useState({
    name_en: '',
    name_pt: '',
    description_en: '',
    description_pt: '',
    price: '3.50',
    stock: '50',
    unit: 'item',
    categoryId: '',
    isFeatured: false,
    imageUrl: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?auto=format&fit=crop&w=600&q=80'
  });

  const [catForm, setCatForm] = useState({
    name_en: '',
    name_pt: '',
    slug: '',
    description_en: '',
    description_pt: '',
    icon: 'ShoppingBag'
  });

  // Load all initial data
  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, cats, ords, books, store] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchOrders(),
        fetchLuggageBookings(),
        fetchStoreInfo()
      ]);
      setProducts(prods);
      setCategories(cats);
      setOrders(ords);
      setBookings(books);
      if (store?.luggageRates) {
        setRates(store.luggageRates);
      }
      if (cats.length > 0 && !prodForm.categoryId) {
        setProdForm(prev => ({ ...prev, categoryId: cats[0].id }));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const authed = isStoredAdminAuthenticated();
    setIsAuthenticated(authed);
    setAuthChecking(false);
    if (authed) {
      loadData();
    } else {
      setLoading(false);
    }
  }, []);

  // Admin Login Action
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await loginAdmin(loginIdentifier, loginPassword);
      if (res.success) {
        setIsAuthenticated(true);
        setLoginPassword('');
        await loadData();
      } else {
        setLoginError(res.error || (isPt ? 'Credenciais de administrador inválidas.' : 'Invalid admin credentials.'));
      }
    } catch {
      setLoginError(isPt ? 'Erro ao autenticar. Tente novamente.' : 'Authentication error. Please retry.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
  };

  // Handlers for Products
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdForm({
      name_en: '',
      name_pt: '',
      description_en: '',
      description_pt: '',
      price: '3.50',
      stock: '50',
      unit: 'item',
      categoryId: categories[0]?.id || '',
      isFeatured: false,
      imageUrl: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?auto=format&fit=crop&w=600&q=80'
    });
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProdForm({
      name_en: prod.name_en,
      name_pt: prod.name_pt,
      description_en: prod.description_en || '',
      description_pt: prod.description_pt || '',
      price: String(prod.price),
      stock: String(prod.stock),
      unit: prod.unit,
      categoryId: prod.categoryId,
      isFeatured: prod.isFeatured,
      imageUrl: prod.images?.[0]?.url || ''
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name_en: prodForm.name_en,
      name_pt: prodForm.name_pt,
      description_en: prodForm.description_en,
      description_pt: prodForm.description_pt,
      price: parseFloat(prodForm.price),
      stock: parseInt(prodForm.stock, 10),
      unit: prodForm.unit,
      categoryId: prodForm.categoryId,
      isFeatured: prodForm.isFeatured,
      images: [
        {
          id: `img-${Date.now()}`,
          url: prodForm.imageUrl,
          isPrimary: true
        }
      ]
    };

    if (editingProduct) {
      await updateProduct(editingProduct.id, payload);
    } else {
      await createProduct(payload);
    }
    setProductModalOpen(false);
    loadData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm(isPt ? 'Tem a certeza que deseja eliminar este produto?' : 'Are you sure you want to delete this product?')) {
      await deleteProduct(id);
      loadData();
    }
  };

  // Handlers for Categories
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCatForm({
      name_en: '',
      name_pt: '',
      slug: '',
      description_en: '',
      description_pt: '',
      icon: 'Tag'
    });
    setCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCatForm({
      name_en: cat.name_en,
      name_pt: cat.name_pt,
      slug: cat.slug,
      description_en: cat.description_en || '',
      description_pt: cat.description_pt || '',
      icon: cat.icon || 'Tag'
    });
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      await updateCategory(editingCategory.id, catForm);
    } else {
      await createCategory(catForm);
    }
    setCategoryModalOpen(false);
    loadData();
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm(isPt ? 'Eliminar esta categoria?' : 'Delete this category?')) {
      await deleteCategory(id);
      loadData();
    }
  };

  // Handlers for Luggage Rates
  const handleSaveRates = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingRate(true);
    try {
      await updateLuggageRates(rates);
      setRatesSavedAlert(true);
      setTimeout(() => setRatesSavedAlert(false), 3000);
    } finally {
      setSavingRate(false);
    }
  };

  // Handlers for Orders & Bookings
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await updateOrderStatus(orderId, status);
    loadData();
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
    await updateLuggageBookingStatus(bookingId, status);
    loadData();
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name_en.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.name_pt.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku?.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = productCatFilter === 'all' || p.categoryId === productCatFilter || p.category?.slug === productCatFilter;
    return matchesSearch && matchesCat;
  });

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    return orderStatusFilter === 'all' || o.status === orderStatusFilter;
  });

  // Calculate stats
  const totalVolume = orders.reduce((sum, o) => sum + o.totalPrice, 0) + bookings.reduce((sum, b) => sum + b.totalPrice, 0);

  // If Not Authenticated -> Show Gorgeous Apple-Style Admin Login Card
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6 relative overflow-hidden"
        >
          {/* Ambient decorative glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white mx-auto shadow-md shadow-emerald-600/25">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {isPt ? 'Acesso ao Painel CMS' : 'Admin CMS Portal'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isPt
                ? 'Área restrita exclusivamente ao gestor do Mercado De Camões'
                : 'Restricted area exclusively for the Mercado De Camões manager'}
            </p>
          </div>

          {/* Error Banner */}
          {loginError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5"
            >
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{loginError}</span>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {isPt ? 'Contacto / Administrador Autorizado' : 'Authorized Phone / Identifier'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="+351 920 319 177"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {isPt ? 'Palavra-passe de Administrador' : 'Admin Security Password'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-700/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loginLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{isPt ? 'A validar...' : 'Authenticating...'}</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>{isPt ? 'Desbloquear Painel CMS' : 'Unlock Admin CMS'}</span>
                </>
              )}
            </button>
          </form>

          {/* Security badge footer */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
            <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>{isPt ? 'Acesso Encriptado & Autenticado' : 'Encrypted & Authenticated Access'}</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Top Banner / Breadcrumb & Admin Session Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 text-xs font-black tracking-wider uppercase">
              <Sliders className="w-3.5 h-3.5" />
              <span>Store CMS & Manager</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>+351 920 319 177 (Super Admin)</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.admin.title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.admin.subtitle} • <span className="font-semibold text-emerald-600">Rua Camões 242, Porto</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{isPt ? 'Atualizar Dados' : 'Sync Live Data'}</span>
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 font-bold text-xs border border-rose-200 dark:border-rose-900/50 shadow-xs transition-all cursor-pointer"
            title="Terminar Sessão"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isPt ? 'Terminar Sessão' : 'Logout'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.admin.stats.totalProducts}</span>
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{products.length}</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.admin.stats.totalOrders}</span>
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{orders.length}</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.admin.stats.activeBookings}</span>
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{bookings.length}</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.admin.stats.totalRevenue}</span>
            <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">€{totalVolume.toFixed(2)}</p>
        </div>
      </div>

      {/* Tab Navigation Navigation (Apple-Style segmented bar) */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 max-w-2xl">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${activeTab === 'products'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
        >
          <Package className="w-4 h-4 text-emerald-500" />
          <span>{t.admin.tabs.products}</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${activeTab === 'categories'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
        >
          <FolderTree className="w-4 h-4 text-emerald-500" />
          <span>{t.admin.tabs.categories}</span>
        </button>

        <button
          onClick={() => setActiveTab('rates')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${activeTab === 'rates'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
        >
          <Clock className="w-4 h-4 text-emerald-500" />
          <span>{t.admin.tabs.rates}</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${activeTab === 'orders'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
        >
          <ClipboardList className="w-4 h-4 text-emerald-500" />
          <span>{t.admin.tabs.orders}</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: PRODUCT MANAGEMENT (CRUD)
          ========================================================================= */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 flex-1 max-w-lg">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={isPt ? 'Pesquisar produto ou SKU...' : 'Search products or SKU...'}
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <select
                value={productCatFilter}
                onChange={(e) => setProductCatFilter(e.target.value)}
                className="px-3.5 py-2.5 text-xs sm:text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              >
                <option value="all">{isPt ? 'Todas as Categorias' : 'All Categories'}</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {isPt ? c.name_pt : c.name_en}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleOpenAddProduct}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-700/25 transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>{isPt ? 'Adicionar Novo Produto' : 'Add New Product'}</span>
            </button>
          </div>

          {/* Products Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-4 px-6">{isPt ? 'Produto' : 'Product'}</th>
                    <th className="py-4 px-4">{isPt ? 'Categoria' : 'Category'}</th>
                    <th className="py-4 px-4">{isPt ? 'Preço' : 'Price'}</th>
                    <th className="py-4 px-4">{isPt ? 'Stock' : 'Stock'}</th>
                    <th className="py-4 px-4">{isPt ? 'Destaque' : 'Featured'}</th>
                    <th className="py-4 px-6 text-right">{isPt ? 'Ações' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredProducts.map(prod => (
                    <tr key={prod.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?auto=format&fit=crop&w=100&q=80'}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200 dark:border-slate-700"
                          />
                          <div className="min-w-0">
                            <span className="font-extrabold text-slate-900 dark:text-white block truncate max-w-xs">
                              {isPt ? prod.name_pt : prod.name_en}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              SKU: {prod.sku || prod.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                        {prod.category ? (isPt ? prod.category.name_pt : prod.category.name_en) : '—'}
                      </td>

                      <td className="py-3.5 px-4 font-black text-slate-900 dark:text-white">
                        €{prod.price.toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                        <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-100 dark:bg-slate-800 font-bold">
                          {prod.stock} {prod.unit}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {prod.isFeatured ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                            ★ {isPt ? 'Sim' : 'Yes'}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditProduct(prod)}
                          className="p-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: CATEGORY MANAGEMENT (CRUD)
          ========================================================================= */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {isPt ? 'Estrutura das secções da loja e filtros do catálogo.' : 'Store catalog categories & navigation structure.'}
            </p>
            <button
              onClick={handleOpenAddCategory}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-700/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isPt ? 'Criar Categoria' : 'Create Category'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => (
              <div
                key={cat.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl">
                    #{idx + 1} • {cat.slug}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditCategory(cat)}
                      className="p-2 text-slate-500 hover:text-emerald-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-lg font-black text-slate-900 dark:text-white">
                    {cat.name_pt}
                  </h4>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                    {cat.name_en}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 pt-1">
                    {cat.description_pt || cat.description_en || '—'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: LUGGAGE STORAGE RATES
          ========================================================================= */}
      {activeTab === 'rates' && (
        <form onSubmit={handleSaveRates} className="max-w-3xl space-y-8">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {isPt ? 'Tarifário de Depósito de Bagagem (Porto)' : 'Porto Luggage Storage Rates'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {isPt
                ? 'Os valores aqui configurados atualizam em tempo real a calculadora do site e as mensagens do WhatsApp.'
                : 'Rates set here dynamically update the customer calculator and WhatsApp pricing messages.'}
            </p>
          </div>

          {ratesSavedAlert && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm font-bold flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>{isPt ? 'Tarifas guardadas com sucesso!' : 'Rates saved successfully!'}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {isPt ? 'Tarifa 1 Hora' : '1 Hour Rate'}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white">€</span>
                <input
                  type="number"
                  step="0.5"
                  value={rates.oneHour}
                  onChange={(e) => setRates({ ...rates, oneHour: parseFloat(e.target.value) || 0 })}
                  className="w-full text-xl font-black px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <p className="text-xs text-slate-400">{isPt ? 'Por mala (paragem rápida)' : 'Per bag (quick stop)'}</p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {isPt ? 'Tarifa 3 Horas (Mais Popular)' : '3 Hours Rate (Popular)'}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white">€</span>
                <input
                  type="number"
                  step="0.5"
                  value={rates.threeHours}
                  onChange={(e) => setRates({ ...rates, threeHours: parseFloat(e.target.value) || 0 })}
                  className="w-full text-xl font-black px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <p className="text-xs text-slate-400">{isPt ? 'Por mala (tarifa padrão)' : 'Per bag (standard rate)'}</p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {isPt ? 'Tarifa Diária (24 Horas)' : 'Daily Rate (24 Hours)'}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white">€</span>
                <input
                  type="number"
                  step="0.5"
                  value={rates.oneDay}
                  onChange={(e) => setRates({ ...rates, oneDay: parseFloat(e.target.value) || 0 })}
                  className="w-full text-xl font-black px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <p className="text-xs text-slate-400">{isPt ? 'Por mala (dia completo)' : 'Per bag (full day)'}</p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {isPt ? 'Hora Adicional (Personalizada)' : 'Extra Hour (Custom)'}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white">€</span>
                <input
                  type="number"
                  step="0.5"
                  value={rates.extraHour}
                  onChange={(e) => setRates({ ...rates, extraHour: parseFloat(e.target.value) || 0 })}
                  className="w-full text-xl font-black px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <p className="text-xs text-slate-400">{isPt ? 'Por hora suplementar' : 'Per additional hour'}</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={savingRate}
            className="px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-emerald-700/25 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{savingRate ? (isPt ? 'A Gravar...' : 'Saving...') : (isPt ? 'Gravar Novas Tarifas' : 'Save Rates')}</span>
          </button>
        </form>
      )}

      {/* =========================================================================
          TAB 4: ORDERS & BOOKINGS LOG
          ========================================================================= */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Status Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {['all', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${orderStatusFilter === st
                      ? 'bg-slate-900 text-white dark:bg-emerald-600'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                    }`}
                >
                  {st === 'all' ? (isPt ? 'Todos' : 'All') : st}
                </button>
              ))}
            </div>

            <span className="text-xs font-bold text-slate-400">
              {filteredOrders.length} {isPt ? 'encomendas' : 'orders'} • {bookings.length} {isPt ? 'reservas malas' : 'luggage bookings'}
            </span>
          </div>

          {/* Grocery Orders Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-emerald-500" />
              <span>{isPt ? 'Encomendas da Mercearia' : 'Grocery Orders'}</span>
            </h4>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-4 px-6">{isPt ? 'Ref / Tipo' : 'Ref / Source'}</th>
                      <th className="py-4 px-4">{isPt ? 'Cliente' : 'Customer'}</th>
                      <th className="py-4 px-4">{isPt ? 'Artigos' : 'Items'}</th>
                      <th className="py-4 px-4">{isPt ? 'Total' : 'Total'}</th>
                      <th className="py-4 px-4">{isPt ? 'Estado' : 'Status'}</th>
                      <th className="py-4 px-6 text-right">{isPt ? 'Contacto' : 'Contact'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredOrders.map(order => (
                      <tr key={order.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-6">
                          <span className="font-mono font-bold text-slate-900 dark:text-white block">
                            {order.orderNumber}
                          </span>
                          <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${order.orderType === 'WHATSAPP'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                            }`}>
                            {order.orderType === 'WHATSAPP' ? '📱 WhatsApp' : '⚡ Direct API'}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <span className="font-bold text-slate-900 dark:text-white block">{order.customerName}</span>
                          <span className="text-xs text-slate-400">{order.customerPhone}</span>
                          <span className="text-[11px] text-emerald-600 block mt-0.5">
                            {order.deliveryOption === 'pickup' ? (isPt ? 'Levantamento Loja' : 'Pickup') : (isPt ? 'Entrega Local' : 'Local Delivery')}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <div className="space-y-0.5 max-w-xs text-xs">
                            {order.items.map((it, idx) => (
                              <div key={idx} className="truncate text-slate-600 dark:text-slate-300">
                                {it.quantity}× {it.name}
                              </div>
                            ))}
                            {order.notes && (
                              <span className="text-[10px] italic text-slate-400 block pt-1">
                                Obs: {order.notes}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-4 font-black text-slate-900 dark:text-white text-base">
                          €{order.totalPrice.toFixed(2)}
                        </td>

                        <td className="py-4 px-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black border cursor-pointer ${order.status === 'COMPLETED'
                                ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300'
                                : order.status === 'CONFIRMED'
                                  ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-300'
                                  : order.status === 'CANCELLED'
                                    ? 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-300'
                                    : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300'
                              }`}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>

                        <td className="py-4 px-6 text-right">
                          {order.customerPhone && (
                            <a
                              href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] text-white text-xs font-bold shadow-xs hover:scale-105 transition-all"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-white" />
                              <span>WhatsApp</span>
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Luggage Bookings Section */}
          <div className="space-y-3 pt-6">
            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-500" />
              <span>{isPt ? 'Depósitos de Bagagem (Rua Camões 242)' : 'Luggage Bookings (Porto)'}</span>
            </h4>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-4 px-6">{isPt ? 'Referência' : 'Reference'}</th>
                      <th className="py-4 px-4">{isPt ? 'Viajante' : 'Traveler'}</th>
                      <th className="py-4 px-4">{isPt ? 'Malas' : 'Bags'}</th>
                      <th className="py-4 px-4">{isPt ? 'Horas' : 'Duration'}</th>
                      <th className="py-4 px-4">{isPt ? 'Valor' : 'Amount'}</th>
                      <th className="py-4 px-4">{isPt ? 'Estado' : 'Status'}</th>
                      <th className="py-4 px-6 text-right">{isPt ? 'Ação' : 'Action'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {bookings.map(booking => (
                      <tr key={booking.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-6">
                          <span className="font-mono font-bold text-slate-900 dark:text-white">
                            {booking.bookingReference}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <span className="font-bold text-slate-900 dark:text-white block">{booking.customerName}</span>
                          <span className="text-xs text-slate-400">{booking.dropoffTime ? new Date(booking.dropoffTime).toLocaleString('pt-PT') : ''}</span>
                        </td>

                        <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-200">
                          {booking.bagCount} {isPt ? 'mala(s)' : 'bag(s)'}
                        </td>

                        <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                          {booking.durationHours}h ({booking.durationType})
                        </td>

                        <td className="py-4 px-4 font-black text-slate-900 dark:text-white">
                          €{booking.totalPrice.toFixed(2)}
                        </td>

                        <td className="py-4 px-4">
                          <select
                            value={booking.status}
                            onChange={(e) => handleUpdateBookingStatus(booking.id, e.target.value)}
                            className="px-2.5 py-1.5 rounded-xl text-xs font-black border cursor-pointer bg-slate-50 dark:bg-slate-800"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="STORED">STORED</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <span className="text-xs text-emerald-600 font-bold">
                            Porto Hub
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PRODUCT EDIT / CREATE MODAL
          ========================================================================= */}
      {productModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {editingProduct ? (isPt ? 'Editar Produto' : 'Edit Product') : (isPt ? 'Adicionar Produto' : 'Add Product')}
              </h3>
              <button
                onClick={() => setProductModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isPt ? 'Nome (Português) *' : 'Name (Portuguese) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={prodForm.name_pt}
                    onChange={(e) => setProdForm({ ...prodForm, name_pt: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isPt ? 'Nome (English) *' : 'Name (English) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={prodForm.name_en}
                    onChange={(e) => setProdForm({ ...prodForm, name_en: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isPt ? 'Preço (€) *' : 'Price (€) *'}
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    required
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isPt ? 'Stock' : 'Stock'}
                  </label>
                  <input
                    type="number"
                    value={prodForm.stock}
                    onChange={(e) => setProdForm({ ...prodForm, stock: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isPt ? 'Unidade' : 'Unit'}
                  </label>
                  <input
                    type="text"
                    placeholder="bottle, item, kg"
                    value={prodForm.unit}
                    onChange={(e) => setProdForm({ ...prodForm, unit: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isPt ? 'Categoria *' : 'Category *'}
                </label>
                <select
                  value={prodForm.categoryId}
                  onChange={(e) => setProdForm({ ...prodForm, categoryId: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name_pt} / {c.name_en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isPt ? 'URL da Imagem' : 'Image URL'}
                </label>
                <input
                  type="url"
                  value={prodForm.imageUrl}
                  onChange={(e) => setProdForm({ ...prodForm, imageUrl: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isPt ? 'Descrição (PT)' : 'Description (PT)'}
                  </label>
                  <textarea
                    rows={2}
                    value={prodForm.description_pt}
                    onChange={(e) => setProdForm({ ...prodForm, description_pt: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isPt ? 'Descrição (EN)' : 'Description (EN)'}
                  </label>
                  <textarea
                    rows={2}
                    value={prodForm.description_en}
                    onChange={(e) => setProdForm({ ...prodForm, description_en: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={prodForm.isFeatured}
                  onChange={(e) => setProdForm({ ...prodForm, isFeatured: e.target.checked })}
                  className="rounded-md accent-emerald-600 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="featuredCheck" className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                  {isPt ? 'Destacar produto na página inicial' : 'Feature this product on homepage'}
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  {isPt ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
                >
                  {isPt ? 'Guardar Produto' : 'Save Product'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* =========================================================================
          CATEGORY EDIT / CREATE MODAL
          ========================================================================= */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {editingCategory ? (isPt ? 'Editar Categoria' : 'Edit Category') : (isPt ? 'Nova Categoria' : 'New Category')}
              </h3>
              <button
                onClick={() => setCategoryModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isPt ? 'Nome (Português) *' : 'Name (Portuguese) *'}
                </label>
                <input
                  type="text"
                  required
                  value={catForm.name_pt}
                  onChange={(e) => setCatForm({ ...catForm, name_pt: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isPt ? 'Nome (English) *' : 'Name (English) *'}
                </label>
                <input
                  type="text"
                  required
                  value={catForm.name_en}
                  onChange={(e) => setCatForm({ ...catForm, name_en: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isPt ? 'Slug (ex: vinhos-porto) *' : 'Slug *'}
                </label>
                <input
                  type="text"
                  required
                  value={catForm.slug}
                  onChange={(e) => setCatForm({ ...catForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  {isPt ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
                >
                  {isPt ? 'Gravar Categoria' : 'Save Category'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
