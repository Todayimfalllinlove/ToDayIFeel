import { useState, useEffect } from "react"
import { supabase } from "../js/supabaseClient"
import { useNavigate } from "react-router-dom"

function Auth() {
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState(null)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const navigate = useNavigate()

  // Email validation
  const validateEmail = (email) => {
    !email ? 'Email is required' :
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Please enter a valid email address'
        : ''
  }

  // Password validation
  const validatePassword = (password) => {
    !password ? 'Password is required' :
      password.length < 6 ? 'Password must be at least 6 characters'
        : ''
  }

  useEffect(() => {
    if (emailTouched) setEmailError(validateEmail(email))
  }, [email, emailTouched])

  useEffect(() => {
    if (passwordTouched) setPasswordError(validatePassword(password))
  }, [password, passwordTouched])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setFormError(null)

    setEmailTouched(true)
    setPasswordTouched(true)

    // Validate before submission
    validateEmail(email)
    validatePassword(password)

    if (emailError || passwordError) {
      setLoading(false)
      return
    }

    try {
      if (isLogin) {
        // 
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
          if (error.message.includes('Email not confirmed')) throw new Error('Please check your email to confirm your account');
          if (error.message.includes('Invalid login credentials')) throw new Error('Invalid email or password');
          throw error;
        }
        navigate('/dashboard')
      } else {

        const { data, error: signUpErr } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth` }
        })

        const { error: loginErr } = await supabase.auth.signInWithPassword({ email, password: 'dummy' });
        if (!loginErr?.message.includes('Invalid login credentials')) throw new Error('Email already registered');

        if (signUpErr) {
          if (signUpErr.message.includes('already registered')) {
            throw new Error('This email address is already registered. Please try logging in or use a different email.')
          }
          throw signUpErr
        }

        if (data?.user) {
          alert('Signed up! Check your email to confirm.')
          setIsLogin(true)
          setEmail('')
          setPassword('')
        }
      }
    } catch (error) {
      console.error('Authentication Error:', error.message);
      setFormError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="container">
        <div className="card shadow-md rounded-lg overflow-hidden flex flex-col px-6 py-10 max-w-lg mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">{isLogin ? 'Login' : 'Sign Up'}
          </h2>
          {formError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{formError}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Your email"
                className={`w-full p-2 border rounded ${emailTouched && emailError ? 'border-red-500' : 'border-gray-300'} py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (!emailTouched) setEmailTouched(true)
                }}
                onBlur={() => setEmailTouched(true)}
                required
              />
              {emailTouched && emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="Your password"
                className={`w-full p-2 border rounded ${passwordTouched && passwordError ? 'border-red-500' : 'border-gray-300'} py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (!passwordTouched) setPasswordTouched(true)
                }}
                onBlur={() => setPasswordTouched(true)} 
                required
              />
              {passwordTouched && passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>

            <button
              type="submit"
              className="btn w-full p-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || (emailTouched && !!emailError) || (passwordTouched && !!passwordError)}
            >
              {loading ? 'Loading...' : (isLogin ? 'Login' : 'Sign Up')}
            </button>

            <p className="mt-4 text-center text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                onClick={() => {
                  setIsLogin(!isLogin)
                  setEmail('');
                  setPassword('');
                  setEmailError('');
                  setPasswordError('');
                  setEmailTouched(false);
                  setPasswordTouched(false);
                  setFormError(null);
                }}
                className="text-blue-500 underline"
                type="button"
              >
                {isLogin ? 'Sign up' : 'Login'}
              </button>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default Auth