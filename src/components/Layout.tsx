import React, { useState, useEffect, useRef } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import {
  HomeIcon,
  CheckSquareIcon,
  BookOpenIcon,
  FolderIcon,
  BarChart3Icon,
  MenuIcon,
  LogOutIcon,
  UserIcon
} from 'lucide-react'

const Layout: React.FC = () => {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  
  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpen])
  
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
      {/* 顶部横向标题栏 */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center justify-between h-16 px-6">
          {/* 左侧：学习助手标题 */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpenIcon className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">学习助手</h1>
          </div>
          
          {/* 中间：导航菜单 */}
          <nav className="hidden md:flex items-center space-x-8">
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
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          
          {/* 右侧：用户信息和移动端菜单 */}
          <div className="flex items-center space-x-3">
            {/* 移动端菜单按钮 */}
             <div className="md:hidden relative" ref={menuRef}>
               <button
                 onClick={() => setMenuOpen(!menuOpen)}
                 className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
               >
                 <MenuIcon className="h-6 w-6" />
               </button>
               
               {/* 移动端下拉菜单 */}
               {menuOpen && (
                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    {navigation.map((item) => {
                      const isActive = location.pathname === item.href
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`flex items-center px-4 py-2 text-sm transition-colors ${
                            isActive
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                          onClick={() => setMenuOpen(false)}
                        >
                          <item.icon className="mr-3 h-4 w-4" />
                          {item.name}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
            
            {/* 用户信息 */}
            {user && (
              <>
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-6 w-6 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {user.email}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                  title="退出登录"
                >
                  <LogOutIcon className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="pt-16">
        {/* 页面内容 */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout