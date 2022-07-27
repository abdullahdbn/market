import React,{useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import {ReactComponent as VisibilityIcon} from '../assets/svg/visibilityIcon.svg'
import {getAuth,createUserWithEmailAndPassword,updateProfile} from 'firebase/auth'
import { setDoc ,doc,serverTimestamp } from 'firebase/firestore'
import {db}from '../firebase.config'
import {toast} from 'react-toastify'
import OAuth from '../component/OAuth'
function SignUp() {
  const [showPassword,setShowPassword] = useState(false)
  const [formData,setFormData]=useState({
    name:'',
    email:'',
    password:''
  })
  const {email,password,name}=formData

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

  const onSubmit = async(e)=>{
    e.preventDefault()
    try {
      const auth = getAuth()
      const userCredential = await createUserWithEmailAndPassword(auth,email,password)
      const user = userCredential.user
      updateProfile(auth.currentUser,{
        displayName:name
      })

      const formDataCopy ={...formData}
      delete formDataCopy.password
      formDataCopy.timestamp = serverTimestamp()

      await setDoc(doc(db,'users',user.uid),formDataCopy)

      navigate('/')
    } catch (error) {
      console.log(error)
      toast.error('Wrong on regestration')
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
            <input type='text' className='nameInput' placeholder='Name' Id='name'value={name} onChange={onChange}/>
            <input type='email' className='emailInput' placeholder='Email' Id='email'value={email} onChange={onChange}/>
            <div className='passwordInputDiv'>
              <input type={showPassword?'text':'password'} className='passwordInput' placeholder='Password' id='password' value={password} onChange={onChange}/>
              <VisibilityIcon className='showPassword' fill='000000' onClick={show}  width='34px'
                height='34px'/>
            </div>
            <Link to='/forget-password' className='forgotPasswordLink'>
              Forgot Password
            </Link>
            <div className='signUpBar'>
              <p className='signUpText'>
                Sign UP
              </p>
              <button className='signUpButton'>
                <ArrowRightIcon fill='#ffffff' width='34px'
                height='34px' />
              </button>
            </div>
          </form>
          <OAuth/>
          <Link to='/profile' className='registerLink'>Sign In Instead</Link>
        </main>
      </div>
      
    </>
  )
}

export default SignUp
