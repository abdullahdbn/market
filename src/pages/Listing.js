import React from 'react'
import {useState,useEffect} from 'react'
import {Link,useNavigate,useParams} from 'react-router-dom'
import { MapContainer,Marker,Popup,TileLayer } from 'react-leaflet'
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'
import {getDoc,doc} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'
import {db} from '../firebase.config'
import Spinner from '../component/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'
import { async } from '@firebase/util'
import {Carousel} from 'react-responsive-carousel'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
SwiperCore.use(Navigation,Pagination,Scrollbar,A11y)
// import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
// import { Carousel } from 'react-responsive-carousel';

function Listing() {
    const [listing,setListing]=useState(null)
    const [loading,setLoading]=useState(true)
    const [shareLinkCopied,setShareLinkCopied]=useState(false)

    const navigate =useNavigate()
    const params = useParams()
    const auth = getAuth()
    
    useEffect(()=>{
      const fetchListing =async()=>{
        const docRef =doc(db,'listing',params.listingId)
        const docSnap = await getDoc(docRef)
        if(docSnap.exists()){
          setListing(docSnap.data())
          setLoading(false)
        }
      }
      fetchListing()
    },[navigate,params.listingId])
  if(loading){
    return <Spinner />
  }
  console.log(listing.imgUrls)
  return (
    <main>
 
      <Carousel showArrows={true}infiniteLoop useKeyboardArrows swipeable autoPlay='2000'  >

      { listing.imgUrls.map((url,index)=>(
        <div className='owl-carousel owl-theme' key={`slide${index}`}>
          <img className='item' src={`${listing.imgUrls[index]}`}/>
        </div>
        )
        )}

      </Carousel>

      
      <div className='shareIconDiv' onClick={()=> {
        navigator.clipboard.writeText(window.location.href)
        setShareLinkCopied(true)
        setTimeout(()=>{
          setShareLinkCopied(false)
        },2000)
      }}>
        <img src={shareIcon} alt=''/>
      </div>
      {shareLinkCopied && <p className='linkCopied'>Link Copied</p>}
      <div className='listingDetails'>
        <p className='listingName'>
          {listing.name}- ${listing.offer ? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',') : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',')}
        </p>
        <p className='listingLocation'>{listing.location}</p>
        <p className='listingType'>For {listing.type==='rent'? 'Rent':'Sale'}</p>
        {listing.offer && (
          <p className='discountPrice'>
            $ {listing.regularPrice - listing.discountedPrice} 
            discount
          </p>
        )}

        <ul className='listingDetailsList'>
          <li>
            {listing.bedrooms > 1 
            ? `${listing.bedrooms} Bedrooms`
            : `1 Bedroom`}
          </li>
          <li>
            {listing.bathrooms > 1 
            ? `${listing.bathrooms} bathrooms`
            : `1 Bathroom`}
          </li>
          <li>{listing.parking && 'Parking Spot'}</li>
          <li>{listing.furnished&& 'Furnished'}</li>
        </ul>
        <p className='listingLocationTitle'>location</p>
        <div className='leafletContainer'>
        <MapContainer
            style={{ height: '100%', width: '100%' }}
            center={[listing.geoLocation.lat , listing.geoLocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
            />

            <Marker
              position={[listing.geoLocation.lat, listing.geoLocation.lng]}
            >
              <Popup>{listing.location}</Popup>
            </Marker>
          </MapContainer>
        </div>
        {auth.currentUser?.uid !== listing.userRef &&(
          <Link to={`/contact/${listing.userRef}?listigName=${listing.name}`} className='primaryButton'>
            Contact Landlord
          </Link>
        )}
      </div>
    </main>
  )
}

export default Listing
