'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { ProductModal } from '../../components/ProductModal';
import { dataStore } from '../../lib/dataStore';
import { Product } from '../../types';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  AlertTriangle,
  IndianRupee,
  Layers,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function ProductsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const sync = () => {
      setProducts([...dataStore.getProducts()]);
    };
    sync();
    const unsubscribe = dataStore.subscribe(sync);
    return () => unsubscribe();
  }, []);

  const categories = [
    { id: 'all', label: 'All Catalog' },
    { id: 'purifier_domestic', label: 'Domestic RO' },
    { id: 'purifier_commercial', label: 'Commercial RO' },
    { id: 'dispensers', label: 'Dispensers' },
    { id: 'booster_pumps', label: 'Booster Pumps' },
    { id: 'ro_membranes', label: 'RO Membranes' },
    { id: 'filter_cartridges', label: 'Filter Cartridges' },
    { id: 'minerals_uv', label: 'Minerals & UV' },
    { id: 'spares_fittings', label: 'Spares & Fittings' },
    { id: 'water_testing', label: 'Testing Kits' },
  ];

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));

    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const handleSaveProduct = (prodData: Partial<Product>) => {
    if (editingProduct) {
      dataStore.updateProduct({ ...editingProduct, ...prodData } as Product);
    } else {
      dataStore.addProduct(prodData as any);
    }
    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from the active water purifier catalog?`)) {
      dataStore.deleteProduct(id);
    }
  };

  const handleStockQuickEdit = (p: Product) => {
    const newStock = prompt(`Update stock count for "${p.name}":`, String(p.stockQuantity));
    if (newStock !== null && !isNaN(Number(newStock))) {
      dataStore.updateProduct({ ...p, stockQuantity: Number(newStock) });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header onToggleSidebar={() => setSidebarOpen(true)} title="Catalog & Inventory" />

        <main className="p-4 lg:p-8 space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Water Purifier Products ({products.length})
              </h2>
              <p className="text-xs text-slate-500">
                Manage retail MRP, dealer wholesale discounts, MOQ, and warehouse inventory
              </p>
            </div>

            <button
              onClick={() => {
                setEditingProduct(null);
                setModalOpen(true);
              }}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-cyan-600/20 flex items-center justify-center space-x-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Search & Category Filter Pills */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products by title, filtration technology, brand..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredProducts.map((product) => {
              const discountPercent = Math.round(
                ((product.retailPrice - product.wholesalePrice) / product.retailPrice) * 100
              );
              const isLowStock = product.stockQuantity < 15;

              return (
                <div
                  key={product.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all"
                >
                  <div>
                    {/* Image & Stock Badge Header */}
                    <div className="relative h-44 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <img
                        src={product.thumbnail}
                        alt={product.name}
                        onError={(e) => {
                          // Fallback to high-res stylized water asset
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80';
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-white">
                        {product.brand}
                      </span>

                      <button
                        onClick={() => handleStockQuickEdit(product)}
                        className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md flex items-center space-x-1 ${
                          isLowStock
                            ? 'bg-amber-500/90 text-white'
                            : 'bg-emerald-600/90 text-white'
                        }`}
                      >
                        {isLowStock && <AlertTriangle className="w-3 h-3 mr-0.5" />}
                        <span>{product.stockQuantity} in Stock</span>
                      </button>
                    </div>

                    {/* Body */}
                    <div className="p-4 space-y-2">
                      <span className="text-[10px] font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                        {product.categoryLabel || product.category}
                      </span>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 leading-tight">
                        {product.name}
                      </h3>
                      <p className="text-slate-500 text-xs line-clamp-2">{product.description}</p>

                      {/* Pricing Comparison Box */}
                      <div className="mt-3 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-semibold uppercase">
                            Customer Retail
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            ₹{product.retailPrice.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase block">
                            Wholesale ({discountPercent}% OFF)
                          </span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            ₹{product.wholesalePrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>Wholesale MOQ: <strong className="text-slate-700 dark:text-slate-300">{product.minOrderQuantity} units</strong></span>
                        <span>Rating: ⭐ {product.rating} ({product.reviewCount})</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-2 mt-2">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setModalOpen(true);
                      }}
                      className="flex-1 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Details</span>
                    </button>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center text-slate-400 text-xs border border-slate-200 dark:border-slate-800">
              No products found matching your search.
            </div>
          )}
        </main>
      </div>

      {/* Modal for adding/editing product */}
      {modalOpen && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
}
