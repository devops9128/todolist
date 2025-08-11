import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!')
  console.error('Please check your .env.local file and ensure you have:')
  console.error('VITE_SUPABASE_URL=your-supabase-url')
  console.error('VITE_SUPABASE_ANON_KEY=your-supabase-anon-key')
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

if (supabaseUrl.includes('YOUR_SUPABASE_URL_HERE') || supabaseAnonKey.includes('YOUR_SUPABASE_ANON_KEY_HERE')) {
  console.error('❌ Please update your Supabase credentials in .env.local file!')
  console.error('Current values are placeholders. Get real credentials from https://supabase.com/dashboard')
  throw new Error('Please update your Supabase credentials in .env.local file.')
}

console.log('✅ Supabase configuration loaded successfully')
console.log('URL:', supabaseUrl)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 数据库类型定义
export interface Task {
  id: string
  title: string
  description?: string
  category: 'learning' | 'project' | 'knowledge'
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  due_date?: string
  created_at: string
  updated_at: string
  user_id: string
  tags?: string[]
  estimated_time?: number // 预估时间（分钟）
  parent_id?: string // 父任务ID，用于子任务
  actual_time?: number // 实际花费时间（分钟）
  progress?: number // 任务进度 0-100
  assignee?: string // 负责人
  difficulty?: 'easy' | 'medium' | 'hard' // 难度等级
}

export interface KnowledgePoint {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  created_at: string
  updated_at: string
  user_id: string
  source?: string
}

export interface Project {
  id: string
  name: string
  description?: string
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold'
  progress: number
  start_date?: string
  end_date?: string
  created_at: string
  updated_at: string
  user_id: string
  milestones?: Milestone[]
}

export interface Milestone {
  id: string
  project_id: string
  title: string
  description?: string
  status: 'pending' | 'completed'
  due_date?: string
  created_at: string
  updated_at: string
}

export interface StudySession {
  id: string
  task_id?: string
  project_id?: string
  knowledge_point_id?: string
  duration: number // 分钟
  notes?: string
  created_at: string
  user_id: string
}