import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import { PlusIcon, FolderIcon, CalendarIcon, TargetIcon, EditIcon, TrashIcon, CheckCircleIcon } from 'lucide-react'
import { Project, Milestone } from '../lib/supabase'

const Projects: React.FC = () => {
  const { projects, milestones, addProject, updateProject, deleteProject, addMilestone, updateMilestone, deleteMilestone, loading } = useStore()
  const [showAddProjectForm, setShowAddProjectForm] = useState(false)
  const [showAddMilestoneForm, setShowAddMilestoneForm] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null)
  
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: ''
  })
  
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    due_date: '',
    project_id: ''
  })
  
  const getProjectProgress = (projectId: string) => {
    const projectMilestones = milestones.filter(m => m.project_id === projectId)
    if (projectMilestones.length === 0) return 0
    const completedMilestones = projectMilestones.filter(m => m.status === 'completed')
    return Math.round((completedMilestones.length / projectMilestones.length) * 100)
  }
  
  const getProjectStatus = (project: Project) => {
    const now = new Date()
    const startDate = new Date(project.start_date)
    const endDate = project.end_date ? new Date(project.end_date) : null
    
    if (project.status === 'completed') return 'completed'
    if (now < startDate) return 'not_started'
    if (endDate && now > endDate) return 'overdue'
    return 'in_progress'
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'not_started':
        return 'bg-gray-100 text-gray-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成'
      case 'in_progress':
        return '进行中'
      case 'not_started':
        return '未开始'
      case 'overdue':
        return '已逾期'
      default:
        return '未知'
    }
  }
  
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProject.name.trim()) return
    
    await addProject({
      ...newProject,
      status: 'in_progress',
      progress: 0,
      end_date: newProject.end_date || undefined
    })
    
    setNewProject({
      name: '',
      description: '',
      start_date: '',
      end_date: ''
    })
    setShowAddProjectForm(false)
  }
  
  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProject || !editingProject.name.trim()) return
    
    await updateProject(editingProject.id, {
      name: editingProject.name,
      description: editingProject.description,
      start_date: editingProject.start_date,
      end_date: editingProject.end_date || undefined,
      status: editingProject.status
    })
    
    setEditingProject(null)
  }
  
  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMilestone.title.trim() || !newMilestone.project_id) return
    
    await addMilestone({
      ...newMilestone,
      status: 'pending',
      due_date: newMilestone.due_date || undefined
    })
    
    setNewMilestone({
      title: '',
      description: '',
      due_date: '',
      project_id: ''
    })
    setShowAddMilestoneForm(false)
  }
  
  const handleUpdateMilestone = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingMilestone || !editingMilestone.title.trim()) return
    
    await updateMilestone(editingMilestone.id, {
      title: editingMilestone.title,
      description: editingMilestone.description,
      due_date: editingMilestone.due_date || undefined,
      status: editingMilestone.status
    })
    
    setEditingMilestone(null)
  }
  
  const toggleMilestoneStatus = async (milestone: Milestone) => {
    const newStatus = milestone.status === 'completed' ? 'pending' : 'completed'
    await updateMilestone(milestone.id, { status: newStatus })
  }
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">项目追踪</h1>
          <button
            onClick={() => setShowAddProjectForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>添加项目</span>
          </button>
        </div>
      </div>
      
      {/* 添加项目表单 */}
      {showAddProjectForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold mb-4">添加新项目</h2>
            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  项目名称
                </label>
                <input
                  type="text"
                  required
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="输入项目名称"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  项目描述
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="输入项目描述（可选）"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    开始日期
                  </label>
                  <input
                    type="date"
                    required
                    value={newProject.start_date}
                    onChange={(e) => setNewProject({ ...newProject, start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    结束日期
                  </label>
                  <input
                    type="date"
                    value={newProject.end_date}
                    onChange={(e) => setNewProject({ ...newProject, end_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddProjectForm(false)}
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
      
      {/* 编辑项目表单 */}
      {editingProject && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold mb-4">编辑项目</h2>
            <form onSubmit={handleUpdateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  项目名称
                </label>
                <input
                  type="text"
                  required
                  value={editingProject.name}
                  onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  项目描述
                </label>
                <textarea
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  项目状态
                </label>
                <select
                  value={editingProject.status}
                  onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as Project['status'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">进行中</option>
                  <option value="completed">已完成</option>
                  <option value="on_hold">暂停</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    开始日期
                  </label>
                  <input
                    type="date"
                    required
                    value={editingProject.start_date}
                    onChange={(e) => setEditingProject({ ...editingProject, start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    结束日期
                  </label>
                  <input
                    type="date"
                    value={editingProject.end_date || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, end_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
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
      
      {/* 添加里程碑表单 */}
      {showAddMilestoneForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold mb-4">添加里程碑</h2>
            <form onSubmit={handleAddMilestone} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  选择项目
                </label>
                <select
                  required
                  value={newMilestone.project_id}
                  onChange={(e) => setNewMilestone({ ...newMilestone, project_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">选择项目</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  里程碑标题
                </label>
                <input
                  type="text"
                  required
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="输入里程碑标题"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  描述
                </label>
                <textarea
                  value={newMilestone.description}
                  onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="输入描述（可选）"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  截止日期
                </label>
                <input
                  type="date"
                  value={newMilestone.due_date}
                  onChange={(e) => setNewMilestone({ ...newMilestone, due_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddMilestoneForm(false)}
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
      
      {/* 编辑里程碑表单 */}
      {editingMilestone && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold mb-4">编辑里程碑</h2>
            <form onSubmit={handleUpdateMilestone} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  里程碑标题
                </label>
                <input
                  type="text"
                  required
                  value={editingMilestone.title}
                  onChange={(e) => setEditingMilestone({ ...editingMilestone, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  描述
                </label>
                <textarea
                  value={editingMilestone.description}
                  onChange={(e) => setEditingMilestone({ ...editingMilestone, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  状态
                </label>
                <select
                  value={editingMilestone.status}
                  onChange={(e) => setEditingMilestone({ ...editingMilestone, status: e.target.value as Milestone['status'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">待完成</option>
                  <option value="completed">已完成</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  截止日期
                </label>
                <input
                  type="date"
                  value={editingMilestone.due_date || ''}
                  onChange={(e) => setEditingMilestone({ ...editingMilestone, due_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingMilestone(null)}
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
      
      {/* 项目列表 */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">加载中...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-8">
            <FolderIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">暂无项目</p>
          </div>
        ) : (
          projects.map((project) => {
            const projectMilestones = milestones.filter(m => m.project_id === project.id)
            const progress = getProjectProgress(project.id)
            const status = getProjectStatus(project)
            
            return (
              <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                        {getStatusText(status)}
                      </span>
                    </div>
                    
                    {project.description && (
                      <p className="text-gray-600 mb-3">{project.description}</p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span>开始：{new Date(project.start_date).toLocaleDateString()}</span>
                      </div>
                      {project.end_date && (
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>结束：{new Date(project.end_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* 进度条 */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">项目进度</span>
                        <span className="text-sm text-gray-500">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setNewMilestone({ ...newMilestone, project_id: project.id })
                        setShowAddMilestoneForm(true)
                      }}
                      className="text-blue-600 hover:text-blue-800"
                      title="添加里程碑"
                    >
                      <TargetIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setEditingProject(project)}
                      className="text-blue-600 hover:text-blue-800"
                      title="编辑项目"
                    >
                      <EditIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="text-red-600 hover:text-red-800"
                      title="删除项目"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                {/* 里程碑列表 */}
                {projectMilestones.length > 0 && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-3">里程碑</h4>
                    <div className="space-y-2">
                      {projectMilestones.map((milestone) => (
                        <div key={milestone.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => toggleMilestoneStatus(milestone)}
                              className={`flex-shrink-0 ${
                                milestone.status === 'completed'
                                  ? 'text-green-600'
                                  : 'text-gray-400 hover:text-green-600'
                              }`}
                            >
                              <CheckCircleIcon className="h-5 w-5" />
                            </button>
                            <div className="flex-1">
                              <h5 className={`font-medium ${
                                milestone.status === 'completed'
                                  ? 'text-gray-500 line-through'
                                  : 'text-gray-900'
                              }`}>
                                {milestone.title}
                              </h5>
                              {milestone.description && (
                                <p className="text-sm text-gray-600">{milestone.description}</p>
                              )}
                              {milestone.due_date && (
                                <p className="text-xs text-gray-500">
                                  截止：{new Date(milestone.due_date).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setEditingMilestone(milestone)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <EditIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteMilestone(milestone.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Projects