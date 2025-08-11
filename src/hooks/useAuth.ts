import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'

export const useAuth = () => {
  const { user, setUser } = useStore()
  
  useEffect(() => {
    // 获取当前用户
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    
    getCurrentUser()
    
    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )
    
    return () => subscription.unsubscribe()
  }, [setUser])
  
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        console.error('Supabase signIn error:', error)
        // Check for common configuration issues
        if (error.message?.includes('API key') || error.message?.includes('Invalid API key')) {
          console.error('❌ Supabase API key issue. Please check your .env.local file.')
        }
      }
      
      return { data, error }
    } catch (err) {
      console.error('Network or configuration error:', err)
      return { 
        data: null, 
        error: { 
          message: 'Connection failed. Please check your Supabase configuration.',
          details: err
        } 
      }
    }
  }
  
  const signUp = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign up with email:', email)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      })
      
      if (error) {
        console.error('Supabase signUp error:', error)
        throw error
      }
      
      console.log('SignUp successful:', data)
      return { data, error: null }
    } catch (error) {
      console.error('SignUp failed:', error)
      return { data: null, error }
    }
  }
  
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }
  
  return {
    user,
    signIn,
    signUp,
    signOut
  }
}