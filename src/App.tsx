import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { useStore } from './store/useStore'
import Layout from './components/Layout'
import Login from './pages/Login'
import Home from './pages/Home'
import Tasks from './pages/Tasks'
import Knowledge from './pages/Knowledge'
import Projects from './pages/Projects'
import Analytics from './pages/Analytics'

function App() {
  const { user } = useAuth()
  const { fetchTasks, fetchKnowledgePoints, fetchProjects, fetchStudySessions, fetchMilestones } = useStore()
  
  useEffect(() => {
    if (user) {
      // 用户登录后获取所有数据
      fetchTasks()
      fetchKnowledgePoints()
      fetchProjects()
      fetchStudySessions()
      fetchMilestones()
    }
  }, [user, fetchTasks, fetchKnowledgePoints, fetchProjects, fetchStudySessions, fetchMilestones])
  
  if (!user) {
    return <Login />
  }
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="knowledge" element={<Knowledge />} />
          <Route path="projects" element={<Projects />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
