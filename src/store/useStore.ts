import { create } from 'zustand'
import { supabase, Task, KnowledgePoint, Project, StudySession, Milestone } from '../lib/supabase'
import { User } from '@supabase/supabase-js'

interface AppState {
  // 用户状态
  user: User | null
  setUser: (user: User | null) => void
  
  // 任务状态
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  addTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  fetchTasks: () => Promise<void>
  
  // 知识点状态
  knowledgePoints: KnowledgePoint[]
  setKnowledgePoints: (points: KnowledgePoint[]) => void
  addKnowledgePoint: (point: Omit<KnowledgePoint, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => Promise<void>
  updateKnowledgePoint: (id: string, updates: Partial<KnowledgePoint>) => Promise<void>
  deleteKnowledgePoint: (id: string) => Promise<void>
  fetchKnowledgePoints: () => Promise<void>
  
  // 项目状态
  projects: Project[]
  setProjects: (projects: Project[]) => void
  addProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => Promise<void>
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  fetchProjects: () => Promise<void>
  
  // 学习会话状态
  studySessions: StudySession[]
  setStudySessions: (sessions: StudySession[]) => void
  addStudySession: (session: Omit<StudySession, 'id' | 'created_at' | 'user_id'>) => Promise<void>
  fetchStudySessions: () => Promise<void>
  
  // 里程碑状态
  milestones: Milestone[]
  setMilestones: (milestones: Milestone[]) => void
  addMilestone: (milestone: Omit<Milestone, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => Promise<void>
  updateMilestone: (id: string, updates: Partial<Milestone>) => Promise<void>
  deleteMilestone: (id: string) => Promise<void>
  fetchMilestones: () => Promise<void>
  
  // UI状态
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  
  // 加载状态
  loading: boolean
  setLoading: (loading: boolean) => void
}

export const useStore = create<AppState>((set, get) => ({
  // 用户状态
  user: null,
  setUser: (user) => set({ user }),
  
  // 任务状态
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  
  addTask: async (taskData) => {
    const { user } = get()
    if (!user) return
    
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ ...taskData, user_id: user.id }])
      .select()
      .single()
    
    if (error) {
      console.error('Error adding task:', error)
      return
    }
    
    set((state) => ({ tasks: [...state.tasks, data] }))
  },
  
  updateTask: async (id, updates) => {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating task:', error)
      return
    }
    
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? data : task))
    }))
  },
  
  deleteTask: async (id) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting task:', error)
      return
    }
    
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id)
    }))
  },
  
  fetchTasks: async () => {
    const { user } = get()
    if (!user) return
    
    set({ loading: true })
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching tasks:', error)
    } else {
      set({ tasks: data || [] })
    }
    set({ loading: false })
  },
  
  // 知识点状态
  knowledgePoints: [],
  setKnowledgePoints: (knowledgePoints) => set({ knowledgePoints }),
  
  addKnowledgePoint: async (pointData) => {
    const { user } = get()
    if (!user) return
    
    const { data, error } = await supabase
      .from('knowledge_points')
      .insert([{ ...pointData, user_id: user.id }])
      .select()
      .single()
    
    if (error) {
      console.error('Error adding knowledge point:', error)
      return
    }
    
    set((state) => ({ knowledgePoints: [...state.knowledgePoints, data] }))
  },
  
  updateKnowledgePoint: async (id, updates) => {
    const { data, error } = await supabase
      .from('knowledge_points')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating knowledge point:', error)
      return
    }
    
    set((state) => ({
      knowledgePoints: state.knowledgePoints.map((point) => (point.id === id ? data : point))
    }))
  },
  
  deleteKnowledgePoint: async (id) => {
    const { error } = await supabase
      .from('knowledge_points')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting knowledge point:', error)
      return
    }
    
    set((state) => ({
      knowledgePoints: state.knowledgePoints.filter((point) => point.id !== id)
    }))
  },
  
  fetchKnowledgePoints: async () => {
    const { user } = get()
    if (!user) return
    
    set({ loading: true })
    const { data, error } = await supabase
      .from('knowledge_points')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching knowledge points:', error)
    } else {
      set({ knowledgePoints: data || [] })
    }
    set({ loading: false })
  },
  
  // 项目状态
  projects: [],
  setProjects: (projects) => set({ projects }),
  
  addProject: async (projectData) => {
    const { user } = get()
    if (!user) return
    
    const { data, error } = await supabase
      .from('projects')
      .insert([{ ...projectData, user_id: user.id }])
      .select()
      .single()
    
    if (error) {
      console.error('Error adding project:', error)
      return
    }
    
    set((state) => ({ projects: [...state.projects, data] }))
  },
  
  updateProject: async (id, updates) => {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating project:', error)
      return
    }
    
    set((state) => ({
      projects: state.projects.map((project) => (project.id === id ? data : project))
    }))
  },
  
  deleteProject: async (id) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting project:', error)
      return
    }
    
    set((state) => ({
      projects: state.projects.filter((project) => project.id !== id)
    }))
  },
  
  fetchProjects: async () => {
    const { user } = get()
    if (!user) return
    
    set({ loading: true })
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching projects:', error)
    } else {
      set({ projects: data || [] })
    }
    set({ loading: false })
  },
  
  // 学习会话状态
  studySessions: [],
  setStudySessions: (studySessions) => set({ studySessions }),
  
  // 里程碑状态
  milestones: [],
  setMilestones: (milestones) => set({ milestones }),
  
  addStudySession: async (sessionData) => {
    const { user } = get()
    if (!user) return
    
    const { data, error } = await supabase
      .from('study_sessions')
      .insert([{ ...sessionData, user_id: user.id }])
      .select()
      .single()
    
    if (error) {
      console.error('Error adding study session:', error)
      return
    }
    
    set((state) => ({ studySessions: [...state.studySessions, data] }))
  },
  
  fetchStudySessions: async () => {
    const { user } = get()
    if (!user) return
    
    set({ loading: true })
    const { data, error } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching study sessions:', error)
    } else {
      set({ studySessions: data || [] })
    }
    set({ loading: false })
  },
  
  // UI状态
  sidebarOpen: false,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  
  // 加载状态
  loading: false,
  setLoading: (loading) => set({ loading }),

  fetchMilestones: async () => {
    const { user } = get()
    if (!user) return
    
    set({ loading: true })
    const { data, error } = await supabase
      .from('milestones')
      .select(`
        *,
        projects!inner(user_id)
      `)
      .eq('projects.user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching milestones:', error)
    } else {
      set({ milestones: data || [] })
    }
    set({ loading: false })
  },

  // Milestone actions
  addMilestone: async (milestone: Omit<Milestone, 'id' | 'created_at' | 'updated_at'>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')
    
    const { data, error } = await supabase
      .from('milestones')
      .insert(milestone)
      .select()
      .single()
    
    if (error) throw error
    
    set((state) => ({
      milestones: [...state.milestones, data]
    }))
  },
  
  updateMilestone: async (id: string, updates: Partial<Milestone>) => {
    const { error } = await supabase
      .from('milestones')
      .update(updates)
      .eq('id', id)
    
    if (error) throw error
    
    set((state) => ({
      milestones: state.milestones.map(milestone => 
        milestone.id === id ? { ...milestone, ...updates } : milestone
      )
    }))
  },
  
  deleteMilestone: async (id: string) => {
    const { error } = await supabase
      .from('milestones')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    set((state) => ({
      milestones: state.milestones.filter(milestone => milestone.id !== id)
    }))
  }
}))