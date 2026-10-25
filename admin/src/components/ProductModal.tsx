'use client';

import React, { useState } from 'react';
import { Product } from '../types';
import { X, Save, AlertCircle } from 'lucide-react';

interface ProductModalProps {
  product?: Product | null;
  onClose: () => void;
  onSave: (product: Partial<Product>) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      name: '',
      slug: '',
      category: 'purifier_domestic',
      categoryLabel: 'Domestic RO Purifiers',
      brand: 'Aquaflow',
      description: '',
      retailPrice: 9999,
      wholesalePrice: 6500,
      minOrderQuantity: 1,
      stockQuantity: 25,
      thumbnail: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80'
      ],
      specifications: {
        'Technology': 'RO + UV + UF',
        'Capacity': '12 L/hr',
        'Warranty': '1 Year Comprehensive'
      },
      rating: 4.8,
      reviewCount: 20,
      featured: false,
      isActive: true,
    }
  );

  const categories = [
    { id: 'purifier_domestic', label: 'Domestic RO Purifiers' },
    { id: 'purifier_commercial', label: 'Commercial RO Systems' },
    { id: 'dispensers', label: 'Water Dispensers' },
    { id: 'booster_pumps', label: 'Booster & Diaphragm Pumps' },
    { id: 'ro_membranes', label: 'RO Membranes' },
    { id: 'filter_cartridges', label: 'Filter Cartridges' },
    { id: 'minerals_uv', label: 'Minerals & UV Sterilization' },
    { id: 'spares_fittings', label: 'Spare Parts & Fittings' },
    { id: 'water_testing', label: 'Testing Kits & Meters' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.retailPrice || !formData.wholesalePrice) {
      alert('Please fill all mandatory fields (Name, Retail Price, Wholesale Price)');
      return;
    }
    const catObj = categories.find(c => c.id === formData.category);
    onSave({
      ...formData,
      categoryLabel: catObj ? catObj.label : 'Water Purifier Equipment',
      slug: (formData.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {product ? 'Edit Product & Inventory' : 'Add New Water Purification Product'}
            </h3>
            <p className="text-xs text-slate-500">Configure retail, wholesale pricing, stock, and specs</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-sm flex-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Product Title *
            </label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
              placeholder="e.g. Aquaflow Copper Prime RO+UV 12L"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Brand Name *
              </label>
              <input
                type="text"
                required
                value={formData.brand || ''}
                onChange={e => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>
          </div>

          {/* Pricing Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Customer Retail Price (₹) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.retailPrice || ''}
                onChange={e => setFormData({ ...formData, retailPrice: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none font-semibold text-cyan-600 dark:text-cyan-400"
              />
              <span className="text-[10px] text-slate-400">Regular customer MRP</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Dealer Wholesale Price (₹) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.wholesalePrice || ''}
                onChange={e => setFormData({ ...formData, wholesalePrice: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none font-semibold text-emerald-600 dark:text-emerald-400"
              />
              <span className="text-[10px] text-slate-400">Approved dealer discount</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Wholesale Min Order (MOQ)
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.minOrderQuantity || 1}
                onChange={e => setFormData({ ...formData, minOrderQuantity: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
              />
              <span className="text-[10px] text-slate-400">Dealers bulk minimum</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Inventory Stock Units *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.stockQuantity ?? 10}
                onChange={e => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Primary Image URL
              </label>
              <input
                type="url"
                value={formData.thumbnail || ''}
                onChange={e => setFormData({ ...formData, thumbnail: e.target.value, images: [e.target.value] })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none text-xs"
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
              placeholder="Detailed water purification description and benefits..."
            />
          </div>

          <div className="p-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end space-x-3 -mx-6 -mb-6 bg-slate-50 dark:bg-slate-800/40 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold flex items-center space-x-2 shadow-md shadow-cyan-600/20"
            >
              <Save className="w-4 h-4" />
              <span>Save Product</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
