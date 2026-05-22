import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Edit2,
  Move,
  X,
} from 'lucide-react';
import { Button } from '../atoms/Button';
import EmojiPicker from 'emoji-picker-react@4.12.0';
import { APP_COLOR_PALETTE } from '../../constants/colors';
import { layout } from '../../constants/sharedStyles';
import { CategoryService, SystemConfigService, CashFlowService } from '../../services/localStorage';
import { CategoryEntity } from '../../types/entities';
import { useSafeI18n } from '../../contexts/I18nContext';

interface CategoryManagementProps {
  onCategoryChange?: () => void; // Callback to trigger refresh in parent components
}

export function CategoryManagement({ onCategoryChange }: CategoryManagementProps = {}) {
  const { t } = useSafeI18n();
  const [activeType, setActiveType] = useState<'expense' | 'income'>('expense');
  const [categories, setCategories] = useState<CategoryEntity[]>([]);
  
  // Initialize expanded categories from sessionStorage (persists during session, cleared on app restart)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(() => {
    const saved = sessionStorage.getItem('categoryManagement_expandedCategories');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuOpenUpward, setMenuOpenUpward] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    category: CategoryEntity | null;
  }>({
    show: false,
    category: null,
  });
  const [editPanel, setEditPanel] = useState<{
    show: boolean;
    mode: 'create' | 'edit';
    category: CategoryEntity | null;
    parentId?: string | null;
  }>({ show: false, mode: 'create', category: null });
  const [editForm, setEditForm] = useState<{
    name: string;
    icon: string;
    color: string;
    parentId: string | null;
  }>({
    name: '',
    icon: '😊',
    color: '#008080',
    parentId: null,
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [movePanel, setMovePanel] = useState<{
    show: boolean;
    category: CategoryEntity | null;
  }>({ show: false, category: null });

  // Load categories from localStorage on mount and when type changes
  useEffect(() => {
    const systemConfig = SystemConfigService.get();
    const userId = systemConfig.defaultUserId;
    
    if (userId) {
      const userCategories = CategoryService.getByUserId(userId);
      setCategories(userCategories.filter(cat => cat.type === activeType));
    } else {
      setCategories([]);
    }
  }, [activeType]);

  // Filter parent categories
  const parentCategories = categories.filter((cat) => cat.parentId === null);

  const toggleExpand = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
    sessionStorage.setItem('categoryManagement_expandedCategories', JSON.stringify(Array.from(newExpanded)));
  };

  const getChildrenCount = (parentId: string) => {
    return categories.filter((cat) => cat.parentId === parentId).length;
  };

  const getChildCategories = (parentId: string) => {
    return categories.filter((cat) => cat.parentId === parentId);
  };

  const getTotalRecords = (category: CategoryEntity) => {
    // Calculate from actual CashFlow records
    const systemConfig = SystemConfigService.get();
    const userId = systemConfig.defaultUserId;

    if (!userId) return 0;

    const cashFlows = CashFlowService.getByUserId(userId);
    return cashFlows.filter(cf => cf.categoryId === category.id).length;
  };

  const handleDeleteClick = (category: CategoryEntity) => {
    setDeleteConfirm({ show: true, category });
    setOpenMenuId(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirm.category) return;

    const systemConfig = SystemConfigService.get();
    const userId = systemConfig.defaultUserId;

    if (!userId) return;

    // Delete the category via service (soft delete)
    CategoryService.delete(deleteConfirm.category.id, userId);

    // If it's a parent category, delete all children
    if (deleteConfirm.category.parentId === null) {
      const children = categories.filter(cat => cat.parentId === deleteConfirm.category!.id);
      children.forEach(child => {
        CategoryService.delete(child.id, userId);
      });
    }

    // Reload categories
    const userCategories = CategoryService.getByUserId(userId);
    setCategories(userCategories.filter(cat => cat.type === activeType));

    setDeleteConfirm({ show: false, category: null });
    
    // Trigger refresh in parent components
    if (onCategoryChange) onCategoryChange();
  };

  const handleCancelDelete = () => {
    setDeleteConfirm({ show: false, category: null });
  };

  const handleEditClick = (category: CategoryEntity) => {
    setEditPanel({ show: true, mode: 'edit', category });
    setEditForm({
      name: category.name,
      icon: category.icon,
      color: category.color || '#008080',
      parentId: category.parentId,
    });
    setShowEmojiPicker(false);
    setOpenMenuId(null);
  };

  const handleMoveClick = (category: CategoryEntity) => {
    setMovePanel({ show: true, category });
    setOpenMenuId(null);
  };

  const handleCreateClick = () => {
    setEditPanel({
      show: true,
      mode: 'create',
      category: null,
    });
    setEditForm({ name: '', icon: '😊', color: '#008080', parentId: null });
    setShowEmojiPicker(false);
  };

  const handleCloseEditPanel = () => {
    setEditPanel({
      show: false,
      mode: 'create',
      category: null,
    });
    setEditForm({ name: '', icon: '😊', color: '#008080', parentId: null });
    setShowEmojiPicker(false);
  };

  const handleSaveCategory = () => {
    if (!editForm.name.trim()) return;

    const systemConfig = SystemConfigService.get();
    const userId = systemConfig.defaultUserId;

    if (!userId) return;

    if (editPanel.mode === 'edit' && editPanel.category) {
      // Update existing category via service
      CategoryService.update(
        editPanel.category.id,
        {
          name: editForm.name,
          icon: editForm.icon,
          color: editForm.color,
          parentId: editForm.parentId,
        },
        userId
      );

      // Reload categories
      const userCategories = CategoryService.getByUserId(userId);
      setCategories(userCategories.filter(cat => cat.type === activeType));
    } else {
      // Create new category via service
      CategoryService.create({
        belongsUserId: userId,
        name: editForm.name,
        type: activeType,
        icon: editForm.icon,
        color: editForm.color,
        isDefault: false,
        parentId: editForm.parentId,
      });

      // Reload categories
      const userCategories = CategoryService.getByUserId(userId);
      setCategories(userCategories.filter(cat => cat.type === activeType));
    }

    handleCloseEditPanel();
    if (onCategoryChange) onCategoryChange();
  };

  const handleEmojiSelect = (emojiData: any) => {
    setEditForm((prev) => ({ ...prev, icon: emojiData.emoji }));
    setShowEmojiPicker(false);
  };

  const renderCategory = (category: CategoryEntity, isChild: boolean = false) => {
    const isExpanded = expandedCategories.has(category.id);
    const childrenCount = getChildrenCount(category.id);
    const hasChildren = childrenCount > 0;
    const isMenuOpen = openMenuId === category.id;

    return (
      <div key={category.id} className={isChild ? 'ml-8' : ''}>
        <div className="relative bg-white">
          {/* Category Row */}
          <div
            className="relative bg-white cursor-pointer"
            onClick={() => {
              if (hasChildren && !isChild) {
                toggleExpand(category.id);
              }
            }}
          >
            <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
              {/* Expand/Collapse Icon for Parents */}
              {hasChildren && !isChild && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(category.id);
                  }}
                  className="flex-shrink-0"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              )}

              {/* Placeholder for alignment when no children */}
              {!hasChildren && !isChild && (
                <div className="w-5 flex-shrink-0" />
              )}

              {/* Category Icon */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                style={{
                  backgroundColor: category.color,
                }}
              >
                {category.icon}
              </div>

              {/* Category Name */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{category.name}</p>
              </div>

              {/* Action Buttons - Show when menu is open */}
              {isMenuOpen && (
                <div className="flex items-center gap-2 flex-shrink-0 animate-in fade-in slide-in-from-right-2 duration-200 relative z-20">
                  {/* Edit Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(category);
                    }}
                    className="w-9 h-9 rounded-full flex items-center justify-center bg-[#008080]/10 hover:bg-[#008080]/20 transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-[#008080]" />
                  </button>

                  {/* Move Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveClick(category);
                    }}
                    className="w-9 h-9 rounded-full flex items-center justify-center bg-[#4DB6AC]/10 hover:bg-[#4DB6AC]/20 transition-colors"
                  >
                    <Move className="w-4 h-4 text-[#4DB6AC]" />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(category);
                    }}
                    className="w-9 h-9 rounded-full flex items-center justify-center bg-[#EF4444]/10 hover:bg-[#EF4444]/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-[#EF4444]" />
                  </button>
                </div>
              )}

              {/* Three Dot Menu Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId(isMenuOpen ? null : category.id);
                }}
                className={`flex-shrink-0 relative z-20 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isMenuOpen ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
              >
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Backdrop to close menu - placed outside the flex container */}
          {isMenuOpen && (
            <div 
              className="fixed inset-0 z-10" 
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenuId(null);
              }} 
            />
          )}
        </div>

        {/* Child Categories */}
        {hasChildren && isExpanded && (
          <div className="bg-gray-50">
            {getChildCategories(category.id).map((child) => renderCategory(child, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={layout.page}>
      {/* Header */}
      <div className={layout.header}>
        <div className={layout.headerContent}>
          <div className="py-6">
            <h1 className={layout.headerTitle}>{t('category_management_title')}</h1>
            <p className="text-gray-500 text-sm mt-1">{t('category_management_subtitle')}</p>
          </div>
        </div>
      </div>

      <div className={layout.pageContent}>
        {/* Type Segmented Control */}
        <div className="bg-white rounded-xl p-1 shadow-sm mb-6">
          <div className="flex">
            {(['expense', 'income'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  activeType === type
                    ? 'bg-gradient-to-r from-[var(--theme-color)] to-[#4DB6AC] text-white shadow-md'
                    : 'text-gray-600'
                }`}
              >
                {type === 'expense' ? t('category_management_expense') : t('category_management_income')}
              </button>
            ))}
          </div>
        </div>

        {/* Categories List */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-24">
          {parentCategories.length > 0 ? (
            parentCategories.map((category) => renderCategory(category))
          ) : (
            <div className="p-8 text-center text-gray-400">
              {t('category_management_no_categories')}
            </div>
          )}
        </div>

        {/* Create Button */}
        <div className="mt-6 mb-6">
          <button
            className="w-full py-4 text-white rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 hover:shadow-xl transition-shadow"
            style={{
              background: `linear-gradient(to right, var(--theme-color), ${adjustColorBrightness(getComputedStyle(document.documentElement).getPropertyValue('--theme-color').trim(), 30)})`
            }}
            onClick={handleCreateClick}
          >
            <Plus className="w-5 h-5" />
            {t('category_management_create_button')}
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && deleteConfirm.category && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-14 h-14 bg-[#EF4444]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-[#EF4444]" />
            </div>

            <h2 className="text-center mb-2">{t('category_management_delete_title')}</h2>

            <p className="text-center text-gray-600 mb-6">
              {t('category_management_delete_message_part1')} "<strong>{deleteConfirm.category.name}</strong>"
              {deleteConfirm.category.parentId === null &&
                getChildrenCount(deleteConfirm.category.id) > 0 && (
                  <span>
                    {' '}
                    {t('category_management_delete_subcategories')} <strong>{getChildrenCount(deleteConfirm.category.id)}</strong>{' '}
                    {t('category_management_delete_subcategories_label')}
                  </span>
                )}
              , {t('category_management_delete_message_part2')} <strong>{getTotalRecords(deleteConfirm.category)}</strong> {t('category_management_delete_records')}.
            </p>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={handleCancelDelete}
                className="flex-1 border-2 border-gray-300"
              >
                {t('category_management_cancel_button')}
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmDelete}
                className="flex-1 bg-[#EF4444] hover:bg-[#DC2626]"
              >
                {t('category_management_delete_button')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Panel */}
      {editPanel.show && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 flex-shrink-0">
              <h2>
                {editPanel.mode === 'edit' ? t('category_management_edit_title') : t('category_management_create_title')}
              </h2>
              <button
                onClick={handleCloseEditPanel}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
              {/* Preview */}
              <div className="mb-6 flex justify-center">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-lg"
                  style={{ backgroundColor: editForm.color }}
                >
                  {editForm.icon}
                </div>
              </div>

              {/* Name Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('category_management_name_label')}</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 64) {
                      setEditForm((prev) => ({
                        ...prev,
                        name: value,
                      }));
                    }
                  }}
                  placeholder={t('category_management_name_placeholder')}
                  maxLength={64}
                  autoComplete="off"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1">{editForm.name.length}/64 {t('category_management_characters')}</p>
              </div>

              {/* Icon Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('category_management_icon_label')}</label>
                <div className="relative">
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-left flex items-center gap-3 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-2xl">{editForm.icon}</span>
                    <span className="text-gray-600">{t('category_management_icon_change')}</span>
                  </button>
                  {showEmojiPicker && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowEmojiPicker(false)}
                      />
                      <div className="absolute top-full mt-2 left-0 z-20">
                        <EmojiPicker
                          onEmojiClick={handleEmojiSelect}
                          searchPlaceHolder="Search emoji..."
                          previewConfig={{ showPreview: false }}
                          width={320}
                          height={400}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Color Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('category_management_color_label')}</label>
                <div className="grid grid-cols-4 gap-3 justify-items-center">
                  {APP_COLOR_PALETTE.map((color) => (
                    <button
                      key={color}
                      onClick={() =>
                        setEditForm((prev) => ({
                          ...prev,
                          color,
                        }))
                      }
                      className={`w-12 h-12 rounded-full transition-all ${
                        editForm.color === color
                          ? 'ring-4 ring-[#008080] ring-offset-2 scale-110'
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Parent Category Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('category_management_parent_label')}
                </label>
                <select
                  value={editForm.parentId || ''}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      parentId: e.target.value || null,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent bg-white"
                >
                  <option value="">{t('category_management_parent_none')}</option>
                  {parentCategories
                    .filter((cat) => editPanel.category?.id !== cat.id)
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  {t('category_management_parent_hint')}
                </p>
              </div>
            </div>

            {/* Fixed Bottom Actions */}
            <div className="px-4 py-4 border-t border-gray-200 bg-white flex-shrink-0">
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={handleCloseEditPanel}
                  className="flex-1 border-2 border-gray-300"
                >
                  {t('category_management_cancel_button')}
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSaveCategory}
                  disabled={!editForm.name.trim()}
                  className="flex-1 bg-gradient-to-r from-[#008080] to-[#4DB6AC] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editPanel.mode === 'edit' ? t('category_management_save_button') : t('category_management_create_save_button')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Move Category Modal */}
      {movePanel.show && movePanel.category && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-gray-900">{t('category_management_move_title')}</h2>
              <button
                onClick={() => setMovePanel({ show: false, category: null })}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Current Category Display */}
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">{t('category_management_moving_label')}:</p>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                  style={{
                    backgroundColor: `${movePanel.category.color}20`,
                  }}
                >
                  {movePanel.category.icon}
                </div>
                <p className="font-medium text-gray-900">{movePanel.category.name}</p>
              </div>
            </div>

            {/* Move Options */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">{t('category_management_move_to_label')}:</p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {/* Option: Make it a main category */}
                <button
                  onClick={() => {
                    const systemConfig = SystemConfigService.get();
                    const userId = systemConfig.defaultUserId;

                    if (!userId || !movePanel.category) return;

                    CategoryService.update(
                      movePanel.category.id,
                      { parentId: null },
                      userId
                    );

                    const userCategories = CategoryService.getByUserId(userId);
                    setCategories(userCategories.filter(cat => cat.type === activeType));
                    setMovePanel({ show: false, category: null });

                    // Trigger refresh in parent components
                    if (onCategoryChange) onCategoryChange();
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                    movePanel.category.parentId === null
                      ? 'bg-[#008080]/10 border-2 border-[#008080]'
                      : 'bg-white border-2 border-gray-200 hover:border-[#008080]/50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#008080] to-[#4DB6AC] flex items-center justify-center text-white">
                    ⭐
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">{t('category_management_main_category')}</p>
                    <p className="text-xs text-gray-500">{t('category_management_main_category_hint')}</p>
                  </div>
                </button>

                {/* Options: Move under parent categories */}
                {parentCategories
                  .filter((cat) => cat.id !== movePanel.category?.id)
                  .map((parent) => (
                    <button
                      key={parent.id}
                      onClick={() => {
                        const systemConfig = SystemConfigService.get();
                        const userId = systemConfig.defaultUserId;

                        if (!userId || !movePanel.category) return;

                        CategoryService.update(
                          movePanel.category.id,
                          { parentId: parent.id },
                          userId
                        );

                        const userCategories = CategoryService.getByUserId(userId);
                        setCategories(userCategories.filter(cat => cat.type === activeType));
                        setMovePanel({ show: false, category: null });
                        
                        // Trigger refresh in parent components
                        if (onCategoryChange) onCategoryChange();
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                        movePanel.category.parentId === parent.id
                          ? 'bg-[#008080]/10 border-2 border-[#008080]'
                          : 'bg-white border-2 border-gray-200 hover:border-[#008080]/50'
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                        style={{
                          backgroundColor: `${parent.color}20`,
                        }}
                      >
                        {parent.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-900">{parent.name}</p>
                        <p className="text-xs text-gray-500">
                          {getChildrenCount(parent.id)} {t('category_management_subcategories_label')}
                        </p>
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            {/* Cancel Button */}
            <Button
              variant="ghost"
              onClick={() => setMovePanel({ show: false, category: null })}
              className="w-full border-2 border-gray-300"
            >
              {t('category_management_cancel_button')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to adjust color brightness
function adjustColorBrightness(color: string, percent: number) {
  const num = parseInt(color.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return `#${(
    0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)
  ).toString(16).slice(1)}`;
}