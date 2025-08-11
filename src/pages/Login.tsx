import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { BookOpenIcon, EyeIcon, EyeOffIcon } from 'lucide-react'

// 自定义CSS样式
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800&family=Noto+Sans+SC:wght@300;400;500;600;700;800&display=swap');
  
  /* 字体样式定义 */
  .font-primary { font-family: 'Inter', 'Noto Sans SC', system-ui, -apple-system, sans-serif; }
  .font-heading { font-family: 'Poppins', 'Noto Sans SC', system-ui, -apple-system, sans-serif; }
  .font-chinese { font-family: 'Noto Sans SC', 'Inter', system-ui, -apple-system, sans-serif; }
  
  /* 字体权重和样式 */
  .font-light { font-weight: 300; }
  .font-normal { font-weight: 400; }
  .font-medium { font-weight: 500; }
  .font-semibold { font-weight: 600; }
  .font-bold { font-weight: 700; }
  .font-extrabold { font-weight: 800; }
  
  /* 字间距和行高优化 */
  .letter-tight { letter-spacing: -0.025em; }
  .letter-normal { letter-spacing: 0; }
  .letter-wide { letter-spacing: 0.025em; }
  .leading-relaxed { line-height: 1.625; }
  .leading-loose { line-height: 2; }
  
  /* 文本渲染优化 */
  .text-render-optimized {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    font-feature-settings: 'kern' 1;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-10px) rotate(1deg); }
    66% { transform: translateY(-5px) rotate(-1deg); }
  }
  
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.3); }
    50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.6), 0 0 30px rgba(99, 102, 241, 0.4); }
  }
  
  @keyframes drift {
    0% { transform: translateX(0px) translateY(0px); }
    25% { transform: translateX(5px) translateY(-5px); }
    50% { transform: translateX(-3px) translateY(-8px); }
    75% { transform: translateX(-5px) translateY(-2px); }
    100% { transform: translateX(0px) translateY(0px); }
  }
  
  .float-animation { animation: float 6s ease-in-out infinite; }
  .glow-animation { animation: glow 4s ease-in-out infinite; }
  .drift-animation { animation: drift 8s ease-in-out infinite; }
