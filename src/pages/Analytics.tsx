import React, { useMemo } from 'react'
import { useStore } from '../store/useStore'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { CalendarIcon, ClockIcon, TrendingUpIcon, TargetIcon, BookOpenIcon, FolderIcon } from 'lucide-react'

const Analytics: React.FC = () => {
  const { tasks, knowledgePoints, projects, studySessions, loading } = useStore()
  
  // 计算统计数据
  const stats = useMemo(() => {
    const totalTasks = tasks.length
    const completedTasks = tasks.filter(t => t.status === 'completed').length
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length
    const pendingTasks = tasks.filter(t => t.status === 'pending').length
    
    const totalProjects = projects.length
    const completedProjects = projects.filter(p => p.status === 'completed').length
    const activeProjects = projects.filter(p => p.status === 'in_progress').length
    
    const totalKnowledgePoints = knowledgePoints.length
    const totalStudyTime = studySessions.reduce((total, session) => total + (session.duration || 0), 0)
    
    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    const projectCompletionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0
    
    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      totalProjects,
      completedProjects,
      activeProjects,
      totalKnowledgePoints,
      totalStudyTime,
      taskCompletionRate,
      projectCompletionRate
    }
  }, [tasks, projects, knowledgePoints, studySessions])
  
  // 任务状态分布数据
  const taskStatusData = [
    { name: '已完成', value: stats.completedTasks, color: '#10B981' },
    { name: '进行中', value: stats.inProgressTasks, color: '#3B82F6' },
    { name: '待开始', value: stats.pendingTasks, color: '#6B7280' }
  ].filter(item => item.value > 0)
  
  // 任务分类分布数据
  const taskCategoryData = useMemo(() => {
    const categories = tasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return Object.entries(categories).map(([category, count]) => ({
      name: category === 'learning' ? '学习任务' : 
            category === 'project' ? '项目任务' : '知识整理',
      value: count,
      color: category === 'learning' ? '#3B82F6' : 
             category === 'project' ? '#8B5CF6' : '#06B6D4'
    }))
  }, [tasks])
  
  // 每日学习时间数据（最近7天）
  const dailyStudyData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date.toISOString().split('T')[0]
    })
    
    return last7Days.map(date => {
      const dayStudyTime = studySessions
        .filter(session => session.created_at.split('T')[0] === date)
        .reduce((total, session) => total + (session.duration || 0), 0)
      
      return {
        date: new Date(date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
        time: Math.round(dayStudyTime / 60) // 转换为分钟
      }
    })
  }, [studySessions])
  
  // 月度任务完成趋势（最近6个月）
  const monthlyTaskData = useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - (5 - i))
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        name: date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short' })
      }
    })
    
    return last6Months.map(({ year, month, name }) => {
      const monthTasks = tasks.filter(task => {
        const taskDate = new Date(task.created_at)
        return taskDate.getFullYear() === year && taskDate.getMonth() + 1 === month
      })
      
      const completed = monthTasks.filter(t => t.status === 'completed').length
      
      return {
        month: name,
        completed,
        total: monthTasks.length
      }
    })
  }, [tasks])
  
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}小时${mins}分钟`
    }
    return `${mins}分钟`
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
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">统计分析</h1>
        <p className="text-gray-600">查看您的学习进度和数据统计</p>
      </div>
      
      {/* 概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总任务数</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTasks}</p>
              <p className="text-sm text-green-600">完成率 {stats.taskCompletionRate}%</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <TargetIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">项目数量</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
              <p className="text-sm text-green-600">完成率 {stats.projectCompletionRate}%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FolderIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">知识点</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalKnowledgePoints}</p>
              <p className="text-sm text-gray-500">累计收集</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <BookOpenIcon className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">学习时长</p>
              <p className="text-2xl font-bold text-gray-900">{formatTime(stats.totalStudyTime)}</p>
              <p className="text-sm text-gray-500">累计时间</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <ClockIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 任务状态分布 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">任务状态分布</h3>
          {taskStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              暂无数据
            </div>
          )}
        </div>
        
        {/* 任务分类分布 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">任务分类分布</h3>
          {taskCategoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taskCategoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              暂无数据
            </div>
          )}
        </div>
      </div>
      
      {/* 趋势图表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 每日学习时间 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">每日学习时间（最近7天）</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyStudyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis label={{ value: '分钟', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`${value}分钟`, '学习时间']} />
              <Line type="monotone" dataKey="time" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* 月度任务完成趋势 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">月度任务完成趋势</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyTaskData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" fill="#10B981" name="已完成" />
              <Bar dataKey="total" fill="#E5E7EB" name="总数" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* 详细统计 */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">详细统计</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">任务统计</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">已完成任务：</span>
                <span className="font-medium">{stats.completedTasks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">进行中任务：</span>
                <span className="font-medium">{stats.inProgressTasks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">待开始任务：</span>
                <span className="font-medium">{stats.pendingTasks}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600">完成率：</span>
                <span className="font-medium text-green-600">{stats.taskCompletionRate}%</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">项目统计</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">已完成项目：</span>
                <span className="font-medium">{stats.completedProjects}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">进行中项目：</span>
                <span className="font-medium">{stats.activeProjects}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">总项目数：</span>
                <span className="font-medium">{stats.totalProjects}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600">完成率：</span>
                <span className="font-medium text-green-600">{stats.projectCompletionRate}%</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">学习统计</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">知识点数量：</span>
                <span className="font-medium">{stats.totalKnowledgePoints}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">学习会话：</span>
                <span className="font-medium">{studySessions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">总学习时长：</span>
                <span className="font-medium">{formatTime(stats.totalStudyTime)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600">平均每日：</span>
                <span className="font-medium text-blue-600">
                  {formatTime(Math.round(stats.totalStudyTime / 7))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics