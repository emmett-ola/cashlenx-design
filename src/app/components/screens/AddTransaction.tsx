import React, { useState, useEffect } from 'react';
import { X, Calendar, FileText, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { NumericKeypad } from '../organisms/NumericKeypad';
import { Chip } from '../atoms/Chip';
import { Button } from '../atoms/Button';
import { DatePicker } from '../molecules/DatePicker';
import { CategoryService, SystemConfigService } from '../../services/localStorage';
import { CategoryEntity } from '../../types/entities';

interface AddTransactionProps {
  onClose: () => void;
  onSubmit: (transaction: any) => void;
}

export function AddTransaction({ onClose, onSubmit }: AddTransactionProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('0');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState<{ amount?: boolean; category?: boolean }>({});
  
  // Category navigation state
  const [categories, setCategories] = useState<CategoryEntity[]>([]);
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);
  const [parentCategory, setParentCategory] = useState<CategoryEntity | null>(null);

  // Load categories on mount and when type changes
  useEffect(() => {
    const systemConfig = SystemConfigService.get();
    const userId = systemConfig.defaultUserId;
    
    if (userId) {
      const userCategories = CategoryService.getByUserId(userId);
      setCategories(userCategories.filter(cat => cat.type === type));
    }
    
    // Reset selection and navigation when type changes
    setSelectedCategoryId('');
    setCurrentParentId(null);
    setParentCategory(null);
  }, [type]);

  // Get categories to display based on current navigation
  const displayCategories = currentParentId && parentCategory
    ? [parentCategory, ...categories.filter(cat => cat.parentId === currentParentId)]
    : categories.filter(cat => cat.parentId === currentParentId);

  // Check if a category has children
  const hasChildren = (categoryId: string) => {
    return categories.some(cat => cat.parentId === categoryId);
  };

  // Get selected category name for display
  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);

  const handleKeyPress = (key: string) => {
    if (key === 'backspace') {
      setAmount(amount.length > 1 ? amount.slice(0, -1) : '0');
    } else if (key === '.' && !amount.includes('.')) {
      setAmount(amount + '.');
    } else if (key !== '.') {
      setAmount(amount === '0' ? key : amount + key);
    }
  };

  const handleSubmit = () => {
    // Validation
    const newErrors: { amount?: boolean; category?: boolean } = {};
    
    if (parseFloat(amount) <= 0) {
      newErrors.amount = true;
    }
    
    if (!selectedCategoryId) {
      newErrors.category = true;
    }
    
    // If there are errors, show them and expand details
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShowDetails(true);
      
      // Clear errors after animation
      setTimeout(() => {
        setErrors({});
      }, 2000);
      
      return;
    }
    
    // Convert date from "2026-03-17" to "20260317" format
    const belongsDate = date.replace(/-/g, '');
    
    onSubmit({
      amount: parseFloat(amount),
      category_id: selectedCategoryId,
      belongs_date: belongsDate,
      description: description,
    });
    onClose();
  };

  const handleCategoryClick = (category: CategoryEntity) => {
    // If clicking the parent category while already viewing its children, collapse back to first level
    if (currentParentId && category.id === currentParentId) {
      // Collapse back to the first level
      const grandParent = categories.find(cat => cat.id === parentCategory?.parentId);
      setCurrentParentId(parentCategory?.parentId || null);
      setParentCategory(grandParent || null);
      return;
    }
    
    // Check if this category has children
    if (hasChildren(category.id)) {
      // Navigate into this category to show its children and auto-select the parent
      setCurrentParentId(category.id);
      setParentCategory(category);
      setSelectedCategoryId(category.id); // Auto-select the parent category
    } else {
      // This is a leaf category, select it
      setSelectedCategoryId(category.id);
    }
  };

  const handleBackClick = () => {
    // Go back one level in the category hierarchy
    if (currentParentId && parentCategory) {
      // Find the parent of the current parent
      const grandParent = categories.find(cat => cat.id === parentCategory.parentId);
      setCurrentParentId(parentCategory.parentId);
      setParentCategory(grandParent || null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <h2>Add Transaction</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-20">
          {/* Type Segmented Control */}
          <div className="px-4 py-4">
            <div className="flex bg-gray-100 rounded-xl p-1">
              {(['income', 'expense'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${
                    type === t
                      ? 'bg-white shadow-sm'
                      : 'text-gray-600'
                  }`}
                  style={type === t ? { color: 'var(--theme-color)' } : {}}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Display */}
          <div className={`px-4 py-6 text-center ${errors.amount ? 'animate-shake' : ''}`}>
            <p className={`text-sm mb-2 ${errors.amount ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>
              {errors.amount ? 'Amount must be greater than 0' : 'Amount'}
            </p>
            <button
              onClick={() => setShowDetails(false)}
              className={`text-display hover:opacity-80 transition-opacity cursor-pointer ${errors.amount ? 'text-red-500' : ''}`}
              style={!errors.amount ? { color: 'var(--theme-color)' } : {}}
            >
              ${amount}
            </button>
            {/* Expand/Collapse Toggle Button */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="mt-4 flex items-center gap-1 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium text-gray-700 mx-auto"
            >
              {showDetails ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Hide Details
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Show Details
                </>
              )}
            </button>
          </div>

          {/* Details Form */}
          {showDetails && (
            <div className="px-4 pb-4 space-y-4 border-t border-gray-200 pt-4">
              {/* Category Grid */}
              <div className={errors.category ? 'animate-shake' : ''}>
                <label className={`block text-sm font-medium mb-2 ${errors.category ? 'text-red-500 font-semibold' : 'text-gray-700'}`}>
                  {errors.category ? 'Please select a category' : 'Category'}
                </label>

                {displayCategories.length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    No categories available. Please create some in Settings.
                  </div>
                )}

                <div className={`grid grid-cols-4 gap-2 ${errors.category ? 'ring-2 ring-red-500 rounded-xl p-2' : ''}`}>
                  {displayCategories.map((cat) => {
                    const isSelected = selectedCategoryId === cat.id;
                    const categoryHasChildren = hasChildren(cat.id);
                    const isParentInSubView = currentParentId && cat.id === currentParentId;
                    
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat)}
                        className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all relative ${
                          isSelected
                            ? 'text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        style={isSelected ? { backgroundColor: 'var(--theme-color)' } : {}}
                      >
                        <span className="text-2xl">{cat.icon}</span>
                        <span className="text-xs text-center leading-tight">{cat.name}</span>
                        {categoryHasChildren && !currentParentId && (
                          <ChevronDown className={`w-3 h-3 absolute top-1 right-1 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                        )}
                        {isParentInSubView && (
                          <ChevronUp className={`w-3 h-3 absolute top-1 right-1 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                        )}
                      </button>
                    );
                  })}
                </div>
                
                {selectedCategory && (
                  <div className="mt-2 text-sm text-gray-600 text-center">
                    Selected: <span className="font-semibold" style={{ color: 'var(--theme-color)' }}>{selectedCategory.name}</span>
                  </div>
                )}
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date
                </label>
                <DatePicker
                  value={date}
                  onChange={setDate}
                />
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Note (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a note..."
                  className="w-full px-4 py-3 bg-gray-100 rounded-lg outline-none focus:ring-2 resize-none"
                  style={{ '--tw-ring-color': 'var(--theme-color)' } as React.CSSProperties}
                  rows={2}
                />
              </div>
            </div>
          )}

          {/* Keypad */}
          {!showDetails && <NumericKeypad onKeyPress={handleKeyPress} />}
        </div>

        {/* Fixed Bottom Button */}
        <div className="bg-white border-t border-gray-200 px-4 py-3 shadow-2xl mt-auto">
          <Button
            variant="primary"
            onClick={handleSubmit}
            className="w-full"
          >
            Add Transaction
          </Button>
        </div>
      </div>
    </div>
  );
}