import React, { useState, useMemo } from 'react'
import { useStore } from '../store/useStore'
import { PlusIcon, FilterIcon, SearchIcon, CheckIcon, ClockIcon, AlertCircleIcon, CalendarIcon, UserIcon, BarChart3Icon, TagIcon, TrendingUpIcon, TimerIcon, TableIcon, TrashIcon, EditIcon } from 'lucide-react'
import { Task } from '../lib/supabase'
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams } from '@mui/x-data-grid'
import { Box, Chip, LinearProgress, IconButton, Tooltip } from '@mui/material'

const Tasks: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, loading } = useStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all')
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'learning' | 'project' | 'knowledge'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'table'>('table')
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'learning' as const,
    priority: 'medium' as const,
    due_date: '',
    difficulty: undefined as Task['difficulty'],
    estimated_time: undefined as number | undefined,
    assignee: undefined as string | undefined,
    progress: undefined as number | undefined,
    tags: [] as string[]
  })

  const [editTask, setEditTask] = useState({
    title: '',
    description: '',
    category: 'learning' as Task['category'],
    priority: 'medium' as Task['priority'],
    due_date: '',
    difficulty: undefined as Task['difficulty'],
    estimated_time: undefined as number | undefined,
    assignee: undefined as string | undefined,
    progress: undefined as number | undefined,
    tags: [] as string[],
    actual_time: undefined as number | undefined
  })
  
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filter === 'all' || task.status === filter
    const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesCategory && matchesSearch
  })


  
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.title.trim()) return
    
    await addTask({
      ...newTask,
      status: 'pending',
      due_date: newTask.due_date || undefined
    })
    
    setNewTask({
      title: '',
      description: '',
      category: 'learning',
      priority: 'medium',
      due_date: '',
      difficulty: undefined,
      estimated_time: undefined,
      assignee: undefined,
      progress: undefined,
      tags: []
    })
    setShowAddForm(false)
  }
  
  const handleStatusChange = async (taskId: string, status: Task['status']) => {
    await updateTask(taskId, { status })
  }
  
  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckIcon className="h-5 w-5 text-green-500" />
      case 'in_progress':
        return <ClockIcon className="h-5 w-5 text-blue-500" />
      default:
        return <AlertCircleIcon className="h-5 w-5 text-gray-400" />
    }
  }
  
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  const getCategoryColor = (category: Task['category']) => {
    switch (category) {
      case 'learning':
        return 'bg-blue-100 text-blue-800'
      case 'project':
        return 'bg-purple-100 text-purple-800'
      case 'knowledge':
        return 'bg-indigo-100 text-indigo-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyColor = (difficulty?: Task['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'hard':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTime = (minutes?: number) => {
    if (!minutes) return '未设置'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}小时${mins > 0 ? mins + '分钟' : ''}`
    }
    return `${mins}分钟`
  }

  const getTimeStatus = (task: Task) => {
    if (!task.estimated_time) return null
    if (!task.actual_time) return 'pending'
    if (task.actual_time > task.estimated_time) return 'over'
    return 'within'
  }

  // Data Grid 列定义
  const columns: GridColDef[] = useMemo(() => [
    {
      field: 'title',
      headerName: '任务标题',
      width: 200,
      editable: false,
    },
    {
      field: 'description',
      headerName: '描述',
      width: 250,
      editable: false,
      renderCell: (params) => (
        <Tooltip title={params.value || ''}>
          <span className="truncate">{params.value || '无描述'}</span>
        </Tooltip>
      ),
    },
    {
      field: 'category',
      headerName: '分类',
      width: 120,
      editable: false,
      renderCell: (params) => (
        <Chip
          label={params.value === 'learning' ? '学习' : 
                 params.value === 'project' ? '项目' : '知识'}
          size="small"
          className={getCategoryColor(params.value)}
        />
      ),
    },
    {
      field: 'priority',
      headerName: '优先级',
      width: 100,
      editable: false,
      renderCell: (params) => (
        <Chip
          label={params.value === 'high' ? '高' : 
                 params.value === 'medium' ? '中' : '低'}
          size="small"
          className={getPriorityColor(params.value)}
        />
      ),
    },
    {
      field: 'status',
      headerName: '状态',
      width: 120,
      editable: true,
      type: 'singleSelect',
      valueOptions: [
        { value: 'pending', label: '待开始' },
        { value: 'in_progress', label: '进行中' },
        { value: 'completed', label: '已完成' },
      ],
      renderCell: (params) => (
        <Chip
          label={params.value === 'pending' ? '待开始' : 
                 params.value === 'in_progress' ? '进行中' : '已完成'}
          size="small"
          color={params.value === 'completed' ? 'success' : 
                 params.value === 'in_progress' ? 'primary' : 'default'}
        />
      ),
    },
    {
      field: 'difficulty',
      headerName: '难度',
      width: 100,
      editable: false,
      renderCell: (params) => params.value ? (
        <Chip
          label={params.value === 'easy' ? '简单' : 
                 params.value === 'medium' ? '中等' : '困难'}
          size="small"
          className={getDifficultyColor(params.value)}
        />
      ) : <span className="text-gray-400">未设置</span>,
    },
    {
      field: 'progress',
      headerName: '进度',
      width: 120,
      editable: false,
      renderCell: (params) => params.value !== undefined ? (
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress variant="determinate" value={params.value} />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <span className="text-xs">{params.value}%</span>
          </Box>
        </Box>
      ) : <span className="text-gray-400">未设置</span>,
    },
    {
      field: 'estimated_time',
      headerName: '预估时间',
      width: 120,
      editable: false,
      renderCell: (params) => (
        <span className="text-sm">{formatTime(params.value)}</span>
      ),
    },
    {
      field: 'actual_time',
      headerName: '实际时间',
      width: 120,
      editable: false,
      renderCell: (params) => (
        <span className="text-sm">{formatTime(params.value)}</span>
      ),
    },
    {
      field: 'assignee',
      headerName: '负责人',
      width: 120,
      editable: false,
      renderCell: (params) => (
        <span className="text-sm">{params.value || '未分配'}</span>
      ),
    },
    {
      field: 'due_date',
      headerName: '截止日期',
      width: 120,
      editable: false,
      renderCell: (params) => params.value ? (
        <span className="text-sm">
          {new Date(params.value).toLocaleDateString()}
        </span>
      ) : <span className="text-gray-400">无</span>,
    },
    {
      field: 'created_at',
      headerName: '创建时间',
      width: 120,
      editable: false,
      renderCell: (params) => (
        <span className="text-sm">
          {new Date(params.value).toLocaleDateString()}
        </span>
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: '操作',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }: GridRowParams) => [
        <GridActionsCellItem
          icon={<EditIcon className="h-4 w-4" />}
          label="编辑"
          onClick={() => {
            const task = filteredTasks.find(t => t.id === id)
            if (task) {
              handleEditTask(task)
            }
          }}
        />,
        <GridActionsCellItem
          icon={<TrashIcon className="h-4 w-4" />}
          label="删除"
          onClick={() => deleteTask(id as string)}
        />,
      ],
    },
  ], [deleteTask])

  // 处理 Data Grid 中的行更新
  const processRowUpdate = async (newRow: Task) => {
    await updateTask(newRow.id, newRow)
    return newRow
  }

  // 处理编辑任务
  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setEditTask({
      title: task.title,
      description: task.description || '',
      category: task.category,
      priority: task.priority,
      due_date: task.due_date || '',
      difficulty: task.difficulty,
      estimated_time: task.estimated_time,
      assignee: task.assignee,
      progress: task.progress,
      tags: task.tags || [],
      actual_time: task.actual_time
    })
    setShowEditForm(true)
  }

  // 提交编辑任务
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTask || !editTask.title.trim()) return
    
    await updateTask(editingTask.id, {
      ...editTask,
      due_date: editTask.due_date || undefined
    })
    
    setShowEditForm(false)
    setEditingTask(null)
    setEditTask({
      title: '',
      description: '',
      category: 'learning' as Task['category'],
      priority: 'medium' as Task['priority'],
      due_date: '',
      difficulty: undefined,
      estimated_time: undefined,
      assignee: undefined,
      progress: undefined,
      tags: [],
      actual_time: undefined
    })
  }

  // 任务卡片组件
  const TaskCard: React.FC<{ task: Task }> = ({ task }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-900 flex-1">{task.title}</h3>
      </div>
      
      {task.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}
      
      {/* 标签区域 */}
      <div className="flex flex-wrap gap-1 mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
          {task.category === 'learning' ? '学习' : 
           task.category === 'project' ? '项目' : '知识'}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
          {task.priority === 'high' ? '高' : 
           task.priority === 'medium' ? '中' : '低'}
        </span>
        {task.difficulty && (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(task.difficulty)}`}>
            {task.difficulty === 'easy' ? '简单' : 
             task.difficulty === 'medium' ? '中等' : '困难'}
          </span>
        )}
      </div>

      {/* 详细信息区域 */}
      <div className="space-y-2 mb-3">
        {/* 截止日期 */}
        {task.due_date && (
          <div className="flex items-center text-xs text-gray-500">
            <CalendarIcon className="h-3 w-3 mr-1" />
            <span>截止: {new Date(task.due_date).toLocaleDateString()}</span>
          </div>
        )}

        {/* 时间信息 */}
        {(task.estimated_time || task.actual_time) && (
          <div className="flex items-center text-xs text-gray-500">
            <TimerIcon className="h-3 w-3 mr-1" />
            <span>
              预估: {formatTime(task.estimated_time)}
              {task.actual_time && (
                <span className={`ml-2 ${getTimeStatus(task) === 'over' ? 'text-red-600' : 'text-green-600'}`}>
                  实际: {formatTime(task.actual_time)}
                </span>
              )}
            </span>
          </div>
        )}

        {/* 进度条 */}
        {task.progress !== undefined && (
          <div className="flex items-center text-xs text-gray-500">
            <BarChart3Icon className="h-3 w-3 mr-1" />
            <div className="flex-1 ml-1">
              <div className="flex items-center justify-between mb-1">
                <span>进度</span>
                <span>{task.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                  style={{ width: `${task.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* 负责人 */}
        {task.assignee && (
          <div className="flex items-center text-xs text-gray-500">
            <UserIcon className="h-3 w-3 mr-1" />
            <span>负责人: {task.assignee}</span>
          </div>
        )}

        {/* 标签 */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex items-center text-xs text-gray-500">
            <TagIcon className="h-3 w-3 mr-1" />
            <div className="flex flex-wrap gap-1">
              {task.tags.map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-600 px-1 py-0.5 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 创建时间 */}
        <div className="flex items-center text-xs text-gray-400">
          <ClockIcon className="h-3 w-3 mr-1" />
          <span>创建于: {new Date(task.created_at).toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-100">
        <select
          value={task.status}
          onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
          className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="pending">待开始</option>
          <option value="in_progress">进行中</option>
          <option value="completed">已完成</option>
        </select>
        
        <button
          onClick={() => deleteTask(task.id)}
          className="text-xs text-red-600 hover:text-red-800"
        >
          删除
        </button>
      </div>
    </div>
  )
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <TableIcon className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  任务管理
                </h1>
              </div>
              
              {/* 视图切换按钮 */}
              <div className="flex bg-white/70 backdrop-blur-sm rounded-xl p-1 shadow-sm border border-white/20">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 text-sm font-medium transition-all duration-200 ${
                    viewMode === 'table' 
                      ? 'bg-white text-gray-900 shadow-md shadow-blue-100 border border-blue-100' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <TableIcon className="h-4 w-4" />
                  <span>表格视图</span>
                </button>
              </div>
            </div>
            
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 flex items-center space-x-2 shadow-lg shadow-blue-200 transition-all duration-200 transform hover:scale-105"
            >
              <PlusIcon className="h-5 w-5" />
              <span>添加任务</span>
            </button>
          </div>
        
          {/* 搜索和筛选 */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索任务标题或描述..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="pl-10 pr-8 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer min-w-[140px]"
                  >
                    <option value="all">所有状态</option>
                    <option value="pending">待开始</option>
                    <option value="in_progress">进行中</option>
                    <option value="completed">已完成</option>
                  </select>
                </div>
                
                <div className="relative">
                  <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value as any)}
                    className="pl-10 pr-8 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer min-w-[140px]"
                  >
                    <option value="all">所有分类</option>
                    <option value="learning">学习任务</option>
                    <option value="project">项目任务</option>
                    <option value="knowledge">知识整理</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 添加任务表单 */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">添加新任务</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddTask} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  任务标题 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-gray-50 focus:bg-white"
                  placeholder="输入任务标题..."
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  任务描述
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-gray-50 focus:bg-white resize-none"
                  rows={4}
                  placeholder="详细描述任务内容..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    分类
                  </label>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="learning">学习任务</option>
                    <option value="project">项目任务</option>
                    <option value="knowledge">知识整理</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    优先级
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">低</option>
                    <option value="medium">中</option>
                    <option value="high">高</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    难度等级
                  </label>
                  <select
                    value={newTask.difficulty || ''}
                    onChange={(e) => setNewTask({ ...newTask, difficulty: e.target.value as Task['difficulty'] || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">未设置</option>
                    <option value="easy">简单</option>
                    <option value="medium">中等</option>
                    <option value="hard">困难</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    截止日期
                  </label>
                  <input
                    type="date"
                    value={newTask.due_date}
                    onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    预估时间（分钟）
                  </label>
                  <input
                    type="number"
                    value={newTask.estimated_time || ''}
                    onChange={(e) => setNewTask({ ...newTask, estimated_time: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="预估完成时间"
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    负责人
                  </label>
                  <input
                    type="text"
                    value={newTask.assignee || ''}
                    onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="输入负责人姓名"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    初始进度 (%)
                  </label>
                  <input
                    type="number"
                    value={newTask.progress || ''}
                    onChange={(e) => setNewTask({ ...newTask, progress: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0-100"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  标签 (用逗号分隔)
                </label>
                <input
                  type="text"
                  value={newTask.tags?.join(', ') || ''}
                  onChange={(e) => setNewTask({ 
                    ...newTask, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="例如: 重要, 紧急, 学习"
                />
              </div>
              
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setNewTask({
                      title: '',
                      description: '',
                      category: 'learning',
                      priority: 'medium',
                      due_date: '',
                      difficulty: undefined,
                      estimated_time: undefined,
                      assignee: undefined,
                      progress: undefined,
                      tags: []
                    })
                  }}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  添加任务
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 编辑任务表单 */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">编辑任务</h2>
              <button
                onClick={() => setShowEditForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  任务标题 *
                </label>
                <input
                  type="text"
                  value={editTask.title}
                  onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  任务描述
                </label>
                <textarea
                  value={editTask.description}
                  onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    分类
                  </label>
                  <select
                    value={editTask.category}
                    onChange={(e) => setEditTask({ ...editTask, category: e.target.value as Task['category'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="learning">学习</option>
                    <option value="project">项目</option>
                    <option value="knowledge">知识</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    优先级
                  </label>
                  <select
                    value={editTask.priority}
                    onChange={(e) => setEditTask({ ...editTask, priority: e.target.value as Task['priority'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">低</option>
                    <option value="medium">中</option>
                    <option value="high">高</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    难度等级
                  </label>
                  <select
                    value={editTask.difficulty || ''}
                    onChange={(e) => setEditTask({ 
                      ...editTask, 
                      difficulty: e.target.value ? e.target.value as Task['difficulty'] : undefined 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">选择难度</option>
                    <option value="easy">简单</option>
                    <option value="medium">中等</option>
                    <option value="hard">困难</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    预估时间 (小时)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={editTask.estimated_time || ''}
                    onChange={(e) => setEditTask({ 
                      ...editTask, 
                      estimated_time: e.target.value ? parseFloat(e.target.value) : undefined 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例如: 2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    负责人
                  </label>
                  <input
                    type="text"
                    value={editTask.assignee || ''}
                    onChange={(e) => setEditTask({ 
                      ...editTask, 
                      assignee: e.target.value || undefined 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="输入负责人姓名"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    截止日期
                  </label>
                  <input
                    type="date"
                    value={editTask.due_date}
                    onChange={(e) => setEditTask({ ...editTask, due_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    初始进度 (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editTask.progress || ''}
                    onChange={(e) => setEditTask({ 
                      ...editTask, 
                      progress: e.target.value ? parseInt(e.target.value) : undefined 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    实际时间 (小时)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={editTask.actual_time || ''}
                    onChange={(e) => setEditTask({ 
                      ...editTask, 
                      actual_time: e.target.value ? parseFloat(e.target.value) : undefined 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例如: 3.0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  标签 (用逗号分隔)
                </label>
                <input
                  type="text"
                  value={editTask.tags?.join(', ') || ''}
                  onChange={(e) => setEditTask({ 
                    ...editTask, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="例如: 重要, 紧急, 学习"
                />
              </div>
              
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false)
                    setEditTask({
                      title: '',
                      description: '',
                      category: 'learning' as Task['category'],
                      priority: 'medium' as Task['priority'],
                      due_date: '',
                      difficulty: undefined,
                      estimated_time: undefined,
                      actual_time: undefined,
                      assignee: undefined,
                      progress: undefined,
                      tags: []
                    })
                  }}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  保存更改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* 任务显示区域 */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">加载中...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">暂无任务</p>
        </div>
      ) : (
        /* 表格视图 */
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={filteredTasks}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10, 25, 50]}
              checkboxSelection
              disableRowSelectionOnClick
              processRowUpdate={processRowUpdate}
              sx={{
                border: 0,
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid #f3f4f6',
                  fontSize: '0.875rem',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#f8fafc',
                  borderBottom: '2px solid #e2e8f0',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#475569',
                },
                '& .MuiDataGrid-columnHeader': {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                },
                '& .MuiDataGrid-row': {
                  '&:hover': {
                    backgroundColor: '#f8fafc',
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#eff6ff',
                    '&:hover': {
                      backgroundColor: '#dbeafe',
                    },
                  },
                },
                '& .MuiDataGrid-footerContainer': {
                  borderTop: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                },
                '& .MuiCheckbox-root': {
                  color: '#6366f1',
                  '&.Mui-checked': {
                    color: '#4f46e5',
                  },
                },
              }}
            />
          </Box>
        </div>
      )}
    </div>
  )
}

export default Tasks