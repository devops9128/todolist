import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import { PlusIcon, SearchIcon, TagIcon, BookOpenIcon, EditIcon, TrashIcon } from 'lucide-react'
import { KnowledgePoint } from '../lib/supabase'

const Knowledge: React.FC = () => {
  const { knowledgePoints, addKnowledgePoint, updateKnowledgePoint, deleteKnowledgePoint, loading } = useStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingPoint, setEditingPoint] = useState<KnowledgePoint | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  
  const [newPoint, setNewPoint] = useState({
    title: '',
    content: '',
    tags: [] as string[],
    source: ''
  })
  
  // 获取所有标签
  const allTags = Array.from(new Set(knowledgePoints.flatMap(point => point.tags || [])))
  
  // 筛选知识点
  const filteredPoints = knowledgePoints.filter(point => {
    const matchesSearch = point.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         point.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => point.tags?.includes(tag))
    return matchesSearch && matchesTags
  })
  
  const handleAddPoint = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPoint.title.trim() || !newPoint.content.trim()) return
    
    await addKnowledgePoint({
      ...newPoint,
      category: 'general',
      difficulty: 'beginner',
      source: newPoint.source || undefined
    })
    
    setNewPoint({
      title: '',
      content: '',
      tags: [],
      source: ''
    })
    setShowAddForm(false)
  }
  
  const handleUpdatePoint = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPoint || !editingPoint.title.trim() || !editingPoint.content.trim()) return
    
    await updateKnowledgePoint(editingPoint.id, {
      title: editingPoint.title,
      content: editingPoint.content,
      tags: editingPoint.tags,
      source: editingPoint.source || undefined
    })
    
    setEditingPoint(null)
  }
  
  const handleTagInput = (value: string, isEditing = false) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    if (isEditing && editingPoint) {
      setEditingPoint({ ...editingPoint, tags })
    } else {
      setNewPoint({ ...newPoint, tags })
    }
  }
  
  const toggleTagFilter = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }
  
  return (
    <div className="px-6 py-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">知识库</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>添加知识点</span>
          </button>
        </div>
        
        {/* 搜索 */}
        <div className="mb-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索知识点..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        {/* 标签筛选 */}
        {allTags.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">标签筛选</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTagFilter(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200"
                >
                  清除筛选
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* 添加知识点表单 */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">添加知识点</h2>
            <form onSubmit={handleAddPoint} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  标题
                </label>
                <input
                  type="text"
                  required
                  value={newPoint.title}
                  onChange={(e) => setNewPoint({ ...newPoint, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="输入知识点标题"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  内容
                </label>
                <textarea
                  required
                  value={newPoint.content}
                  onChange={(e) => setNewPoint({ ...newPoint, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={6}
                  placeholder="输入知识点内容"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  标签（用逗号分隔）
                </label>
                <input
                  type="text"
                  value={newPoint.tags.join(', ')}
                  onChange={(e) => handleTagInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="例如：JavaScript, React, 前端"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  来源
                </label>
                <input
                  type="text"
                  value={newPoint.source}
                  onChange={(e) => setNewPoint({ ...newPoint, source: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="例如：《JavaScript高级程序设计》、MDN文档等"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  添加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* 编辑知识点表单 */}
      {editingPoint && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">编辑知识点</h2>
            <form onSubmit={handleUpdatePoint} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  标题
                </label>
                <input
                  type="text"
                  required
                  value={editingPoint.title}
                  onChange={(e) => setEditingPoint({ ...editingPoint, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  内容
                </label>
                <textarea
                  required
                  value={editingPoint.content}
                  onChange={(e) => setEditingPoint({ ...editingPoint, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={6}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  标签（用逗号分隔）
                </label>
                <input
                  type="text"
                  value={editingPoint.tags?.join(', ') || ''}
                  onChange={(e) => handleTagInput(e.target.value, true)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  来源
                </label>
                <input
                  type="text"
                  value={editingPoint.source || ''}
                  onChange={(e) => setEditingPoint({ ...editingPoint, source: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingPoint(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* 知识点列表 */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">加载中...</p>
          </div>
        ) : filteredPoints.length === 0 ? (
          <div className="text-center py-8">
            <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">暂无知识点</p>
          </div>
        ) : (
          filteredPoints.map((point) => (
            <div key={point.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{point.title}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingPoint(point)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <EditIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteKnowledgePoint(point.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="prose max-w-none mb-4">
                <p className="text-gray-700 whitespace-pre-wrap">{point.content}</p>
              </div>
              
              {point.tags && point.tags.length > 0 && (
                <div className="flex items-center space-x-2 mb-3">
                  <TagIcon className="h-4 w-4 text-gray-400" />
                  <div className="flex flex-wrap gap-1">
                    {point.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div>
                  {point.source && (
                    <span>来源：{point.source}</span>
                  )}
                </div>
                <div>
                  创建时间：{new Date(point.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Knowledge