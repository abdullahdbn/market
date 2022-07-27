
import {useState,useEffect} from 'react'
import {Link, useParams,useSearchParams} from 'react-router-dom'
import {doc,getDoc} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
function Contact() {
    const [message,setMessage]=useState('')
    const [landlord,setLandlord]=useState(null)
    const [searchParams,setSearchParams]= useSearchParams()

    const params = useParams()

    useEffect(()=>{
        const getLandloard = async()=>{
            console.log(message)
            const docRef = doc(db,'users',params.landlordId)
            console.log(docRef)
            const docSnap = await getDoc(docRef)
            if(docSnap){
                setLandlord(docSnap.data())
            }else{
                toast.error('Could not get landlord data')
            }
        }
        getLandloard()
    },[params.landlordId])
    const onChange= (e)=>{
        setMessage(e.target.value)
    }
    console.log(landlord)
  return (
    <div className='pageContainer'>
      <header>
        <p className='pageHeader'>
            Contact landloard
        </p>
      </header>
      {landlord !== null && (
        <main>
            <div className='contactlandlord'>
                <p className='landloardName'>Contact {landlord?.name}</p>
            </div>
            <form className='messageFomr'>
                <div className='messageDiv'>
                    <label htmlFor='message' className='messageLabel'>
                        Message
                    </label>
                    <textarea name='message' id='message' className='textarea' value={message} onChange={onChange} ></textarea>
                </div>
                <a href={`mailto:${landlord.email}?Subject=${searchParams.get('listingName')}&body=${message}`}>
                    <button type='button' className='primaryButton'>Send Message</button>
                </a>
            </form>
        </main>
      )}
    </div>
  )
}

export default Contact
