import {useState} from 'react'
import {Link} from 'react-router-dom'
import {getAuth,sendPasswordResetEmail} from 'firebase/auth'
import {toast} from 'react-toastify'
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import { async } from '@firebase/util'
function ForgetPassword() {
  const [email,setEmail]=useState('')
  const onChange = e => {
    setEmail(e.target.value)
  }
  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const auth=getAuth()
      await sendPasswordResetEmail(auth,email)
      toast.success('Email was send')
    } catch (error) {
      toast.error('Could not reset the Email')
    }
  }
  return (
      <div className='pageCOntainer'>
        <header>
          <p className='pageHeader'>Forget Password</p>
        </header>
        <main>
          <form onSubmit={onSubmit}>
            <input className='emailInput' type='email' 
            placeholder='Email' id='email' value={email}
            onChange={onChange}/>
            <Link className='forgotPasswordLink' to='/signin'>Sign In</Link>
            <div className='signInBar'>
              <div className='signInButton'>
                <ArrowRightIcon fill='#ffffff' width='34px' height='34px'/>
              </div>
            </div>
          </form>
        </main>
      </div>
  )
}

export default ForgetPassword
