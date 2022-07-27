import { useState,useEffect } from 'react'
import {getAuth,updateProfile} from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import { db } from '../firebase.config'
import {updateDoc,collection,getDocs,query,where,orderBy,doc,deleteDoc} from 'firebase/firestore'
import {toast} from 'react-toastify'
import ListingItem from '../component/ListingItem'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
function Profile() {
  const auth=getAuth()
  const [changeDetails,setChangeDetails] =useState(false)
  const [formData,setFormData]=useState({
    name:auth.currentUser.displayName,
    email:auth.currentUser.email,
  })
  const [loading,setLoading] = useState(true)
  const [listings,setListing] = useState(null)
  const { name,email } = formData
  const navigate = useNavigate()

  useEffect(()=>{
    const fetchUserListings = async()=>{
      const listingsRef = collection(db,'listing')

      const q = query(
        listingsRef,
        where('userRef','==',auth.currentUser.uid),
        orderBy('timestamp','desc')
      )
      const querySnap = await getDocs(q)

      let listings = []

      querySnap.forEach(doc=>{
        return listings.push({
          id : doc.id,
          data: doc.data()
        })
      })
      setListing(listings)
      setLoading(false)
    }
    fetchUserListings()
  },[auth.currentUser.uid])

  const onLogout = async()=>{
    await auth.signOut()
    navigate('/signin')
  }
  const onSubmit= async()=>{
    try {
      if(auth.currentUser.displayName !== name){
        // update display name in fb
        await updateProfile(auth.currentUser,{
          displayName:name,
        })
        // update in firestore
        const userRef = doc(db,'users',auth.currentUser.uid)
        await updateDoc(userRef,{
          name
        })
      }
    } catch (error) {
      toast.error('could not update profile details')
    }

  }

  const onChange = (e)=>{
    setFormData((prev)=>({
      ...prev,
      [e.target.id]:e.target.value,
    }) )
  }

  const onDelete =async (listingId) =>{
    if(window.confirm('Are you sure You want to delete?')){
      await deleteDoc(doc(db,'listing',listingId))
      const updatedListings = listings.filter((listing)=>
        listing.id !== listingId 
      )
      setListing(updatedListings)
      toast.success('Successfully deleted')
    }
  }

  const onEdit = (listingId)=>{
    navigate(`/edit-listing/${listingId}`)
  }

  console.log(listings)
  return<div className='profile'>
    <header className='profileHeader'>
      <p className='pageHeader'>My Profile</p>
      <button type='button' className='logOut' onClick={onLogout}>Logout</button>
    </header>
    <main>
      <div className='profileDetailsHeader'>
        <p className='profileDetailsText'>Personal Details</p>
        <p className='changePersonalDetails' onClick={()=>{
          changeDetails && onSubmit()
          setChangeDetails((prev)=>!prev)
        }}>
          {changeDetails? 'done':'change'}
        </p>
      </div>
      <div className='profileCard'>
        <form>
          <input 
          type='text'
          id='name' 
          className={!changeDetails ? 'profileName':'profileNameActive'} 
          disabled={!changeDetails} 
          value={name}
          onChange={onChange}/>
          <input 
          type='text'
          id='email' 
          className={!changeDetails ? 'profileEmail':'profileEmailActive'} 
          disabled={!changeDetails} 
          value={email}
          onChange={onChange}/>
        </form>
      </div>
      <Link to='/create-listing' className='createListing'>
        <img src={homeIcon} alt='home'/>
        <p>Sell or rent your home</p>
        <img src={arrowRight} alt="right"/>
      </Link>
      {!loading && listings?.length > 0 && (
        <>
          <p className='listingText'>Your Listings</p>
          <ul className='listingsList'>
            {listings.map((listing)=>(
              <ListingItem key={listing.id} listing={listing.data} id={listing.id} onDelete={()=>onDelete(listing.id)} onEdit={()=>onEdit(listing.id)}/>
            ))}
          </ul>
        </>
      )}
    </main>
  </div>
}

export default Profile
