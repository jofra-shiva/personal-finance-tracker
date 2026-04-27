import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { X, Plus, Tag } from 'lucide-react';

const TransactionModal = ({ isOpen, onClose, onSuccess, editingTransaction, categories, fetchCategories }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', type: 'expense', color: '#3b82f6' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        title: editingTransaction.title,
        amount: editingTransaction.amount,
        type: editingTransaction.type,
        category: editingTransaction.category?._id || '',
        date: new Date(editingTransaction.date).toISOString().split('T')[0],
        description: editingTransaction.description || ''
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
    }
  }, [editingTransaction, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingTransaction) {
        await axios.put(`http://localhost:5000/api/transactions/${editingTransaction._id}`, formData);
        toast.success('Transaction updated');
      } else {
        await axios.post('http://localhost:5000/api/transactions', formData);
        toast.success('Transaction added');
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/categories', newCategory);
      await fetchCategories();
      setFormData({ ...formData, category: res.data._id });
      setShowAddCategory(false);
      setNewCategory({ name: '', type: 'expense', color: '#3b82f6' });
      toast.success('Category added');
    } catch (error) {
      toast.error('Failed to add category');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold">{editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                required
                type="text"
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                placeholder="Rent, Groceries, Salary..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input
                required
                type="number"
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                required
                type="date"
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <div className="flex bg-slate-50 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'expense' })}
                  className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-all ${formData.type === 'expense' ? 'bg-white dark:bg-slate-700 shadow-sm text-rose-600' : 'text-slate-500'}`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'income' })}
                  className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-all ${formData.type === 'income' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600' : 'text-slate-500'}`}
                >
                  Income
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <div className="flex gap-2">
                <select
                  required
                  className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {categories.filter(c => c.type === formData.type).map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowAddCategory(!showAddCategory)}
                  className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-xl hover:bg-primary-200 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {showAddCategory && (
            <div className="p-4 bg-primary-50 dark:bg-primary-900/10 rounded-2xl border border-primary-100 dark:border-primary-900/20 space-y-3">
              <p className="text-xs font-bold uppercase text-primary-600">New Category</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Category Name"
                  className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-800 border-none rounded-lg text-sm"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value, type: formData.type })}
                />
                <input
                  type="color"
                  className="w-10 h-8 p-0 border-none bg-transparent"
                  value={newCategory.color}
                  onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm font-medium"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Description (Optional)</label>
            <textarea
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm h-24"
              placeholder="Add more details..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (editingTransaction ? 'Update' : 'Add Transaction')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
