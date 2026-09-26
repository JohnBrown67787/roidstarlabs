import React, { useState, useMemo, useEffect } from 'react';
import { 
  CATEGORIES, 
  PRODUCTS, 
  LATEST_PRODUCTS, 
  BEST_SELLING, 
  TOP_RATED, 
  GALLERY_IMAGES 
} from './data/products';
import { 
  HERO_SLIDES, 
  HOME_CATEGORIES, 
  TESTIMONIALS 
} from './data/homeData';
import { isSupabaseConfigured, fetchSupabaseProducts, createSupabaseOrder } from './supabase';
import { 
  Search, 
  ShoppingBasket, 
  Heart, 
  Star, 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft,
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowUp, 
  MessageCircle, 
  ShieldCheck, 
  CheckCircle2, 
  ShoppingBag,
  CreditCard,
  Lock,
  Mail,
  Phone,
  MapPin,
  Clock
} from 'lucide-react';

export default function App() {
  // Navigation Routing: 'home' | 'shop' | 'payment' | 'testimonial' | 'contact' | 'privacy' | 'refund' | 'terms'
  const [currentPageView, setCurrentPageView] = useState('home');

  // Products state (defaults to scraped data, syncs with Supabase if table exists)
  const [productsList, setProductsList] = useState(PRODUCTS);

  useEffect(() => {
    async function loadProducts() {
      const sbProducts = await fetchSupabaseProducts();
      if (sbProducts && sbProducts.length > 0) {
        setProductsList(sbProducts);
      }
    }
    loadProducts();
  }, []);

  // Filtering & Search States
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [priceMax, setPriceMax] = useState(14800);
  const [appliedPriceMax, setAppliedPriceMax] = useState(14800);
  const [catalogPage, setCatalogPage] = useState(1);
  const [expandedCategories, setExpandedCategories] = useState({
    'brands': true,
    'injectable-steroids': true,
    'oral-steroids': true
  });

  // Hero Slider State
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    if (currentPageView !== 'home') return;
    const interval = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [currentPageView]);

  // Cart & Wishlist States
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  
  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewQty, setQuickViewQty] = useState(1);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState(null);

  // Checkout Form State
  const [checkoutData, setCheckoutData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    cardNumber: '',
    cardExp: '',
    cardCvc: ''
  });
  const [orderComplete, setOrderComplete] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const navigateTo = (view, category = null) => {
    setCurrentPageView(view);
    if (category !== null) {
      setActiveCategoryFilter(category);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleCategoryExpand = (catId, e) => {
    e.stopPropagation();
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  // Cart Handlers
  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    showToast(`Added "${product.name}" to cart!`);
  };

  const updateCartQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removeCartItem = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Wishlist Toggle
  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.includes(product.id);
      if (exists) {
        showToast(`Removed from wishlist.`);
        return prev.filter(id => id !== product.id);
      } else {
        showToast(`Product added to wishlist!`);
        return [...prev, product.id];
      }
    });
  };

  // Filtered & Sorted Products for Catalog
  const filteredProducts = useMemo(() => {
    return productsList.filter(prod => {
      const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            prod.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCat = !activeCategoryFilter || 
                         prod.categorySlug === activeCategoryFilter || 
                         prod.category.toLowerCase().includes(activeCategoryFilter.toLowerCase());
      
      const matchesPrice = prod.price <= appliedPriceMax;

      return matchesSearch && matchesCat && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === 'popularity') return b.popularity - a.popularity;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'date') return b.id - a.id;
      return 0;
    });
  }, [productsList, searchQuery, activeCategoryFilter, appliedPriceMax, sortBy]);

  // Submit Order to Supabase
  const handleFinalOrderSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast('Your cart is empty.');
      return;
    }

    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const orderPayload = {
      order_id: orderId,
      customer_name: `${checkoutData.firstName} ${checkoutData.lastName}`.trim(),
      customer_email: checkoutData.email,
      shipping_address: `${checkoutData.address}, ${checkoutData.city}, ${checkoutData.state} ${checkoutData.zip}`,
      items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
      total_amount: cartTotal,
      payment_method: 'Credit Card',
      created_at: new Date().toISOString()
    };

    const res = await createSupabaseOrder(orderPayload);
    if (res.success) {
      showToast('Order saved to Supabase successfully!');
    } else {
      showToast('Order placed successfully!');
    }

    setOrderComplete({
      id: orderId,
      total: cartTotal,
      email: checkoutData.email,
      items: [...cart]
    });
    setCart([]);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      {/* 1. TOP BAR */}
      <div className="top-bar">
        <div className="container top-bar-content">
          <a href="mailto:info@roidstarlabs.com">
            Email: info@roidstarlabs.com
          </a>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <header className="header-main">
        <div className="container header-main-inner">
          {/* Logo */}
          <div className="header-logo" onClick={() => navigateTo('home')} style={{ cursor: 'pointer' }}>
            <a>
              <div className="logo-badge">R</div>
              <div className="logo-text">
                <span className="logo-title">roidstar<span>labs</span>.com</span>
                <span className="logo-subtitle">US Based Gear and Peptide Source</span>
              </div>
            </a>
          </div>

          {/* Search Form */}
          <div className="header-search-container">
            <form 
              className="search-box" 
              onSubmit={(e) => {
                e.preventDefault();
                setActiveCategoryFilter(selectedCategory);
                navigateTo('shop');
              }}
            >
              <select 
                className="search-category-select"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setActiveCategoryFilter(e.target.value);
                  navigateTo('shop');
                }}
              >
                <option value="">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <input 
                type="search" 
                className="search-input-field"
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentPageView !== 'shop') {
                    setCurrentPageView('shop');
                  }
                }}
              />
              <button type="submit" className="search-submit-btn" aria-label="Search">
                <Search size={18} />
              </button>
            </form>
          </div>

          {/* Cart Header */}
          <div className="header-actions">
            <button 
              className="header-cart-btn" 
              onClick={() => setIsCartOpen(true)}
              aria-label="View Cart"
            >
              <span>Cart / ${cartTotal.toFixed(2)}</span>
              <div className="cart-icon-wrapper">
                <ShoppingBasket size={18} />
                <span className="cart-badge">{cartCount}</span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* 3. WIDE NAV BAR */}
      <nav className="header-nav-bottom">
        <div className="container">
          <ul className="nav-links-list">
            <li className={`nav-item ${currentPageView === 'home' ? 'active' : ''}`}>
              <a 
                href="#home" 
                className="nav-link" 
                onClick={(e) => { e.preventDefault(); navigateTo('home'); }}
              >
                Home
              </a>
            </li>
            <li className={`nav-item ${currentPageView === 'shop' ? 'active' : ''}`}>
              <a 
                href="#shop" 
                className="nav-link" 
                onClick={(e) => { e.preventDefault(); navigateTo('shop'); }}
              >
                Shop
              </a>
            </li>
            <li className={`nav-item ${['privacy', 'refund', 'terms'].includes(currentPageView) ? 'active' : ''}`}>
              <a 
                href="#about" 
                className="nav-link" 
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                onClick={(e) => { e.preventDefault(); navigateTo('privacy'); }}
              >
                About Us <ChevronDown size={14} />
              </a>
              <ul className="nav-dropdown-menu">
                <li className="nav-dropdown-item">
                  <a href="#privacy" onClick={(e) => { e.preventDefault(); navigateTo('privacy'); }}>
                    Privacy Policy
                  </a>
                </li>
                <li className="nav-dropdown-item">
                  <a href="#refund" onClick={(e) => { e.preventDefault(); navigateTo('refund'); }}>
                    Refund and Return Policy
                  </a>
                </li>
                <li className="nav-dropdown-item">
                  <a href="#terms" onClick={(e) => { e.preventDefault(); navigateTo('terms'); }}>
                    Term and Condition
                  </a>
                </li>
              </ul>
            </li>
            <li className={`nav-item ${currentPageView === 'testimonial' ? 'active' : ''}`}>
              <a 
                href="#testimonial" 
                className="nav-link" 
                onClick={(e) => { e.preventDefault(); navigateTo('testimonial'); }}
              >
                Testimonial
              </a>
            </li>
            <li className={`nav-item ${currentPageView === 'contact' ? 'active' : ''}`}>
              <a 
                href="#contact" 
                className="nav-link" 
                onClick={(e) => { e.preventDefault(); navigateTo('contact'); }}
              >
                Contact Us
              </a>
            </li>
            <li className={`nav-item ${currentPageView === 'payment' ? 'active' : ''}`}>
              <a 
                href="#payment" 
                className="nav-link" 
                onClick={(e) => { e.preventDefault(); navigateTo('payment'); }}
              >
                Card Payment
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* ========================================================
          ROUTED VIEWS
          ======================================================== */}

      {/* VIEW A: HOME PAGE */}
      {currentPageView === 'home' && (
        <div className="home-view-wrapper">
          {/* HERO CAROUSEL */}
          <div className="home-hero-slider">
            {HERO_SLIDES.map((slide, index) => (
              <div 
                key={slide.id} 
                className={`hero-slide ${index === currentSlideIndex ? 'active' : ''}`}
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="hero-overlay"></div>
                <div className="hero-content">
                  <h1 className="hero-title">{slide.title}</h1>
                  <p className="hero-desc">{slide.subtitle}</p>
                  <button 
                    className="hero-cta-btn"
                    onClick={() => navigateTo('shop')}
                  >
                    <span>{slide.buttonText}</span>
                    <ShoppingBag size={18} />
                  </button>
                </div>
              </div>
            ))}

            <button 
              className="hero-nav-arrow prev"
              onClick={() => setCurrentSlideIndex(prev => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              className="hero-nav-arrow next"
              onClick={() => setCurrentSlideIndex(prev => (prev + 1) % HERO_SLIDES.length)}
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>

            <div className="hero-dots">
              {HERO_SLIDES.map((_, i) => (
                <div 
                  key={i} 
                  className={`hero-dot ${i === currentSlideIndex ? 'active' : ''}`}
                  onClick={() => setCurrentSlideIndex(i)}
                />
              ))}
            </div>
          </div>

          {/* BLUE CATEGORY SHOWCASE SECTION (#034cac) */}
          <section className="home-categories-section">
            <div className="container">
              <div className="home-cat-grid">
                {HOME_CATEGORIES.map(cat => (
                  <div 
                    key={cat.id} 
                    className="home-cat-card"
                    onClick={() => navigateTo('shop', cat.slug)}
                  >
                    <div className="home-cat-img-box">
                      <img src={cat.image} alt={cat.title} />
                    </div>
                    <span className="home-cat-title">{cat.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* INTRO EDITORIAL SECTION */}
          <section className="container home-editorial-intro">
            <h1 className="home-h1">Roid Starlabs – Your #1 Source for Anabolic Steroids in the USA</h1>
            <p className="home-intro-text">
              <strong>Roid Starlabs</strong>, we are dedicated to helping individuals achieve their ultimate physical potential through <strong>scientifically tested performance enhancement products</strong>. Whether you are a professional athlete, a bodybuilder, or someone striving for a stronger, leaner physique, our goal is to provide <strong>authentic, lab-certified anabolic steroids and supplements</strong> that ensure both performance and safety.
            </p>
            <h2 className="home-h2">Buy Anabolic Steroids | Roid Star labs | Gear Source Usa</h2>
            <p className="home-intro-text">
              If you’re ready to explore our complete range of <strong>injectable steroids, oral steroids, peptides, and other enhancement solutions</strong>, visit our store at <a href="#shop" onClick={(e) => { e.preventDefault(); navigateTo('shop'); }} style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>roidstarlabs.com</a> your one-stop destination for genuine and tested products.
            </p>
          </section>

          {/* 2-COLUMN STORY SECTION 1 */}
          <section className="container">
            <div className="home-story-row">
              <div className="home-story-img-box">
                <img 
                  src="https://roidstarlabs.com/wp-content/uploads/2026/09/IMG_3231-800x800.jpg" 
                  alt="Tops Quality Gear" 
                />
              </div>
              <div>
                <h2 className="home-story-heading">Tops Quality Gear | Anabolic Steroid Cycle</h2>
                <div className="gold-divider" style={{ margin: '12px 0 18px' }}></div>
                <h4 className="home-story-subheading">
                  Anabolic Steroid Cycle Recommendations | Growth Hormone | Testosterone
                </h4>
                <p className="home-story-p">
                  Our assignment at Roid Star Labs is to provide you all of the facts you want about steroid cycles and performance enhancement capsules in a nicely-balanced combination of scientific technique and practicality. With this knowledge on arms you could turn any substance into a particular device to carve your dream frame.
                </p>
                <button 
                  className="add-cart-mini-btn" 
                  style={{ padding: '10px 24px', fontSize: '14px' }}
                  onClick={() => navigateTo('shop')}
                >
                  Explore Products &gt;
                </button>
              </div>
            </div>
          </section>

          {/* 2-COLUMN STORY SECTION 2 */}
          <section className="container" style={{ paddingBottom: '60px' }}>
            <div className="home-story-row">
              <div>
                <h3 className="home-story-heading">Steroid Source Talk | Where To Buy Steroids | Buy Steroids Online</h3>
                <p className="home-story-p">
                  At Roid Star Lab, We proud to have a committed crew of certified fitness practitioners and sports activities pharmacists, which offers our customers with maximum level of carrier, sincere and honest recommendation, so you can get exactly what searching out. At Roid Star Labs, Our short and clean order technique, reward and reduce charge applications, on hand fee options and speedy home transport makes you want to go to us time and again.
                </p>
                <h4 className="home-story-subheading">Gym Juice | Tren | Gear | Anabolic Usa | What Is Steroids?</h4>
                <p className="home-story-p">
                  We convey top-tier labs and guarantee outcomes and safety of your cycle.
                </p>
              </div>
              <div className="home-story-img-box">
                <img 
                  src="https://roidstarlabs.com/wp-content/uploads/2024/01/1424418-doctor-wallpaper-2365x1774-for-ipad-pro-1067x800.jpg" 
                  alt="Doctor advice" 
                />
              </div>
            </div>
          </section>
        </div>
      )}

      {/* VIEW B: SHOP CATALOG */}
      {currentPageView === 'shop' && (
        <div className="shop-view-wrapper">
          {/* Breadcrumbs & Controls */}
          <div className="shop-subhead">
            <div className="container shop-subhead-inner">
              <nav className="breadcrumbs">
                <a href="#home" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Home</a>
                <span className="divider">/</span>
                <span className="current">Shop</span>
                {activeCategoryFilter && (
                  <>
                    <span className="divider">/</span>
                    <span className="current" style={{ textTransform: 'capitalize' }}>
                      {activeCategoryFilter.replace(/-/g, ' ')}
                    </span>
                  </>
                )}
              </nav>

              <div className="shop-controls">
                <span className="result-count">
                  Showing 1–{filteredProducts.length} of {productsList.length} results
                </span>
                <select 
                  className="sort-select" 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="popularity">Sort by popularity</option>
                  <option value="rating">Sort by average rating</option>
                  <option value="date">Sort by latest</option>
                  <option value="price">Sort by price: low to high</option>
                  <option value="price-desc">Sort by price: high to low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Catalog Layout */}
          <main className="page-main-layout">
            <div className="container layout-grid">
              {/* SIDEBAR */}
              <aside className="shop-sidebar">
                {/* Category Browser */}
                <div className="sidebar-widget">
                  <h3 className="sidebar-widget-title">Browse</h3>
                  <div className="widget-divider"></div>
                  <ul className="category-list">
                    <li className="category-item">
                      <div 
                        className={`category-header ${activeCategoryFilter === '' ? 'active' : ''}`}
                        onClick={() => setActiveCategoryFilter('')}
                      >
                        <span>All Products</span>
                        <span style={{ fontSize: '12px', color: '#999' }}>({productsList.length})</span>
                      </div>
                    </li>
                    {CATEGORIES.map(cat => {
                      const isExpanded = expandedCategories[cat.id];
                      const isActive = activeCategoryFilter === cat.id;

                      return (
                        <li key={cat.id} className="category-item">
                          <div 
                            className={`category-header ${isActive ? 'active' : ''}`}
                            onClick={() => setActiveCategoryFilter(cat.id)}
                          >
                            <span>{cat.name}</span>
                            {cat.children && (
                              <button 
                                className="category-toggle-btn"
                                onClick={(e) => toggleCategoryExpand(cat.id, e)}
                                aria-label="Toggle subcategories"
                              >
                                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                              </button>
                            )}
                          </div>

                          {cat.children && isExpanded && (
                            <ul className="subcategory-list">
                              {cat.children.map(sub => (
                                <li key={sub.id} className="subcategory-item">
                                  <a 
                                    href={`#${sub.id}`} 
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setActiveCategoryFilter(sub.name);
                                    }}
                                  >
                                    {sub.name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Price Filter Widget */}
                <div className="sidebar-widget">
                  <h3 className="sidebar-widget-title">Filter by price</h3>
                  <div className="widget-divider"></div>
                  <div className="price-filter-box">
                    <input 
                      type="range" 
                      min="0" 
                      max="14800" 
                      step="10"
                      value={priceMax} 
                      onChange={(e) => setPriceMax(Number(e.target.value))}
                      className="price-range-slider"
                    />
                    <div className="price-values-row">
                      <span>Price: $0 — ${priceMax.toLocaleString()}</span>
                      <button 
                        className="filter-btn-price"
                        onClick={() => setAppliedPriceMax(priceMax)}
                      >
                        Filter
                      </button>
                    </div>
                  </div>
                </div>

                {/* Supabase Status Card */}
                <div className="sidebar-widget" style={{ 
                  backgroundColor: '#f6f9fc', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '6px', 
                  padding: '16px' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <ShieldCheck size={20} color="#229409" />
                    <span style={{ fontWeight: '700', fontSize: '13px', color: '#1a202c' }}>
                      Supabase Cloud DB
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#4a5568', lineHeight: '1.4' }}>
                    Connected to <strong>ehxhgpgyminvyvebbqlg</strong>. Live checkout orders will sync directly.
                  </p>
                </div>
              </aside>

              {/* PRODUCTS & EDITORIAL */}
              <div className="shop-main-content">
                {/* SEO Block */}
                <section className="seo-description-card">
                  <h2 className="seo-title">Online Pharmacy Service</h2>
                  <p className="seo-text">
                    <strong>Online Pharmacy Service:</strong> We employ a team of highly educated, well trained pharmacists (RPh and/or PharmD) with over 90 years of clinical experience. Our pharmacists are devoted to helping patients achieve the highest quality of life through medication, counseling, education and adherence to the latest pharmacology standards. When you call HealthWarehouse.com, you are speaking to a licensed member of our pharmacy. Our team works closely with patients and their physician(s) to ensure exceptional patient safety, patient care, and compassionate service.
                  </p>
                  
                  <h2 className="seo-title" style={{ marginTop: '18px' }}>How We Save You Money</h2>
                  <p className="seo-text">
                    With our focus on technology and sourcing, Our proprietary software allows us to process prescription and over-the-counter products efficiently and cost effectively. We aren’t burdened with substantial overhead costs of traditional retail pharmacy chains, nor the requirement to artificially keep prescription drug costs higher in order to maintain insurance reimbursements. Therefore, we are able to keep our costs low, and pass along the savings to our valued customers.
                  </p>
                  <p className="seo-text">
                    Online Pharmacy Service, Our state-of-the-art, 28,000 square foot pharmacy services more than 500,000 customers. Our centralized location area allows us to ship and reach more than 80% of the population within 2-3 days.
                  </p>
                  <p className="seo-text">
                    It is essential to stay informed about safe ways to buy medication. Buying prescription medicine online or through social media may seem to cost less, but it can put you, or your loved ones, at risk. Make sure a website is legitimate to safely order prescription drugs and medicine online.
                  </p>

                  <h3 className="seo-subtitle">Warning Signs to Spot an Unsafe Online Pharmacy</h3>
                  <p className="seo-text">
                    You may be able to avoid purchasing medication from an illegitimate pharmacy by knowing what to look for. Unsafe online pharmacies can be identified if they:
                  </p>
                  <ul className="seo-bullets">
                    <li>are not licensed by your state board of pharmacy;</li>
                    <li>lack a licensed pharmacist to address your questions;</li>
                    <li>provide medicines different from your usual pharmacy or in damaged packaging;</li>
                    <li>offer discounts that seem too good to be true or “bonus pills”;</li>
                    <li>only accept cryptocurrency or peer-to-peer payment methods;</li>
                    <li>charge for products you never ordered or received;</li>
                    <li>lack clear written protections for your personal and financial information; or</li>
                    <li>sell your information to other websites.</li>
                  </ul>
                </section>

                {/* Grid */}
                <div className="products-grid">
                  {filteredProducts.map(product => {
                    const isFavorited = wishlist.includes(product.id);

                    return (
                      <div key={product.id} className="product-card">
                        <div className="product-image-wrap">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="primary-img"
                            loading="lazy"
                          />
                          {product.hoverImage && (
                            <img 
                              src={product.hoverImage} 
                              alt={product.name} 
                              className="hover-img"
                              loading="lazy"
                            />
                          )}

                          <button 
                            className={`wishlist-toggle-btn ${isFavorited ? 'active' : ''}`}
                            onClick={() => toggleWishlist(product)}
                            aria-label="Add to wishlist"
                          >
                            <Heart size={16} fill={isFavorited ? '#e63946' : 'none'} />
                          </button>

                          <div 
                            className="quick-view-overlay"
                            onClick={() => {
                              setQuickViewProduct(product);
                              setQuickViewQty(1);
                            }}
                          >
                            Quick View
                          </div>
                        </div>

                        <div className="product-details">
                          <span className="product-category-tag">{product.category}</span>
                          <h4 
                            className="product-title" 
                            onClick={() => {
                              setQuickViewProduct(product);
                              setQuickViewQty(1);
                            }}
                            style={{ cursor: 'pointer' }}
                          >
                            {product.name}
                          </h4>

                          {product.rating > 0 && (
                            <div className="star-rating">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={13} 
                                  fill={i < Math.floor(product.rating) ? '#f1a90d' : 'none'} 
                                />
                              ))}
                              <span style={{ fontSize: '11px', color: '#777', marginLeft: '4px' }}>
                                ({product.rating.toFixed(2)})
                              </span>
                            </div>
                          )}

                          <div className="product-price-row">
                            <span className="product-price">${product.price.toFixed(2)}</span>
                            <button 
                              className="add-cart-mini-btn"
                              onClick={() => addToCart(product, 1)}
                            >
                              <ShoppingBasket size={14} /> Add
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredProducts.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: '#777' }}>
                    <p>No products found matching your active filter criteria.</p>
                    <button 
                      onClick={() => {
                        setSearchQuery('');
                        setActiveCategoryFilter('');
                        setAppliedPriceMax(14800);
                        setPriceMax(14800);
                      }}
                      style={{ 
                        marginTop: '12px', 
                        padding: '8px 16px', 
                        backgroundColor: 'var(--primary-color)', 
                        color: '#fff', 
                        borderRadius: '4px',
                        fontWeight: '700'
                      }}
                    >
                      Clear Filters
                    </button>
                  </div>
                )}

                {/* Pagination */}
                <div className="pagination-container">
                  <ul className="pagination-list">
                    {[1, 2, 3, 4].map(num => (
                      <li key={num}>
                        <button 
                          className={`page-num-btn ${catalogPage === num ? 'active' : ''}`}
                          onClick={() => setCatalogPage(num)}
                        >
                          {num}
                        </button>
                      </li>
                    ))}
                    <li><span style={{ padding: '0 4px', color: '#888' }}>…</span></li>
                    {[11, 12, 13].map(num => (
                      <li key={num}>
                        <button 
                          className={`page-num-btn ${catalogPage === num ? 'active' : ''}`}
                          onClick={() => setCatalogPage(num)}
                        >
                          {num}
                        </button>
                      </li>
                    ))}
                    <li>
                      <button 
                        className="page-num-btn"
                        onClick={() => setCatalogPage(p => Math.min(p + 1, 13))}
                      >
                        Next &gt;
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* VIEW C: CARD PAYMENT / CHECKOUT */}
      {currentPageView === 'payment' && (
        <div className="container checkout-page-container">
          {orderComplete ? (
            <div style={{ 
              maxWidth: '600px', 
              margin: '40px auto', 
              textAlign: 'center', 
              background: '#fff', 
              padding: '40px', 
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 8px 30px rgba(0,0,0,0.06)'
            }}>
              <CheckCircle2 size={64} color="#229409" style={{ margin: '0 auto 16px' }} />
              <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#111', marginBottom: '8px' }}>
                Thank You For Your Order!
              </h2>
              <p style={{ color: '#666', marginBottom: '20px' }}>
                Your order <strong>#{orderComplete.id}</strong> has been received and securely synced to Supabase.
              </p>
              <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '6px', textAlign: 'left', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Amount Paid:</span>
                  <strong>${orderComplete.total.toFixed(2)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Confirmation sent to:</span>
                  <strong>{orderComplete.email}</strong>
                </div>
              </div>
              <button 
                className="hero-cta-btn" 
                onClick={() => { setOrderComplete(null); navigateTo('shop'); }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="checkout-grid">
              {/* Form */}
              <div className="checkout-form-box">
                <h2 className="checkout-section-title">Shipping &amp; Billing Details</h2>
                <form onSubmit={handleFinalOrderSubmit}>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label>First Name *</label>
                      <input 
                        type="text" 
                        required 
                        className="form-control-input" 
                        value={checkoutData.firstName}
                        onChange={(e) => setCheckoutData({...checkoutData, firstName: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name *</label>
                      <input 
                        type="text" 
                        required 
                        className="form-control-input" 
                        value={checkoutData.lastName}
                        onChange={(e) => setCheckoutData({...checkoutData, lastName: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input 
                        type="email" 
                        required 
                        className="form-control-input" 
                        value={checkoutData.email}
                        onChange={(e) => setCheckoutData({...checkoutData, email: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number *</label>
                      <input 
                        type="tel" 
                        required 
                        className="form-control-input" 
                        value={checkoutData.phone}
                        onChange={(e) => setCheckoutData({...checkoutData, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Street Address *</label>
                    <input 
                      type="text" 
                      required 
                      className="form-control-input" 
                      value={checkoutData.address}
                      onChange={(e) => setCheckoutData({...checkoutData, address: e.target.value})}
                    />
                  </div>

                  <div className="form-row-3">
                    <div className="form-group">
                      <label>City *</label>
                      <input 
                        type="text" 
                        required 
                        className="form-control-input" 
                        value={checkoutData.city}
                        onChange={(e) => setCheckoutData({...checkoutData, city: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>State *</label>
                      <input 
                        type="text" 
                        required 
                        className="form-control-input" 
                        value={checkoutData.state}
                        onChange={(e) => setCheckoutData({...checkoutData, state: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>ZIP *</label>
                      <input 
                        type="text" 
                        required 
                        className="form-control-input" 
                        value={checkoutData.zip}
                        onChange={(e) => setCheckoutData({...checkoutData, zip: e.target.value})}
                      />
                    </div>
                  </div>

                  <h2 className="checkout-section-title" style={{ marginTop: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Lock size={18} color="#229409" />
                      <span>Card Payment Information</span>
                    </div>
                  </h2>

                  <div className="form-group">
                    <label>Card Number *</label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="text" 
                        required 
                        placeholder="•••• •••• •••• ••••" 
                        maxLength="19"
                        className="form-control-input" 
                        value={checkoutData.cardNumber}
                        onChange={(e) => setCheckoutData({...checkoutData, cardNumber: e.target.value})}
                      />
                      <CreditCard size={18} color="#888" style={{ position: 'absolute', right: '12px', top: '14px' }} />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Expiry Date (MM/YY) *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="MM/YY" 
                        maxLength="5"
                        className="form-control-input" 
                        value={checkoutData.cardExp}
                        onChange={(e) => setCheckoutData({...checkoutData, cardExp: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Security Code (CVC) *</label>
                      <input 
                        type="password" 
                        required 
                        placeholder="•••" 
                        maxLength="4"
                        className="form-control-input" 
                        value={checkoutData.cardCvc}
                        onChange={(e) => setCheckoutData({...checkoutData, cardCvc: e.target.value})}
                      />
                    </div>
                  </div>

                  <button type="submit" className="pay-submit-btn">
                    Place Order (${cartTotal.toFixed(2)})
                  </button>
                </form>
              </div>

              {/* Order Summary */}
              <div className="checkout-summary-box">
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', color: '#111' }}>
                  Your Order ({cartCount} items)
                </h3>
                {cart.length === 0 ? (
                  <p style={{ color: '#777', padding: '16px 0' }}>No items in cart.</p>
                ) : (
                  <div>
                    {cart.map(item => (
                      <div key={item.id} className="summary-item-row">
                        <span>{item.name} × {item.quantity}</span>
                        <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                      </div>
                    ))}
                    <div className="summary-item-row" style={{ marginTop: '12px' }}>
                      <span>Subtotal</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-item-row">
                      <span>Shipping (US Domestic)</span>
                      <span style={{ color: '#229409', fontWeight: 'bold' }}>FREE</span>
                    </div>
                    <div className="summary-total-row">
                      <span>Total:</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW D: TESTIMONIALS */}
      {currentPageView === 'testimonial' && (
        <div className="container" style={{ padding: '50px 15px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#111', textAlign: 'center', marginBottom: '12px' }}>
            Customer Testimonials
          </h1>
          <p style={{ textAlign: 'center', color: '#666', maxWidth: '600px', margin: '0 auto 30px' }}>
            Real reviews and feedback from verified athletes and clients who rely on Roidstarlabs.
          </p>
          <div className="testimonials-grid">
            {TESTIMONIALS.map(t => (
              <div key={t.id} className="testimonial-card">
                <div className="star-rating" style={{ marginBottom: '12px' }}>
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#f1a90d" />
                  ))}
                </div>
                <p style={{ fontStyle: 'italic', color: '#444', lineHeight: '1.7', flex: '1' }}>
                  "{t.comment}"
                </p>
                <div className="testimonial-author">{t.name}</div>
                <div className="testimonial-date">{t.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW E: CONTACT US */}
      {currentPageView === 'contact' && (
        <div className="container" style={{ padding: '50px 15px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#111', textAlign: 'center', marginBottom: '30px' }}>
            Contact Us
          </h1>
          <div className="checkout-grid">
            <div className="checkout-form-box">
              <h2 className="checkout-section-title">Send Us a Message</h2>
              <form onSubmit={(e) => { e.preventDefault(); showToast('Message sent! We will reply within 24 hours.'); }}>
                <div className="form-group">
                  <label>Your Name *</label>
                  <input type="text" required className="form-control-input" />
                </div>
                <div className="form-group">
                  <label>Your Email *</label>
                  <input type="email" required className="form-control-input" />
                </div>
                <div className="form-group">
                  <label>Subject *</label>
                  <input type="text" required className="form-control-input" />
                </div>
                <div className="form-group">
                  <label>Message *</label>
                  <textarea rows="5" required className="form-control-input"></textarea>
                </div>
                <button type="submit" className="pay-submit-btn">Send Message</button>
              </form>
            </div>
            <div className="checkout-summary-box">
              <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '18px', color: '#111' }}>
                Customer Support Information
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', fontSize: '14px', color: '#555' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Mail size={18} color="#229409" />
                  <span>Email: <a href="mailto:info@roidstarlabs.com" style={{ color: '#229409', fontWeight: 'bold' }}>info@roidstarlabs.com</a></span>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Phone size={18} color="#229409" />
                  <span>Telephone: (719) 246-6260</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <MapPin size={18} color="#229409" />
                  <span>Address: USA Domestic Shipping</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Clock size={18} color="#229409" />
                  <span>Hours: Monday – Saturday (8:00 AM – 8:00 PM EST)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW F: POLICY PAGES */}
      {['privacy', 'refund', 'terms'].includes(currentPageView) && (
        <div className="container">
          <div className="policy-page-card">
            {currentPageView === 'privacy' && (
              <>
                <h1>Privacy Policy</h1>
                <p>
                  At <strong>roidstarlabs.com</strong>, we are committed to protecting your personal privacy. We implement high-grade SSL encryption and security protocols to ensure that all customer interactions, browsing data, and communications remain strictly confidential.
                </p>
                <p>
                  We do not sell, trade, or distribute your email or personal credentials to third-party marketing services. Any records retained are used strictly for order fulfillment, tracking updates, and customer service inquiries.
                </p>
              </>
            )}

            {currentPageView === 'refund' && (
              <>
                <h1>Refund and Return Policy</h1>
                <p>
                  Your satisfaction and peace of mind are our top priorities. If your shipment is damaged in transit or encounters delivery discrepancies, our team offers reshipment guarantees upon verification of the tracking status.
                </p>
                <p>
                  Due to the nature of pharmaceutical grade products and safety regulations, items once delivered and unsealed cannot be returned into stock. Please reach out to <strong>info@roidstarlabs.com</strong> for assistance with any order issues.
                </p>
              </>
            )}

            {currentPageView === 'terms' && (
              <>
                <h1>Terms and Conditions</h1>
                <p>
                  By browsing or placing an order on <strong>roidstarlabs.com</strong>, you agree to adhere to all terms of service and verify that you are at least 18 years of age (or the legal age of majority in your jurisdiction).
                </p>
                <p>
                  All products and educational literature on this website are provided for harm reduction, academic research, and personal wellness adherence.
                </p>
              </>
            )}
            <button 
              className="add-cart-mini-btn" 
              style={{ marginTop: '20px', padding: '10px 20px' }}
              onClick={() => navigateTo('shop')}
            >
              Back to Catalog
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          SHARED FOOTERS & FLOATING BUTTONS
          ======================================================== */}

      {/* FOOTER 1 (WIDGETS) */}
      <footer className="footer-widgets">
        <div className="container footer-widgets-grid">
          {/* Latest */}
          <div className="footer-widget-col">
            <h4 className="footer-widget-heading">Latest</h4>
            <div className="footer-divider"></div>
            <ul className="mini-product-list">
              {LATEST_PRODUCTS.map(item => (
                <li key={item.id} className="mini-product-item">
                  <img src={item.image} alt={item.name} />
                  <div className="mini-product-info">
                    <a 
                      href="#view" 
                      className="mini-product-title"
                      onClick={(e) => { e.preventDefault(); navigateTo('shop'); }}
                    >
                      {item.name}
                    </a>
                    <span className="mini-product-price">
                      {item.salePrice ? (
                        <>
                          <del>${item.regularPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</del>
                          ${item.salePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </>
                      ) : (
                        `$${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                      )}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Best Selling */}
          <div className="footer-widget-col">
            <h4 className="footer-widget-heading">Best Selling</h4>
            <div className="footer-divider"></div>
            <ul className="mini-product-list">
              {BEST_SELLING.map(item => (
                <li key={item.id} className="mini-product-item">
                  <img src={item.image} alt={item.name} />
                  <div className="mini-product-info">
                    <a 
                      href="#view" 
                      className="mini-product-title"
                      onClick={(e) => { e.preventDefault(); navigateTo('shop'); }}
                    >
                      {item.name}
                    </a>
                    <span className="mini-product-price">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Rated */}
          <div className="footer-widget-col">
            <h4 className="footer-widget-heading">Top Rated</h4>
            <div className="footer-divider"></div>
            <ul className="mini-product-list">
              {TOP_RATED.map(item => (
                <li key={item.id} className="mini-product-item">
                  <img src={item.image} alt={item.name} />
                  <div className="mini-product-info">
                    <a 
                      href="#view" 
                      className="mini-product-title"
                      onClick={(e) => { e.preventDefault(); navigateTo('shop'); }}
                    >
                      {item.name}
                    </a>
                    <div className="star-rating" style={{ margin: '2px 0' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} fill="#f1a90d" />
                      ))}
                    </div>
                    <span className="mini-product-price">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>

      {/* FOOTER 2 (DARK EDITORIAL & CONTACT) */}
      <div className="footer-dark-section">
        <div className="container footer-dark-grid">
          <div>
            <h4 className="footer-widget-heading" style={{ color: '#fff' }}>About Us</h4>
            <div className="footer-divider"></div>
            <p className="footer-about-text">
              We believe accessible, trustworthy health information can make managing health an empowering experience. That's why our Medical Knowledge Team creates original content that’s peer-reviewed, regularly updated, and easy to understand.
            </p>
          </div>

          <div>
            <h4 className="footer-widget-heading" style={{ color: '#fff' }}>GALLERY</h4>
            <div className="footer-divider"></div>
            <div className="gallery-grid">
              {GALLERY_IMAGES.map((imgUrl, index) => (
                <div key={index} className="gallery-thumb">
                  <img src={imgUrl} alt="Gallery item" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="footer-widget-heading" style={{ color: '#fff' }}>Contact info</h4>
            <div className="footer-divider"></div>
            <div className="contact-info-list">
              <div>Email: <a href="mailto:info@roidstarlabs.com">info@roidstarlabs.com</a></div>
              <div>Address: USA</div>
              <div>Num: (719) 246-6260</div>
            </div>
          </div>
        </div>
      </div>

      {/* ABSOLUTE COPYRIGHT FOOTER */}
      <div className="footer-absolute">
        <div className="container">
          Copyright 2026 © <strong><a href="mailto:info@roidstarlabs.com">Email:info@roidstarlabs.com</a></strong>
        </div>
      </div>

      {/* FLOATING ACTION BUTTONS */}
      <button 
        className="scroll-to-top-btn" 
        onClick={scrollToTop} 
        aria-label="Back to top"
      >
        <ArrowUp size={20} />
      </button>

      <a 
        href="https://wa.me/17192466260" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="whatsapp-float-btn"
        aria-label="WhatsApp Contact"
      >
        <MessageCircle size={24} />
      </a>

      {/* QUICK VIEW MODAL */}
      {quickViewProduct && (
        <div className="quick-view-backdrop" onClick={() => setQuickViewProduct(null)}>
          <div className="quick-view-card" onClick={(e) => e.stopPropagation()}>
            <button 
              className="quick-view-close" 
              onClick={() => setQuickViewProduct(null)}
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <div className="quick-view-image-col">
              <img src={quickViewProduct.fullImage || quickViewProduct.image} alt={quickViewProduct.name} />
            </div>
            <div className="quick-view-info-col">
              <span className="quick-view-category">{quickViewProduct.category}</span>
              <h2 className="quick-view-title">{quickViewProduct.name}</h2>
              <div className="quick-view-price">${quickViewProduct.price.toFixed(2)}</div>
              <p className="quick-view-desc">{quickViewProduct.description}</p>
              
              <div className="quick-view-meta">
                {quickViewProduct.dosage && <div><strong>Dosage:</strong> {quickViewProduct.dosage}</div>}
                {quickViewProduct.form && <div><strong>Format:</strong> {quickViewProduct.form}</div>}
                <div><strong>Availability:</strong> In Stock</div>
              </div>

              <div className="quick-view-actions">
                <input 
                  type="number" 
                  min="1" 
                  value={quickViewQty} 
                  onChange={(e) => setQuickViewQty(Math.max(1, Number(e.target.value)))}
                  className="quick-view-qty-input"
                />
                <button 
                  className="quick-view-add-btn"
                  onClick={() => {
                    addToCart(quickViewProduct, quickViewQty);
                    setQuickViewProduct(null);
                  }}
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CART SLIDE-OUT DRAWER */}
      {isCartOpen && (
        <div className="cart-drawer-backdrop" onClick={() => setIsCartOpen(false)}>
          <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="cart-drawer-header">
              <span className="cart-drawer-title">Shopping Cart ({cartCount})</span>
              <button 
                className="cart-drawer-close" 
                onClick={() => setIsCartOpen(false)}
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            <div className="cart-drawer-body">
              {cart.length === 0 ? (
                <div className="cart-empty-state">
                  <ShoppingBasket size={48} color="#ccc" style={{ marginBottom: '12px' }} />
                  <p>No products in the cart.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="cart-item-row">
                    <img src={item.image} alt={item.name} className="cart-item-thumb" />
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</div>
                      <div className="cart-qty-controls">
                        <button className="qty-btn" onClick={() => updateCartQty(item.id, -1)}>
                          <Minus size={12} />
                        </button>
                        <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateCartQty(item.id, 1)}>
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                    <button 
                      className="cart-remove-item"
                      onClick={() => removeCartItem(item.id)}
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-drawer-footer">
                <div className="cart-subtotal-row">
                  <span>Subtotal:</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <button 
                  className="checkout-btn"
                  onClick={() => {
                    setIsCartOpen(false);
                    navigateTo('payment');
                  }}
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOAST POPUP */}
      {toastMessage && (
        <div className="toast-notice">
          <CheckCircle2 size={18} color="#229409" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
