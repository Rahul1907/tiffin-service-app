import React, { useEffect, useState } from 'react';
import { ChefHat, Flame, Sparkles, Star, Quote, Send, User } from 'lucide-react';
import API from '../api/client.js';

function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [pincodes, setPincodes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtering state
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all', 'lunch', 'dinner'
  const [dietFilter, setDietFilter] = useState('all'); // 'all', 'veg', 'non-veg'

  // New Review Form States
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  // Local static seed reviews to show as a fallback if DB is empty
  const fallbackReviews = [
    {
      _id: 'seed-1',
      name: 'Rahul Patel',
      role: 'Software Engineer',
      location: 'Vastrapur',
      rating: 5,
      comment: 'The Gujarati Thali tastes exactly like what my mother cooks back home! It is light on oil, has no soda, and the masalas are perfectly balanced. The Masala Chaas is a lifesaver.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    },
    {
      _id: 'seed-2',
      name: 'Dr. Anjali Mehta',
      role: 'Resident Doctor',
      location: 'Satellite',
      rating: 5,
      comment: 'Finding clean, nutritious vegetarian meals in Ahmedabad during night shifts is a challenge. TiffinExpress thalis are fresh, arrive hot, and the Roti is soft even after hours.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    },
    {
      _id: 'seed-3',
      name: 'Hardik Shah',
      role: 'CA Student',
      location: 'Ghatlodia',
      rating: 5,
      comment: 'Highly recommend their Premium Punjabi combo. Excellent portions, hygienic packaging, and super punctual delivery. It helps me focus on my studies without worrying about food!',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load menu items, active pincodes, and reviews concurrently
      const [menuRes, pinRes, reviewRes] = await Promise.all([
        API.get('/menu'),
        API.get('/pincodes'),
        API.get('/reviews').catch(err => {
          console.error('Failed to fetch reviews:', err);
          return { data: { success: false } };
        })
      ]);

      if (menuRes.data && menuRes.data.success) {
        setMenuItems(menuRes.data.data);
      }
      
      if (pinRes.data && pinRes.data.success) {
        setPincodes(pinRes.data.data);
      }

      if (reviewRes.data && reviewRes.data.success) {
        setReviews(reviewRes.data.data);
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

  // Submit Feedback Handler
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    if (!newName || !newLocation || !newComment) {
      setReviewError('Please fill in Name, Area, and Feedback text.');
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await API.post('/reviews', {
        name: newName,
        role: newRole || 'Customer',
        location: newLocation,
        rating: newRating,
        comment: newComment
      });

      if (res.data && res.data.success) {
        setReviewSuccess('Thank you! Your feedback has been published.');
        setNewName('');
        setNewRole('');
        setNewLocation('');
        setNewRating(5);
        setNewComment('');
        
        // Refresh reviews list
        const reviewRes = await API.get('/reviews');
        if (reviewRes.data && reviewRes.data.success) {
          setReviews(reviewRes.data.data);
        }
      }
    } catch (err) {
      console.error(err);
      setReviewError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
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

  // Choose between DB reviews and Static fallbacks
  const activeReviews = reviews.length > 0 ? reviews : fallbackReviews;

  return (
    <div className="relative pb-16">
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
        <div className="hidden lg:block absolute right-16 top-1/2 -translate-y-1/2 text-[120px] opacity-25 select-none font-sans">
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
            onClick={fetchData} 
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
                  item.isVeg ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
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
                  <h3 className="text-xl font-bold text-slate-900 transition-colors">
                    {item.name}
                  </h3>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">
                  {item.description}
                </p>

                {/* Pricing & Availability status */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                  <div>
                    <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Price</span>
                    <span className="text-2xl font-black text-slate-900">₹{item.price}</span>
                  </div>
                  
                  {item.isAvailableToday ? (
                    <span className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 px-3.5 py-2 rounded-2xl text-xs font-extrabold tracking-wide uppercase">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                      <span>Available</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center bg-slate-55/60 text-slate-400 border border-slate-200 px-3.5 py-2 rounded-2xl text-xs font-extrabold tracking-wide uppercase">
                      <span>Sold Out</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Customer Reviews Section */}
      {!loading && !error && (
        <div className="mt-24">
          <div className="text-center max-w-xl mx-auto mb-12">
            <div className="inline-flex items-center space-x-1.5 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles size={12} className="text-amber-500 animate-spin" />
              <span>Testimonials</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Loved by Ahmedabad's Foodies</h2>
            <p className="mt-2 text-slate-550 text-sm">
              Read real feedback from students, working professionals, and families who rely on our fresh daily thalis.
            </p>
          </div>

          {/* Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {activeReviews.map((rev) => (
              <div 
                key={rev._id} 
                className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative flex flex-col justify-between"
              >
                <div className="absolute top-6 right-6 text-slate-100 pointer-events-none select-none">
                  <Quote size={40} className="stroke-[1.5]" />
                </div>
                
                <div>
                  {/* Star Rating */}
                  <div className="flex space-x-1 mb-4">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={15} className="fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  
                  <p className="text-slate-600 text-sm leading-relaxed italic mb-6">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="flex items-center space-x-3 pt-4 border-t border-slate-50 mt-auto">
                  {rev.avatar ? (
                    <img 
                      src={rev.avatar} 
                      alt={rev.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-100"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold border border-amber-200">
                      <User size={18} />
                    </div>
                  )}
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm">{rev.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{rev.role} • {rev.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Write a Review Section */}
          <div className="max-w-2xl mx-auto bg-white border border-slate-100 p-8 rounded-3xl shadow-md">
            <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">Share Your Feedback</h3>
            <p className="text-slate-500 text-xs text-center mb-6">How was your thali? Let us know your thoughts!</p>
            
            {reviewError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-xs font-semibold">
                {reviewError}
              </div>
            )}
            {reviewSuccess && (
              <div className="bg-emerald-50 border border-emerald-250 text-emerald-700 px-4 py-3 rounded-xl mb-4 text-xs font-medium">
                {reviewSuccess}
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter your name"
                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Area / Location *</label>
                  <input
                    type="text"
                    required
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Vastrapur, Satellite"
                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Occupation / Role (Optional)</label>
                  <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="e.g. IT Engineer, Student"
                    className="block w-full px-4 py-2.5 border border-slate-200 rounded-lg text-xs font-semibold placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white transition-all"
                  />
                </div>
                <div className="flex flex-col items-center sm:items-end">
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Rating *</span>
                  <div className="flex space-x-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="focus:outline-none transform hover:scale-110 transition-transform"
                      >
                        <Star 
                          size={24} 
                          className={`${
                            star <= newRating 
                              ? 'fill-amber-500 text-amber-500' 
                              : 'text-slate-350 fill-slate-100'
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Your Feedback *</label>
                <textarea
                  required
                  rows="3"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your experience (e.g. Taste, packaging, delivery times, rotis freshness)"
                  className="block w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="text-center pt-2">
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="inline-flex justify-center items-center py-3.5 px-8 border border-transparent rounded-2xl text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 shadow transition-all disabled:opacity-50"
                >
                  <Send className="mr-2" size={15} />
                  <span>{submittingReview ? 'Submitting...' : 'Submit Feedback'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Served Areas Section */}
      {!loading && !error && (
        <div className="mt-20 bg-amber-500/5 rounded-3xl border border-amber-500/10 p-8 md:p-12 text-center max-w-4xl mx-auto">
          <ChefHat size={36} className="mx-auto text-amber-500 mb-3" />
          <h2 className="text-2xl font-bold text-slate-900">Served Delivery Areas</h2>
          <p className="mt-2 text-slate-600 text-sm max-w-lg mx-auto leading-relaxed">
            We deliver fresh, hot home-style meals to the following locations in Ahmedabad. Select your thali and call us to place your order!
          </p>
          
          {pincodes.length > 0 ? (
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {pincodes.map((pin) => (
                <div key={pin._id} className="bg-white px-4 py-2.5 rounded-2xl border border-slate-100 shadow-sm text-sm font-bold text-slate-700">
                  📍 <span className="text-slate-800">{pin.code}</span> - <span className="text-slate-500 font-semibold">{pin.areaName}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-slate-400 text-sm italic">Served delivery areas list will be populated soon. Contact us to verify delivery to your area.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default MenuPage;
