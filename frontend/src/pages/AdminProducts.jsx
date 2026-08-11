import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../services/apiConfig';
import { 
  FiShoppingBag, FiPlus, FiEdit2, FiTrash2, FiSearch, 
  FiFilter, FiLayers, FiAlertCircle, FiEye, FiCheck, FiX
} from 'react-icons/fi';
import AdminLayout from '../layouts/AdminLayout';

const AdminProducts = () => {
  const { token, showToast } = useAuth();
  const location = useLocation();

  // Tab: 'products' or 'categories'
  const [activeTab, setActiveTab] = useState('products');

  // Products state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Categories state
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(false);

  // CRUD Modals
  const [showProductModal, setShowProductModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit' or 'view'
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    imageUrl: ''
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Category Form State
  const [showCatModal, setShowCatModal] = useState(false);
  const [catFormName, setCatFormName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [catModalType, setCatModalType] = useState('add'); // 'add' or 'edit'

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('All');
  const [selectedStockFilter, setSelectedStockFilter] = useState('All'); // 'All', 'InStock', 'LowStock', 'OutOfStock'
  const [sortBy, setSortBy] = useState('name-asc'); // 'name-asc', 'name-desc', 'price-asc', 'price-desc', 'stock-asc', 'stock-desc'

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Sync searchQuery to debouncedSearch
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // reset to page 1 on search
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Load products and categories
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodRes, catRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/products?t=${Date.now()}`),
        axios.get(`${API_BASE_URL}/api/categories?t=${Date.now()}`)
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
      if (catRes.data.length > 0 && !productForm.categoryId) {
        setProductForm(prev => ({ ...prev, categoryId: catRes.data[0].id }));
      }
    } catch (err) {
      console.error('Failed to load products/categories', err);
      setError('Connection to backend failed. Please verify Spring Boot and MySQL are running.');
      showToast('Error loading inventory data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Quick action trigger from dashboard redirect
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'add') {
      handleOpenProductModal('add');
    }
  }, [location]);

  // Open product modal
  const handleOpenProductModal = (type, prod = null) => {
    setModalType(type);
    setSelectedProduct(prod);
    if (type === 'add') {
      setProductForm({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: categories.length > 0 ? String(categories[0].id) : '',
        imageUrl: ''
      });
    } else if (prod) {
      setProductForm({
        name: prod.name,
        description: prod.description || '',
        price: String(prod.price),
        stock: String(prod.stock),
        categoryId: prod.category ? String(prod.category.id) : '',
        imageUrl: prod.images && prod.images.length > 0 ? prod.images[0].imageUrl : ''
      });
    }
    setShowProductModal(true);
  };

  // Submit product CRUD
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.stock || !productForm.categoryId) {
      showToast('Please fill all mandatory fields', 'error');
      return;
    }
    setFormSubmitting(true);
    try {
      const payload = {
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        categoryId: parseInt(productForm.categoryId),
        imageUrl: productForm.imageUrl
      };

      if (modalType === 'add') {
        await axios.post(`${API_BASE_URL}/api/products`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showToast('Product created successfully!', 'success');
      } else if (modalType === 'edit' && selectedProduct) {
        await axios.put(`${API_BASE_URL}/api/products/${selectedProduct.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showToast('Product updated successfully!', 'success');
      }
      setShowProductModal(false);
      loadData(); // reload
    } catch (err) {
      showToast(err.response?.data?.message || 'Fails to execute product action', 'error');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this product from database?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Product deleted successfully', 'success');
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete product', 'error');
    }
  };

  // Category add/edit submit
  const handleCatSubmit = async (e) => {
    e.preventDefault();
    if (!catFormName.trim()) return;
    setCatLoading(true);
    try {
      if (catModalType === 'add') {
        await axios.post(`${API_BASE_URL}/api/categories`, { name: catFormName }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showToast('Category created successfully!', 'success');
      } else if (catModalType === 'edit' && selectedCategory) {
        await axios.put(`${API_BASE_URL}/api/categories/${selectedCategory.id}`, { name: catFormName }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showToast('Category renamed successfully!', 'success');
      }
      setShowCatModal(false);
      setCatFormName('');
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to edit category', 'error');
    } finally {
      setCatLoading(false);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category? Products in this category will be orphaned.')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Category deleted successfully', 'success');
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete category', 'error');
    }
  };

  // Apply Filter, Search & Sorting
  const getFilteredProducts = () => {
    let result = [...products];

    // Search Query
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Category Filter
    if (selectedCatFilter !== 'All') {
      result = result.filter(p => p.category && String(p.category.id) === selectedCatFilter);
    }

    // Stock Level Filter
    if (selectedStockFilter === 'InStock') {
      result = result.filter(p => p.stock > 10);
    } else if (selectedStockFilter === 'LowStock') {
      result = result.filter(p => p.stock > 0 && p.stock <= 10);
    } else if (selectedStockFilter === 'OutOfStock') {
      result = result.filter(p => p.stock === 0);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'stock-asc':
          return a.stock - b.stock;
        case 'stock-desc':
          return b.stock - a.stock;
        case 'name-asc':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return result;
  };

  const filteredProducts = getFilteredProducts();
  
  // Pagination slice
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProductsList = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <AdminLayout>
      <div className="admin-products-wrapper animate-fade-in">
        {/* Header */}
        <div className="admin-page-header">
          <div>
            <h1 className="admin-main-heading">Product & Catalog Management</h1>
            <p className="admin-sub-heading">Edit listing prices, track stocks, and structure item classifications.</p>
          </div>
          <div className="dashboard-header-actions">
            {activeTab === 'products' ? (
              <button className="admin-btn-primary" onClick={() => handleOpenProductModal('add')}>
                <FiPlus style={{ marginRight: '6px' }} /> Add Product
              </button>
            ) : (
              <button className="admin-btn-primary" onClick={() => { setCatModalType('add'); setShowCatModal(true); }}>
                <FiPlus style={{ marginRight: '6px' }} /> Add Category
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-module-tabs">
          <button 
            className={`tab-link ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <FiShoppingBag size={16} /> Products Catalog
          </button>
          <button 
            className={`tab-link ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <FiLayers size={16} /> Product Categories
          </button>
        </div>

        {error && (
          <div className="admin-alert-banner danger">
            <FiAlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Tab 1: Products */}
        {activeTab === 'products' && (
          <div className="products-tab-content">
            {/* Search, Filters, and Sorter */}
            <div className="admin-table-filters-row">
              <div className="filter-search-box">
                <FiSearch size={16} className="search-box-icon" />
                <input 
                  type="text" 
                  placeholder="Search products by name..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="filters-group-controls">
                {/* Category Filter */}
                <div className="filter-select-wrapper">
                  <FiFilter size={14} className="select-icon" />
                  <select 
                    value={selectedCatFilter} 
                    onChange={e => { setSelectedCatFilter(e.target.value); setCurrentPage(1); }}
                  >
                    <option value="All">All Categories</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Stock Level Filter */}
                <div className="filter-select-wrapper">
                  <select 
                    value={selectedStockFilter} 
                    onChange={e => { setSelectedStockFilter(e.target.value); setCurrentPage(1); }}
                  >
                    <option value="All">All Stocks</option>
                    <option value="InStock">In Stock ({'>'}10)</option>
                    <option value="LowStock">Low Stock (1-10)</option>
                    <option value="OutOfStock">Out of Stock (0)</option>
                  </select>
                </div>

                {/* Sorting */}
                <div className="filter-select-wrapper">
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    <option value="name-asc">Alphabetical (A-Z)</option>
                    <option value="name-desc">Alphabetical (Z-A)</option>
                    <option value="price-asc">Price (Low to High)</option>
                    <option value="price-desc">Price (High to Low)</option>
                    <option value="stock-asc">Stock (Low to High)</option>
                    <option value="stock-desc">Stock (High to Low)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Table Card */}
            <div className="table-card">
              <div className="table-responsive-wrapper">
                <table className="admin-clean-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Inventory</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentProductsList.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="empty-row">No products found matching criteria.</td>
                      </tr>
                    ) : (
                      currentProductsList.map(p => {
                        const hasStock = p.stock > 10;
                        const lowStock = p.stock > 0 && p.stock <= 10;
                        const outStock = p.stock === 0;

                        return (
                          <tr key={p.id}>
                            <td>
                              <img 
                                src={(p.images && p.images.length > 0) ? p.images[0].imageUrl : 'https://via.placeholder.com/48?text=TV'} 
                                alt={p.name} 
                                className="table-thumbnail"
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/48?text=TV'; }}
                              />
                            </td>
                            <td className="item-bold">{p.name}</td>
                            <td>{p.category ? p.category.name : 'Unassigned'}</td>
                            <td>₹{(p.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            <td>{p.stock} units</td>
                            <td>
                              <span className={`admin-status-badge ${hasStock ? 'success' : lowStock ? 'warning' : 'danger'}`}>
                                {hasStock ? 'Healthy' : lowStock ? 'Low Stock' : 'Out of Stock'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div className="table-actions-cell">
                                <button className="act-icon-btn view" onClick={() => handleOpenProductModal('view', p)} title="View Details">
                                  <FiEye size={14} />
                                </button>
                                <button className="act-icon-btn edit" onClick={() => handleOpenProductModal('edit', p)} title="Edit Listing">
                                  <FiEdit2 size={14} />
                                </button>
                                <button className="act-icon-btn delete" onClick={() => handleDeleteProduct(p.id)} title="Delete Product">
                                  <FiTrash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Pagination */}
              {totalPages > 1 && (
                <div className="admin-table-pagination">
                  <span className="pagination-info">
                    Showing {indexOfFirstProduct + 1} to {Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} entries
                  </span>
                  <div className="pagination-buttons">
                    <button 
                      className="pagination-btn" 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Prev
                    </button>
                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <button 
                        key={idx} 
                        className={`pagination-btn num ${currentPage === idx + 1 ? 'active' : ''}`}
                        onClick={() => setCurrentPage(idx + 1)}
                      >
                        {idx + 1}
                      </button>
                    ))}
                    <button 
                      className="pagination-btn" 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Categories */}
        {activeTab === 'categories' && (
          <div className="categories-tab-content">
            <div className="table-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
              <div className="table-responsive-wrapper">
                <table className="admin-clean-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Category Name</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="empty-row">No product categories created yet.</td>
                      </tr>
                    ) : (
                      categories.map(c => (
                        <tr key={c.id}>
                          <td>{c.id}</td>
                          <td className="item-bold">{c.name}</td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="table-actions-cell" style={{ justifyContent: 'flex-end' }}>
                              <button 
                                className="act-icon-btn edit" 
                                onClick={() => { setSelectedCategory(c); setCatFormName(c.name); setCatModalType('edit'); setShowCatModal(true); }}
                                title="Rename Category"
                              >
                                <FiEdit2 size={14} />
                              </button>
                              <button 
                                className="act-icon-btn delete" 
                                onClick={() => handleDeleteCategory(c.id)}
                                title="Delete Category"
                              >
                                <FiTrash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product CRUD Modal */}
      {showProductModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box">
            <div className="modal-header-row">
              <h3>
                {modalType === 'add' && 'Add New Product Listing'}
                {modalType === 'edit' && 'Modify Product Details'}
                {modalType === 'view' && 'Product Details Card'}
              </h3>
              <button className="modal-close-btn" onClick={() => setShowProductModal(false)}>✕</button>
            </div>
            
            {modalType === 'view' && selectedProduct ? (
              <div className="view-product-detail-modal">
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <img 
                    src={(selectedProduct.images && selectedProduct.images.length > 0) ? selectedProduct.images[0].imageUrl : 'https://via.placeholder.com/150?text=TV'} 
                    alt={selectedProduct.name}
                    style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '12px', border: '1px solid #e5e7eb' }}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=TV'; }}
                  />
                </div>
                <div className="detail-row">
                  <span className="label">Name:</span>
                  <span className="val">{selectedProduct.name}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Price:</span>
                  <span className="val font-semibold">₹{(selectedProduct.price || 0).toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Stock Level:</span>
                  <span className="val">{selectedProduct.stock} units</span>
                </div>
                <div className="detail-row">
                  <span className="label">Category:</span>
                  <span className="val-badge">{selectedProduct.category ? selectedProduct.category.name : 'None'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Description:</span>
                  <span className="val-desc">{selectedProduct.description || 'No description provided.'}</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleProductSubmit} className="modal-form">
                <div className="modal-input-field">
                  <label>Product Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Sony Master XR 65 Inch"
                    value={productForm.name}
                    onChange={e => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                    disabled={formSubmitting}
                  />
                </div>
                
                <div className="modal-input-field">
                  <label>Description</label>
                  <textarea 
                    placeholder="e.g. High fidelity colors, immersive display, and 120Hz refresh rates."
                    value={productForm.description}
                    onChange={e => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                    disabled={formSubmitting}
                  />
                </div>

                <div className="modal-form-row">
                  <div className="modal-input-field">
                    <label>Price (INR) *</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 120000"
                      value={productForm.price}
                      onChange={e => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                      required
                      disabled={formSubmitting}
                    />
                  </div>
                  <div className="modal-input-field">
                    <label>Stock Quantity *</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 15"
                      value={productForm.stock}
                      onChange={e => setProductForm(prev => ({ ...prev, stock: e.target.value }))}
                      required
                      disabled={formSubmitting}
                    />
                  </div>
                </div>

                <div className="modal-input-field">
                  <label>Category *</label>
                  <select 
                    value={productForm.categoryId} 
                    onChange={e => setProductForm(prev => ({ ...prev, categoryId: e.target.value }))}
                    required
                    disabled={formSubmitting}
                  >
                    {categories.length === 0 ? (
                      <option value="">No categories created yet</option>
                    ) : (
                      categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))
                    )}
                  </select>
                </div>

                <div className="modal-input-field">
                  <label>Product Image URL</label>
                  <input 
                    type="url" 
                    placeholder="e.g. https://image.kit/tv.jpg"
                    value={productForm.imageUrl}
                    onChange={e => setProductForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                    disabled={formSubmitting}
                  />
                </div>

                <button type="submit" className="modal-action-btn" disabled={formSubmitting}>
                  {formSubmitting ? 'Saving...' : modalType === 'add' ? 'Create Product' : 'Update Details'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Category Add/Edit Modal */}
      {showCatModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box">
            <div className="modal-header-row">
              <h3>{catModalType === 'add' ? 'Add New Category' : 'Rename Category'}</h3>
              <button className="modal-close-btn" onClick={() => setShowCatModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCatSubmit} className="modal-form">
              <div className="modal-input-field">
                <label>Category Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Curved Panel TVs" 
                  value={catFormName}
                  onChange={e => setCatFormName(e.target.value)}
                  required
                  disabled={catLoading}
                />
              </div>
              <button type="submit" className="modal-action-btn" disabled={catLoading}>
                {catLoading ? 'Saving...' : catModalType === 'add' ? 'Save Category' : 'Rename Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;
