import {useState,useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {collection,getDocs,query,orderBy,limit, Timestamp} from 'firebase/firestore'
import {db} from '../firebase.config'
import Spinner from './Spinner'
import Listing from '../pages/Listing'
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader'

function Slider() {
    const [loading,setLoading]=useState(true)
    const [listings,setListing]=useState(null)
    const navigate = useNavigate()
    useEffect(()=>{
        const fetchListing=async()=>{
            const listingsRef = collection(db,'listing')
            const q =query(listingsRef,orderBy('timestamp','desc'),limit(5))
            const querySnap = await getDocs(q)
            let listings =[]
            querySnap.forEach((doc)=>{
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })
    

            setListing(listings)
            setLoading(false)
        }
        fetchListing()
    },[])

    function fin(e){
    }
    if(loading){
        return <Spinner/>
    }
    if(listings.length===0){
        return<></>
    }
    console.log(listings)
  return listings && (
    <>
    
        <p className='exploreHeading'>Recommended</p>
        <div className="carousel-wrapper">

            <Carousel showArrows={true} infiniteLoop useKeyboardArrows swipeable autoPlay='2000' >
                {listings.map(({data,id})=>
                    <div className='owl-carousel owl-theme' key={id} fun={fin(data.imgUrls[0])} onClick={()=> navigate(`/category/${data.type}/${id}`)}>
                        <img  className='swiperSliderDiv item' src={`${data.imgUrls[0]}`}/>
                        <p className='swiperSlideText'>{data.name}</p>
                        <p  className='swiperSlidePrice'>${data.discountedPrice ?? data.regularPrice}{data.type === 'rent' && '/month'}</p>
                    </div>
                )}
            </Carousel>
            </div>
        
        
    </>
  )
  
}

export default Slider