`

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signIn, signUp } = useAuth()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const { error } = isLogin
        ? await signIn(email, password)
        : await signUp(email, password)
      
      if (error) {
        setError(error.message)
      } else if (!isLogin) {
        setError('注册成功！请检查您的邮箱以验证账户。')
      }
    } catch (err) {
      setError('操作失败，请重试')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* 动态学习主题背景 */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 主要渐变背景球 */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-300/30 to-indigo-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-300/30 to-pink-400/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        
        {/* 学习元素装饰 */}
        <div className="absolute top-20 left-20 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-60 animate-bounce" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute top-32 right-32 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-50 animate-bounce" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute bottom-32 left-32 w-4 h-4 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full opacity-70 animate-bounce" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 right-20 w-5 h-5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-60 animate-bounce" style={{animationDelay: '0.8s'}}></div>
        
        {/* 书本形状装饰 */}
        <div className="absolute top-1/4 left-10 w-12 h-8 bg-gradient-to-r from-indigo-400/40 to-purple-400/40 rounded-sm transform rotate-12 float-animation" style={{animationDelay: '1.2s'}}></div>
        <div className="absolute bottom-1/4 right-10 w-10 h-6 bg-gradient-to-r from-emerald-400/40 to-teal-400/40 rounded-sm transform -rotate-12 float-animation" style={{animationDelay: '2.5s'}}></div>
        
        {/* 星星装饰 */}
        <div className="absolute top-1/3 right-1/4 text-yellow-400/60 animate-pulse" style={{animationDelay: '0.3s'}}>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <div className="absolute bottom-1/3 left-1/4 text-pink-400/50 animate-pulse" style={{animationDelay: '1.8s'}}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        
        {/* 浮动的学习符号 */}
        <div className="absolute top-1/2 left-16 text-indigo-400/40 animate-bounce" style={{animationDelay: '2.2s'}}>
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div className="absolute top-2/3 right-16 text-emerald-400/40 animate-bounce" style={{animationDelay: '1.7s'}}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        
        {/* 知识气泡 */}
        <div className="absolute top-16 left-1/3 w-16 h-10 bg-gradient-to-r from-cyan-200/30 to-blue-200/30 rounded-full drift-animation" style={{animationDelay: '0.7s'}}></div>
        <div className="absolute bottom-16 right-1/3 w-12 h-8 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full drift-animation" style={{animationDelay: '1.9s'}}></div>
        
        {/* 学习路径线条 */}
        <div className="absolute top-1/4 left-1/2 w-32 h-0.5 bg-gradient-to-r from-transparent via-indigo-300/50 to-transparent transform rotate-45 animate-pulse" style={{animationDelay: '1.1s'}}></div>
        <div className="absolute bottom-1/4 right-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-purple-300/50 to-transparent transform -rotate-45 animate-pulse" style={{animationDelay: '2.3s'}}></div>
        
        {/* 浮动粒子效果 */}
        <div className="absolute top-10 left-1/4 w-2 h-2 bg-yellow-300/70 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-pink-300/60 rounded-full animate-ping" style={{animationDelay: '1.4s'}}></div>
        <div className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 bg-blue-300/50 rounded-full animate-ping" style={{animationDelay: '2.1s'}}></div>
        <div className="absolute bottom-10 right-1/4 w-1 h-1 bg-green-300/80 rounded-full animate-ping" style={{animationDelay: '0.9s'}}></div>
        
        {/* 旋转的学习环 */}
        <div className="absolute top-1/4 right-1/3 w-20 h-20 border-2 border-indigo-200/30 rounded-full animate-spin" style={{animationDuration: '20s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-16 h-16 border-2 border-purple-200/40 rounded-full animate-spin" style={{animationDuration: '15s', animationDirection: 'reverse'}}></div>
        
        {/* 呼吸光环 */}
        <div className="absolute top-1/2 right-10 w-12 h-12 bg-gradient-to-r from-cyan-300/20 to-blue-300/20 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
        <div className="absolute top-1/3 left-10 w-8 h-8 bg-gradient-to-r from-emerald-300/25 to-teal-300/25 rounded-full animate-pulse" style={{animationDelay: '1.3s'}}></div>
        
        {/* 知识流动线条 */}
        <div className="absolute top-1/2 left-1/4 w-0.5 h-20 bg-gradient-to-b from-transparent via-indigo-300/40 to-transparent animate-pulse" style={{animationDelay: '0.4s'}}></div>
        <div className="absolute top-1/3 right-1/4 w-0.5 h-16 bg-gradient-to-b from-transparent via-purple-300/40 to-transparent animate-pulse" style={{animationDelay: '1.6s'}}></div>
        
        {/* 学习进度条装饰 */}
        <div className="absolute top-20 right-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-yellow-300/50 to-transparent rounded-full animate-pulse" style={{animationDelay: '0.8s'}}></div>
        <div className="absolute bottom-20 left-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-green-300/50 to-transparent rounded-full animate-pulse" style={{animationDelay: '2.4s'}}></div>
        
        {/* 思维导图节点 */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-gradient-to-r from-orange-400/60 to-red-400/60 rounded-full animate-bounce" style={{animationDelay: '1.0s'}}></div>
        <div className="absolute bottom-1/4 right-1/4 w-2.5 h-2.5 bg-gradient-to-r from-violet-400/60 to-purple-400/60 rounded-full animate-bounce" style={{animationDelay: '1.8s'}}></div>
        

        
        {/* 知识连接线 */}
        <div className="absolute top-1/3 left-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-rose-300/40 to-transparent transform rotate-12 animate-pulse" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-1/3 right-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent transform -rotate-12 animate-pulse" style={{animationDelay: '1.9s'}}></div>
      </div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-200 glow-animation">
              <BookOpenIcon className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-heading font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent letter-tight text-render-optimized">
            {isLogin ? '登录账户' : '创建账户'}
          </h2>
          <p className="mt-4 text-lg font-chinese font-medium text-gray-600 leading-relaxed text-render-optimized">
            {isLogin ? '欢迎回到您的学习助手' : '开始您的学习之旅'}
          </p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-xl py-10 px-8 shadow-2xl rounded-2xl border border-white/20 hover:bg-white/90 hover:shadow-3xl transition-all duration-500 group">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className={`p-4 rounded-xl border ${
                error.includes('成功') 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-red-50 text-red-700 border-red-200'
              } shadow-sm`}>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    error.includes('成功') ? 'bg-emerald-400' : 'bg-red-400'
                  }`}></div>
                  <p className="text-sm font-chinese font-medium text-render-optimized">{error}</p>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-chinese font-semibold text-gray-800 letter-wide text-render-optimized">
                邮箱地址
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white text-sm font-primary text-render-optimized"
                  placeholder="请输入邮箱地址"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-chinese font-semibold text-gray-800 letter-wide text-render-optimized">
                密码
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white text-sm font-primary text-render-optimized"
                  placeholder={isLogin ? '请输入密码' : '请设置密码（至少6位）'}
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-100 rounded-r-xl transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-chinese font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] letter-wide text-render-optimized"
              >
                {loading && (
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <span className={loading ? 'ml-6' : ''}>
                  {loading ? '处理中...' : (isLogin ? '登录' : '注册')}
                </span>
              </button>
            </div>
            
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError('')
                }}
                className="text-sm font-chinese font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200 hover:underline letter-normal text-render-optimized"
              >
                {isLogin ? '没有账户？立即注册' : '已有账户？立即登录'}
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
    </>
  )
}

export default Login