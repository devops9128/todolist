import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useAuth } from '../hooks/useAuth'
import {
  HomeIcon,
  CheckSquareIcon,
  BookOpenIcon,
  FolderIcon,
  BarChart3Icon,
  MenuIcon,
  XIcon,
  LogOutIcon,
  UserIcon
} from 'lucide-react'

const Layout: React.FC = () => {
  const { sidebarOpen, setSidebarOpen } = useStore()
  const { user, signOut } = useAuth()
  const location = useLocation()
  
  const navigation = [
    { name: '主页', href: '/', icon: HomeIcon },
    { name: '任务管理', href: '/tasks', icon: CheckSquareIcon },
    { name: '知识库', href: '/knowledge', icon: BookOpenIcon },
    { name: '项目追踪', href: '/projects', icon: FolderIcon },
    { name: '统计分析', href: '/analytics', icon: BarChart3Icon }
  ]
  
  const handleSignOut = async () => {
    await signOut()
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 移动端侧边栏遮罩 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* 侧边栏 */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">学习助手</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>
          
          {/* 导航菜单 */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          
          {/* 用户信息 */}
          {user && (
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserIcon className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="ml-3 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                  title="退出登录"
                >
                  <LogOutIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 主内容区域 */}
      <div className="lg:pl-64">
        {/* 页面内容 */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout