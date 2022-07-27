import React,{useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import { getAuth,signInWithEmailAndPassword } from 'firebase/auth'
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import {ReactComponent as VisibilityIcon} from '../assets/svg/visibilityIcon.svg'
import {toast} from 'react-toastify'
import OAuth from '../component/OAuth'
function SignIn() {
  const [showPassword,setShowPassword] = useState(false)
  const [formData,setFormData]=useState({
    email:'',
    password:''
  })
  const {email,password}=formData

  const navigate =useNavigate()

  console.log(email)
  console.log(password)

  const onChange = (e)=>{
    const{value,id}=e.target
    setFormData(pre=>({...pre,[id]:value}))
  }
  function show(){
    setShowPassword(!showPassword)
  }
  const onSubmit= async(e)=>{
    e.preventDefault()
    try {
      const auth=getAuth()
      const userCredential = await signInWithEmailAndPassword(auth,email,password)
      if(userCredential.user){
        navigate('/')
      }
    } catch (error) {
      toast.error('bad user credentials')
    }

  }

  return (
    <>
      <div className='pageContainer'>
        <header>
          <p className='pageHeader'>Welcome Back</p>
        </header>
        <main>
          <form onSubmit={onSubmit}>
            <input type='email' className='emailInput' placeholder='Email' Id='email'value={email} onChange={onChange}/>
            <div className='passwordInputDiv'>
              <input type={showPassword?'text':'password'} className='passwordInput' placeholder='Password' id='password' value={password} onChange={onChange}/>
              <VisibilityIcon className='showPassword' fill='000000' onClick={show}  width='34px'
                height='34px'/>
            </div>
            <Link to='/ForgetPassword' className='forgotPasswordLink'>
              Forgot Password
            </Link>
            <div className='signInBar'>
              <p className='signInText'>
                Sign In
              </p>
              <button className='signInButton'>
                <ArrowRightIcon fill='#ffffff' width='34px'
                height='34px' />
              </button>
            </div>
          </form>
          <OAuth/>
          <Link to='/sign-up' className='registerLink'>Sign Up Instead</Link>
        </main>
      </div>
      
    </>
  )
}

export default SignIn
