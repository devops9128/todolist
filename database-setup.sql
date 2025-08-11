  -- 🚀 学习助手数据库架构设置
  -- 请将此文件的全部内容复制到Supabase控制台的SQL Editor中执行

  -- 创建任务表
  CREATE TABLE tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('learning', 'project', 'knowledge')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tags TEXT[]
  );

  -- 创建知识点表
  CREATE TABLE knowledge_points (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    difficulty TEXT NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    source TEXT
  );

  -- 创建项目表
  CREATE TABLE projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'completed', 'on_hold')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
  );

  -- 创建里程碑表
  CREATE TABLE milestones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- 创建学习会话表
  CREATE TABLE study_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    knowledge_point_id UUID REFERENCES knowledge_points(id) ON DELETE SET NULL,
    duration INTEGER NOT NULL, -- 分钟
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
  );

  -- 启用行级安全策略
  ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
  ALTER TABLE knowledge_points ENABLE ROW LEVEL SECURITY;
  ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
  ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
  ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

  -- 创建RLS策略 - 任务表
  CREATE POLICY "Users can view own tasks" ON tasks FOR SELECT USING (auth.uid() = user_id);
  CREATE POLICY "Users can insert own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
  CREATE POLICY "Users can update own tasks" ON tasks FOR UPDATE USING (auth.uid() = user_id);
  CREATE POLICY "Users can delete own tasks" ON tasks FOR DELETE USING (auth.uid() = user_id);

  -- 创建RLS策略 - 知识点表
  CREATE POLICY "Users can view own knowledge_points" ON knowledge_points FOR SELECT USING (auth.uid() = user_id);
  CREATE POLICY "Users can insert own knowledge_points" ON knowledge_points FOR INSERT WITH CHECK (auth.uid() = user_id);
  CREATE POLICY "Users can update own knowledge_points" ON knowledge_points FOR UPDATE USING (auth.uid() = user_id);
  CREATE POLICY "Users can delete own knowledge_points" ON knowledge_points FOR DELETE USING (auth.uid() = user_id);

  -- 创建RLS策略 - 项目表
  CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
  CREATE POLICY "Users can insert own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
  CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
  CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

  -- 创建RLS策略 - 里程碑表
  CREATE POLICY "Users can view own milestones" ON milestones FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = milestones.project_id AND projects.user_id = auth.uid())
  );
  CREATE POLICY "Users can insert own milestones" ON milestones FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = milestones.project_id AND projects.user_id = auth.uid())
  );
  CREATE POLICY "Users can update own milestones" ON milestones FOR UPDATE USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = milestones.project_id AND projects.user_id = auth.uid())
  );
  CREATE POLICY "Users can delete own milestones" ON milestones FOR DELETE USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = milestones.project_id AND projects.user_id = auth.uid())
  );

  -- 创建RLS策略 - 学习会话表
  CREATE POLICY "Users can view own study_sessions" ON study_sessions FOR SELECT USING (auth.uid() = user_id);
  CREATE POLICY "Users can insert own study_sessions" ON study_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
  CREATE POLICY "Users can update own study_sessions" ON study_sessions FOR UPDATE USING (auth.uid() = user_id);
  CREATE POLICY "Users can delete own study_sessions" ON study_sessions FOR DELETE USING (auth.uid() = user_id);

  -- 创建索引以提高查询性能
  CREATE INDEX idx_tasks_user_id ON tasks(user_id);
  CREATE INDEX idx_tasks_status ON tasks(status);
  CREATE INDEX idx_tasks_category ON tasks(category);
  CREATE INDEX idx_knowledge_points_user_id ON knowledge_points(user_id);
  CREATE INDEX idx_knowledge_points_category ON knowledge_points(category);
  CREATE INDEX idx_projects_user_id ON projects(user_id);
  CREATE INDEX idx_projects_status ON projects(status);
  CREATE INDEX idx_milestones_project_id ON milestones(project_id);
  CREATE INDEX idx_study_sessions_user_id ON study_sessions(user_id);
  CREATE INDEX idx_study_sessions_created_at ON study_sessions(created_at);

  -- 创建更新时间触发器函数
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
  END;
  $$ language 'plpgsql';

  -- 为需要的表创建更新时间触发器
  CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

  CREATE TRIGGER update_knowledge_points_updated_at BEFORE UPDATE ON knowledge_points
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

  CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

  CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON milestones
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

  -- 🎉 数据库架构设置完成！
  -- 现在你可以：
  -- 1. 注册新用户账户
  -- 2. 登录并使用应用的所有功能