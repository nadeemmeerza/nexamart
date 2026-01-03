// components/admin/AddProductModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { X, Upload, Loader2, Plus, AlertCircle } from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Category {
  id: string;
  name: string;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    shortDescription: '',
    categoryId: '',
    price: '',
    comparePrice: '',
    costPrice: '',
    weight: '',
    initialStock: '0',
    reorderPoint: '10',
    status: 'active',
    visibility: 'visible',
    images: [] as string[],
    thumbnail: '',
    warehouse: '',
    dimensions: {
      length: '',
      width: '',
      height: '',
      unit: 'cm'
    },
  });
  const [imageUrl, setImageUrl] = useState('');
  const [currentImage, setCurrentImage] = useState('');

  // Fetch categories on mount 
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      console.log(response);
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [name]: value,
      },
    }));
  };

  const handleAddImage = () => {
    if (imageUrl.trim() && !formData.images.includes(imageUrl.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl.trim()],
      }));
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      thumbnail: prev.thumbnail === prev.images[index] ? '' : prev.thumbnail,
    }));
  };

  const handleSetThumbnail = (url: string) => {
    setFormData(prev => ({
      ...prev,
      thumbnail: url,
    }));
  };

  const generateSKU = () => {
    const prefix = 'PROD';
    const random = Math.floor(10000 + Math.random() * 90000);
    return `${prefix}-${random}`;
  };

  const handleGenerateSKU = () => {
    setFormData(prev => ({
      ...prev,
      sku: generateSKU(),
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Product name is required');
      return false;
    }
    if (!formData.sku.trim()) {
      setError('SKU is required');
      return false;
    }
    if (!formData.categoryId) {
      setError('Category is required');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Price must be greater than 0');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
          credentials: 'include',
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
          costPrice: formData.costPrice ? parseFloat(formData.costPrice) : null,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          initialStock: parseInt(formData.initialStock),
          reorderPoint: parseInt(formData.reorderPoint),
          dimensions: formData.dimensions.length || formData.dimensions.width || formData.dimensions.height
            ? {
                length: formData.dimensions.length ? parseFloat(formData.dimensions.length) : null,
                width: formData.dimensions.width ? parseFloat(formData.dimensions.width) : null,
                height: formData.dimensions.height ? parseFloat(formData.dimensions.height) : null,
                unit: formData.dimensions.unit,
              }
            : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create product');
      }

      // Reset form
      setFormData({
        name: '',
        sku: '',
        description: '',
        shortDescription: '',
        categoryId: '',
        price: '',
        comparePrice: '',
        costPrice: '',
        weight: '',
        initialStock: '0',
        reorderPoint: '10',
        status: 'active',
        visibility: 'visible',
        images: [],
        thumbnail: '',
        warehouse: '',
        dimensions: {
          length: '',
          width: '',
          height: '',
          unit: 'cm'
        },
      });
      setImageUrl('');
      setCurrentImage('');

      onSuccess();
      onClose();

    } catch (error: any) {
      console.error('Error creating product:', error);
      setError(error.message || 'Failed to create product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 bg-white rounded-t-2xl">
            <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isLoading}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left Column - Basic Info */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition"
                    placeholder="Enter product name"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SKU *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition"
                        placeholder="e.g., PROD-12345"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={handleGenerateSKU}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        disabled={isLoading}
                      >
                        Generate
                      </button>
                    </div>
                  </div>
 </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition"
                      required
                      disabled={isLoading}
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
               

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description
                  </label>
                  <textarea
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition"
                    placeholder="Brief description for product listings"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition"
                    placeholder="Detailed product description"
                    disabled={isLoading}
                  />
                </div>

                {/* Dimensions */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Dimensions</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Length
                      </label>
                      <input
                        type="number"
                        name="length"
                        value={formData.dimensions.length}
                        onChange={handleDimensionChange}
                        step="0.1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition"
                        placeholder="0.0"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Width
                      </label>
                      <input
                        type="number"
                        name="width"
                        value={formData.dimensions.width}
                        onChange={handleDimensionChange}
                        step="0.1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition"
                        placeholder="0.0"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Height
                      </label>
                      <input
                        type="number"
                        name="height"
                        value={formData.dimensions.height}
                        onChange={handleDimensionChange}
                        step="0.1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition"
                        placeholder="0.0"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <select
                      name="unit"
                      value={formData.dimensions.unit}
                      onChange={handleDimensionChange}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition"
                      disabled={isLoading}
                    >
                      <option value="cm">cm</option>
                      <option value="in">inches</option>
                      <option value="mm">mm</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Right Column - Pricing & Images */}
              <div className="space-y-6">
                {/* Pricing */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          step="0.01"
                          min="0"
                          className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition"
                          placeholder="0.00"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Compare Price
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            $
                          </span>
                          <input
                            type="number"
                            name="comparePrice"
                            value={formData.comparePrice}
                            onChange={handleInputChange}
                            step="0.01"
                            min="0"
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition"
                            placeholder="0.00"
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cost Price
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            $
                          </span>
                          <input
                            type="number"
                            name="costPrice"
                            value={formData.costPrice}
                            onChange={handleInputChange}
                            step="0.01"
                            min="0"
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition"
                            placeholder="0.00"
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Inventory */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Initial Stock
                      </label>
                      <input
                        type="number"
                        name="initialStock"
                        value={formData.initialStock}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition"
                        placeholder="0"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reorder Point
                      </label>
                      <input
                        type="number"
                        name="reorderPoint"
                        value={formData.reorderPoint}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition"
                        placeholder="10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Warehouse Location
                    </label>
                    <input
                      type="text"
                      name="warehouse"
                      value={formData.warehouse}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition"
                      placeholder="e.g., WH-001"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Images */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h3>
                  
                  {/* Image URL Input */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add Image URL (Unsplash, etc.)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition"
                        placeholder="https://images.unsplash.com/..."
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={handleAddImage}
                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                        disabled={isLoading || !imageUrl.trim()}
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Image Preview */}
                  {formData.images.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Images ({formData.images.length})
                        {formData.thumbnail && (
                          <span className="text-green-600 ml-2">
                            • Thumbnail selected
                          </span>
                        )}
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        {formData.images.map((url, index) => (
                          <div
                            key={index}
                            className={`relative group border-2 rounded-lg overflow-hidden ${
                              formData.thumbnail === url 
                                ? 'border-green-500' 
                                : 'border-gray-200'
                            }`}
                          >
                            <img
                              src={url}
                              alt={`Product ${index + 1}`}
                              className="w-full h-24 object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Image+Error';
                              }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleSetThumbnail(url)}
                                  className="p-1.5 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                                  title="Set as thumbnail"
                                >
                                  <Upload className="w-4 h-4 text-gray-700" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(index)}
                                  className="p-1.5 bg-white rounded-lg hover:bg-red-50 transition-colors"
                                  title="Remove image"
                                >
                                  <X className="w-4 h-4 text-red-500" />
                                </button>
                              </div>
                            </div>
                            {formData.thumbnail === url && (
                              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                Thumbnail
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Current Image Preview */}
                  {currentImage && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Preview
                      </p>
                      <img
                        src={currentImage}
                        alt="Current preview"
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=Image+Error';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Status & Visibility */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition"
                        disabled={isLoading}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Visibility
                      </label>
                      <select
                        name="visibility"
                        value={formData.visibility}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition"
                        disabled={isLoading}
                      >
                        <option value="visible">Visible</option>
                        <option value="hidden">Hidden</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Product'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};