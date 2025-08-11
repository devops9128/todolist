import React, { useState, useMemo } from 'react'
import { useStore } from '../store/useStore'
import { PlusIcon, CalendarIcon, ClockIcon, TrendingUpIcon, CheckCircleIcon, PlayCircleIcon, PauseCircleIcon } from 'lucide-react'
import { format, isToday, isTomorrow, isThisWeek } from 'date-fns'
import { zhCN } from 'date-fns/locale'

const Home: React.FC = () => {
  const { 
    tasks, 
    knowledgePoints, 
    projects, 
    studySessions, 
    addTask, 
    addKnowledgePoint, 
    addProject,
    loading 
  } = useStore()
  
  const [quickAddType, setQuickAddType] = useState<'task' | 'knowledge' | 'project'>('task')
  const [quickAddTitle, setQuickAddTitle] = useState('')
  const [quickAddDescription, setQuickAddDescription] = useState('')
  const [isQuickAdding, setIsQuickAdding] = useState(false)
  
  // 计算统计数据
  const stats = useMemo(() => {
    const totalTasks = tasks.length
    const completedTasks = tasks.filter(t => t.status === 'completed').length
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length
    const pendingTasks = tasks.filter(t => t.status === 'pending').length
    
    const todayTasks = tasks.filter(task => {
      if (!task.due_date) return false
      return isToday(new Date(task.due_date))
    })
    

    
    const activeProjects = projects.filter(p => p.status === 'in_progress').length
    const completedProjects = projects.filter(p => p.status === 'completed').length
    
    const recentKnowledge = knowledgePoints.slice(0, 5)
    
    const todayStudyTime = studySessions
      .filter(session => isToday(new Date(session.created_at)))
      .reduce((total, session) => total + (session.duration || 0), 0)
    
    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    
    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      todayTasks,

      activeProjects,
      completedProjects,
      recentKnowledge,
      todayStudyTime,
      taskCompletionRate
    }
  }, [tasks, projects, knowledgePoints, studySessions])
  
  const handleQuickAdd = async () => {
    if (!quickAddTitle.trim()) return
    
    setIsQuickAdding(true)
    try {
      switch (quickAddType) {
        case 'task':
          await addTask({
            title: quickAddTitle,
            description: quickAddDescription,
            status: 'pending',
            priority: 'medium',
            category: 'learning'
          })
          break
        case 'knowledge':
          await addKnowledgePoint({
          title: quickAddTitle,
          content: quickAddDescription,
          category: 'general',
          difficulty: 'beginner',
          tags: [],
          source: ''
        })
          break
        case 'project':
          await addProject({
            name: quickAddTitle,
            description: quickAddDescription,
            status: 'in_progress',
            progress: 0,
            start_date: new Date().toISOString().split('T')[0],
            end_date: ''
          })
          break
      }
      setQuickAddTitle('')
      setQuickAddDescription('')
    } catch (error) {
      console.error('快速添加失败:', error)
    } finally {
      setIsQuickAdding(false)
    }
  }
  
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}小时${mins}分钟`
    }
    return `${mins}分钟`
  }
  
  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />
      case 'in_progress':
        return <PlayCircleIcon className="h-4 w-4 text-blue-500" />
      default:
        return <PauseCircleIcon className="h-4 w-4 text-gray-400" />
    }
  }
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50'
      case 'low':
        return 'text-green-600 bg-green-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }
  
  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">加载中...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="px-6 pt-4 pb-6">
      {/* 欢迎区域 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">欢迎回来！</h1>
        <p className="text-gray-600 mt-2">
          今天是 {format(new Date(), 'yyyy年MM月dd日 EEEE', { locale: zhCN })}
        </p>
      </div>
      
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">今日任务</p>
              <p className="text-2xl font-bold text-gray-900">{stats.todayTasks.length}</p>
              <p className="text-sm text-blue-600">需要完成</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <CalendarIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">任务完成率</p>
              <p className="text-2xl font-bold text-gray-900">{stats.taskCompletionRate}%</p>
              <p className="text-sm text-green-600">{stats.completedTasks}/{stats.totalTasks} 已完成</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUpIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">活跃项目</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeProjects}</p>
              <p className="text-sm text-purple-600">进行中</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUpIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">今日学习</p>
              <p className="text-2xl font-bold text-gray-900">{formatTime(stats.todayStudyTime)}</p>
              <p className="text-sm text-indigo-600">累计时间</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <ClockIcon className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 今日任务 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col min-h-[500px]">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">今日任务</h3>
          {stats.todayTasks.length > 0 ? (
            <div className="space-y-3 flex-1">
              {stats.todayTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  {getTaskStatusIcon(task.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        getPriorityColor(task.priority)
                      }`}>
                        {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                      </span>
                      {task.due_date && (
                        <span className="text-xs text-gray-500">
                          {isToday(new Date(task.due_date)) ? '今天' : 
                           isTomorrow(new Date(task.due_date)) ? '明天' :
                           format(new Date(task.due_date), 'MM/dd')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {stats.todayTasks.length > 5 && (
                <p className="text-sm text-gray-500 text-center">
                  还有 {stats.todayTasks.length - 5} 个任务...
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-8 flex-1 flex flex-col justify-center">
              <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">今天没有安排任务</p>
              <p className="text-sm text-gray-400">享受轻松的一天吧！</p>
            </div>
          )}
        </div>
        
        {/* 快速添加 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col min-h-[500px]">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">快速添加</h3>
          
          {/* 类型选择 */}
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setQuickAddType('task')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                quickAddType === 'task'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              任务
            </button>
            <button
              onClick={() => setQuickAddType('knowledge')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                quickAddType === 'knowledge'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              知识点
            </button>
            <button
              onClick={() => setQuickAddType('project')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                quickAddType === 'project'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              项目
            </button>
          </div>
          
          {/* 输入表单 */}
          <div className="space-y-3 flex-1">
            <input
              type="text"
              placeholder={`${quickAddType === 'task' ? '任务' : quickAddType === 'knowledge' ? '知识点' : '项目'}标题`}
              value={quickAddTitle}
              onChange={(e) => setQuickAddTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <textarea
              placeholder="描述（可选）"
              value={quickAddDescription}
              onChange={(e) => setQuickAddDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <button
              onClick={handleQuickAdd}
              disabled={!quickAddTitle.trim() || isQuickAdding}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isQuickAdding ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  添加{quickAddType === 'task' ? '任务' : quickAddType === 'knowledge' ? '知识点' : '项目'}
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* 最近知识点 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col min-h-[500px]">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">最近知识点</h3>
          {stats.recentKnowledge.length > 0 ? (
            <div className="space-y-3 flex-1">
              {stats.recentKnowledge.map((knowledge) => (
                <div key={knowledge.id} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 mb-1">{knowledge.title}</p>
                  <p className="text-xs text-gray-600 line-clamp-2">{knowledge.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex flex-wrap gap-1">
                      {knowledge.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {tag}
                        </span>
                      ))}
                      {knowledge.tags.length > 2 && (
                        <span className="text-xs text-gray-500">+{knowledge.tags.length - 2}</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {format(new Date(knowledge.created_at), 'MM/dd')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 flex-1 flex flex-col justify-center">
              <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-gray-400 text-xl">📚</span>
              </div>
              <p className="text-gray-500">还没有知识点</p>
              <p className="text-sm text-gray-400">开始记录学习内容吧！</p>
            </div>
          )}
        </div>
      </div>
      

    </div>
  )
}

export default Home