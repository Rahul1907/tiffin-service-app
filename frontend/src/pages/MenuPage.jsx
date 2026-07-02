import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChefHat, ShoppingBag, Flame, Sparkles } from 'lucide-react';
import API from '../api/client.js';
import { addToCart } from '../store/slices/cartSlice.js';

function MenuPage() {
  const dispatch = useDispatch();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtering state
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all', 'lunch', 'dinner'
  const [dietFilter, setDietFilter] = useState('all'); // 'all', 'veg', 'non-veg'
  
  // Toast notifications state
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await API.get('/menu');
      if (response.data && response.data.success) {
        setMenuItems(response.data.data);
      } else {
        setError('Failed to fetch menu items.');
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        'Could not connect to the server. Make sure MongoDB and backend are running.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    dispatch(addToCart({ item, quantity: 1 }));
    setToastMessage(`🍱 Added ${item.name} to cart!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Filter items in memory
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = 
      categoryFilter === 'all' || 
      item.category === categoryFilter || 
      item.category === 'both';
      
    const matchesDiet = 
      dietFilter === 'all' || 
      (dietFilter === 'veg' && item.isVeg) || 
      (dietFilter === 'non-veg' && !item.isVeg);
      
    return matchesCategory && matchesDiet;
  });

  return (
    <div className="relative pb-16">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl animate-bounce border border-amber-500">
          <Sparkles className="text-amber-400 mr-2" size={18} />
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Hero Banner Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-12 md:p-16 shadow-lg mb-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent)]" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-amber-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-amber-300/30">
            <Flame size={12} className="animate-pulse" />
            <span>Freshly Cooked Daily</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Ahmedabad's Premium Home Tiffin Service
          </h1>
          <p className="mt-4 text-base md:text-lg text-amber-50">
            Hygienic, nutrient-dense home-cooked meals prepared with love by mom. Bringing the flavor of authentic local spices straight to your doorstep.
          </p>
        </div>
        <div className="hidden lg:block absolute right-16 top-1/2 -translate-y-1/2 text-[120px] opacity-25 select-none">
          🍱
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-8">
        {/* Meal Category Filters */}
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          {['all', 'lunch', 'dinner'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`flex-1 sm:flex-initial px-4 py-2 text-sm font-bold capitalize rounded-lg transition-all ${
                categoryFilter === cat
                  ? 'bg-amber-500 text-white shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Diet Filters */}
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Diets' },
            { id: 'veg', label: '🟢 Veg Only' },
            { id: 'non-veg', label: '🔴 Non-Veg' }
          ].map((diet) => (
            <button
              key={diet.id}
              onClick={() => setDietFilter(diet.id)}
              className={`flex-1 sm:flex-initial px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                dietFilter === diet.id
                  ? 'bg-amber-500 text-white shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {diet.label}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
          <p className="mt-4 text-slate-500 font-semibold animate-pulse">Cooking up the menu...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl max-w-xl mx-auto text-center shadow-sm">
          <ChefHat size={36} className="mx-auto text-red-500 mb-2" />
          <h3 className="font-bold text-lg">Unable to Load Menu</h3>
          <p className="text-sm mt-1">{error}</p>
          <button 
            onClick={fetchMenu} 
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-all shadow-md"
          >
            Retry Connection
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <ChefHat size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="font-bold text-slate-700 text-lg">No meals available for this filter.</h3>
          <p className="text-slate-500 text-sm mt-1">Try selecting a different filter option.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div 
              key={item._id} 
              className="bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
            >
              {/* Product Image */}
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img 
                  src={item.imageUrl} 
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400';
                  }}
                />
                
                {/* Veg/Non-Veg Tag */}
                <span className={`absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold shadow-sm ${
                  item.isVeg ? 'bg-emerald-550 text-emerald-800 bg-emerald-50 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  <span className={`w-2 h-2 rounded-full mr-1.5 ${item.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  {item.isVeg ? 'VEG' : 'NON-VEG'}
                </span>

                {/* Category Badge */}
                <span className="absolute top-4 right-4 inline-block bg-slate-900/80 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                  {item.category === 'both' ? 'Lunch & Dinner' : item.category}
                </span>
              </div>

              {/* Product Info */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                    {item.name}
                  </h3>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">
                  {item.description}
                </p>

                {/* Pricing & Add to Cart action */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                  <div>
                    <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Price</span>
                    <span className="text-2xl font-black text-slate-900">₹{item.price}</span>
                  </div>
                  
                  {item.isAvailableToday ? (
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white px-5 py-3 rounded-2xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
                    >
                      <ShoppingBag size={16} />
                      <span>Add to Cart</span>
                    </button>
                  ) : (
                    <span className="inline-block bg-slate-100 text-slate-400 px-4 py-2.5 rounded-2xl text-sm font-bold border border-slate-200 cursor-not-allowed">
                      Sold Out
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MenuPage;
