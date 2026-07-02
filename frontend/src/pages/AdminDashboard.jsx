import React, { useEffect, useState } from 'react';
import { ChefHat, Plus, Edit2, Trash2, Power, Eye, EyeOff, MapPin, Sparkles, X, ToggleLeft, ToggleRight } from 'lucide-react';
import API from '../api/client.js';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' or 'pincodes'
  
  // Data states
  const [menuItems, setMenuItems] = useState([]);
  const [pincodes, setPincodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal / Form states
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  
  // Menu Item Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('lunch');
  const [isVeg, setIsVeg] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [isAvailableToday, setIsAvailableToday] = useState(true);

  // Pincode Form Fields
  const [pinCode, setPinCode] = useState('');
  const [areaName, setAreaName] = useState('');

  useEffect(() => {
    fetchMenuItems();
    fetchPincodes();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const res = await API.get('/menu');
      if (res.data && res.data.success) {
        setMenuItems(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch menu items.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPincodes = async () => {
    try {
      const res = await API.get('/pincodes');
      if (res.data && res.data.success) {
        setPincodes(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Open modal for adding new item
  const handleOpenAddModal = () => {
    setEditingItemId(null);
    setName('');
    setDescription('');
    setPrice('');
    setCategory('lunch');
    setIsVeg(true);
    setImageUrl('');
    setIsAvailableToday(true);
    setError('');
    setShowItemModal(true);
  };

  // Open modal for editing existing item
  const handleOpenEditModal = (item) => {
    setEditingItemId(item._id);
    setName(item.name);
    setDescription(item.description);
    setPrice(item.price);
    setCategory(item.category);
    setIsVeg(item.isVeg);
    setImageUrl(item.imageUrl);
    setIsAvailableToday(item.isAvailableToday);
    setError('');
    setShowItemModal(true);
  };

  // Submit Menu Item (Add or Edit)
  const handleSubmitItem = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !description || !price) {
      setError('Please fill in all required fields.');
      return;
    }

    const payload = {
      name,
      description,
      price: Number(price),
      category,
      isVeg,
      imageUrl: imageUrl || undefined,
      isAvailableToday,
    };

    try {
      setLoading(true);
      let response;
      if (editingItemId) {
        // Edit mode
        response = await API.put(`/menu/${editingItemId}`, payload);
        if (response.data && response.data.success) {
          setSuccess(`Successfully updated "${name}"!`);
        }
      } else {
        // Add mode
        response = await API.post('/menu', payload);
        if (response.data && response.data.success) {
          setSuccess(`Successfully added "${name}" to the menu!`);
        }
      }
      setShowItemModal(false);
      fetchMenuItems();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save menu item.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle Availability Quickly
  const handleToggleAvailability = async (item) => {
    try {
      const response = await API.put(`/menu/${item._id}`, {
        isAvailableToday: !item.isAvailableToday,
      });
      if (response.data && response.data.success) {
        setMenuItems((prev) =>
          prev.map((i) => (i._id === item._id ? { ...i, isAvailableToday: !i.isAvailableToday } : i))
        );
        setSuccess(`Toggled availability for "${item.name}"`);
        setTimeout(() => setSuccess(''), 2000);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to update availability.');
    }
  };

  // Delete Menu Item
  const handleDeleteItem = async (id, itemName) => {
    if (!window.confirm(`Are you sure you want to delete "${itemName}"?`)) return;
    setError('');
    setSuccess('');
    try {
      setLoading(true);
      const res = await API.delete(`/menu/${id}`);
      if (res.data && res.data.success) {
        setSuccess(`Successfully deleted "${itemName}".`);
        fetchMenuItems();
      }
    } catch (err) {
      console.error(err);
      setError('Failed to delete item.');
    } finally {
      setLoading(false);
    }
  };

  // Add Served Pincode
  const handleAddPincode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!/^\d{6}$/.test(pinCode)) {
      setError('Pincode must be exactly 6 digits.');
      return;
    }
    if (!areaName) {
      setError('Please provide an area name.');
      return;
    }

    try {
      setLoading(true);
      const res = await API.post('/pincodes', { code: pinCode, areaName });
      if (res.data && res.data.success) {
        setSuccess(`Serviced area "${pinCode} - ${areaName}" added!`);
        setPinCode('');
        setAreaName('');
        fetchPincodes();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to add pincode.');
    } finally {
      setLoading(false);
    }
  };

  // Remove Served Pincode
  const handleDeletePincode = async (id, code, area) => {
    if (!window.confirm(`Stop serving pincode ${code} - ${area}?`)) return;
    setError('');
    setSuccess('');
    try {
      setLoading(true);
      const res = await API.delete(`/pincodes/${id}`);
      if (res.data && res.data.success) {
        setSuccess(`Pincode ${code} removed.`);
        fetchPincodes();
      }
    } catch (err) {
      console.error(err);
      setError('Failed to remove pincode.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <span className="text-amber-500">🍱</span>
            <span>TiffinExpress Merchant Control</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Easily upload menu items, toggle rotating daily availability, and manage served delivery codes.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'menu' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-950'
            }`}
          >
            Dishes Menu
          </button>
          <button
            onClick={() => setActiveTab('pincodes')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'pincodes' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-950'
            }`}
          >
            Serviced Pincodes
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl mb-6 text-sm font-semibold">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-250 text-emerald-700 px-4 py-3 rounded-2xl mb-6 text-sm font-medium flex items-center space-x-1.5">
          <Sparkles size={16} className="text-emerald-500 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* TAB 1: Menu Items Management */}
      {activeTab === 'menu' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Current Meals on Menu</h3>
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center space-x-1 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow hover:shadow-md transition-all"
            >
              <Plus size={14} />
              <span>Add New Dish</span>
            </button>
          </div>

          {loading && menuItems.length === 0 ? (
            <div className="text-center py-10 text-slate-500 font-semibold animate-pulse">Loading menu...</div>
          ) : menuItems.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-3xl">
              <ChefHat size={36} className="mx-auto text-slate-300 mb-2" />
              <p className="text-slate-550 text-sm">No dishes added yet. Click Add New Dish to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-xs font-extrabold uppercase tracking-wider">
                    <th className="py-4 px-3">Dish</th>
                    <th className="py-4 px-3">Category</th>
                    <th className="py-4 px-3">Diet</th>
                    <th className="py-4 px-3">Price</th>
                    <th className="py-4 px-3 text-center">Available Today</th>
                    <th className="py-4 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm font-semibold text-slate-700">
                  {menuItems.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-3 flex items-center space-x-3">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-xl border border-slate-100"
                        />
                        <div>
                          <p className="font-extrabold text-slate-900">{item.name}</p>
                          <p className="text-xs text-slate-400 font-normal line-clamp-1 max-w-xs">{item.description}</p>
                        </div>
                      </td>
                      <td className="py-4 px-3 capitalize">
                        <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-xs font-bold">
                          {item.category === 'both' ? 'Lunch & Dinner' : item.category}
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${
                          item.isVeg ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                        }`}>
                          {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                        </span>
                      </td>
                      <td className="py-4 px-3 font-extrabold text-slate-900">₹{item.price}</td>
                      <td className="py-4 px-3 text-center">
                        <button
                          onClick={() => handleToggleAvailability(item)}
                          className="focus:outline-none transition-colors"
                          title="Click to toggle availability"
                        >
                          {item.isAvailableToday ? (
                            <span className="inline-flex items-center space-x-1 bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1.5 rounded-xl text-xs font-extrabold">
                              Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 bg-slate-100 border border-slate-200 text-slate-400 px-3 py-1.5 rounded-xl text-xs font-extrabold">
                              No
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="py-4 px-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                            title="Edit Dish"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item._id, item.name)}
                            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            title="Delete Dish"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Pincodes Management */}
      {activeTab === 'pincodes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Pincode Form */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 h-fit">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-1.5">
              <MapPin size={18} className="text-amber-500" />
              <span>Add Service Area</span>
            </h3>
            <form onSubmit={handleAddPincode} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ahmedabad Pincode</label>
                <input
                  type="text"
                  required
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="e.g. 380015"
                  className="block w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Area / Location Name</label>
                <input
                  type="text"
                  required
                  value={areaName}
                  onChange={(e) => setAreaName(e.target.value)}
                  placeholder="e.g. Vastrapur"
                  className="block w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 shadow transition-all"
              >
                <span>Add Location</span>
              </button>
            </form>
          </div>

          {/* Serviced Pincode list */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Serviced Locations</h3>

            {pincodes.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-3xl">
                <p className="text-slate-400 text-sm">No delivery areas active yet. Add areas in the left panel.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pincodes.map((pin) => (
                  <div
                    key={pin._id}
                    className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">📍</span>
                      <div>
                        <p className="font-extrabold text-slate-800">{pin.code}</p>
                        <p className="text-xs text-slate-500 font-semibold">{pin.areaName}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeletePincode(pin._id, pin.code, pin.areaName)}
                      className="p-2 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded-xl transition-all"
                      title="Remove Location"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: Add / Edit Menu Item */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-xl p-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Close */}
            <button
              onClick={() => setShowItemModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-6">
              {editingItemId ? 'Edit Menu Dish' : 'Add New Tiffin Dish'}
            </h3>

            <form onSubmit={handleSubmitItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Special Gujarati Thali"
                  className="block w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description *</label>
                <textarea
                  required
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the items in the thali (e.g. 4 soft rotis, shaak of the day, dal, basmati rice, chaas, sweet)"
                  className="block w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Price (INR) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 150"
                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Service Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  >
                    <option value="lunch">Lunch Only</option>
                    <option value="dinner">Dinner Only</option>
                    <option value="both">Lunch & Dinner</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Vegetarian?</span>
                  <button
                    type="button"
                    onClick={() => setIsVeg(!isVeg)}
                    className="focus:outline-none"
                  >
                    {isVeg ? (
                      <span className="text-xs font-extrabold text-emerald-600 bg-emerald-55/60 px-3 py-1.5 rounded-xl border border-emerald-200">🟢 Veg Only</span>
                    ) : (
                      <span className="text-xs font-extrabold text-red-600 bg-red-55/60 px-3 py-1.5 rounded-xl border border-red-200">🔴 Non-Veg</span>
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Available Today?</span>
                  <button
                    type="button"
                    onClick={() => setIsAvailableToday(!isAvailableToday)}
                    className="focus:outline-none"
                  >
                    {isAvailableToday ? (
                      <span className="text-xs font-extrabold text-emerald-650 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">Yes</span>
                    ) : (
                      <span className="text-xs font-extrabold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">No</span>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Image URL (Optional)</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Leave blank for a default food placeholder link"
                  className="block w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="px-5 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold shadow hover:shadow-md transition-all disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
