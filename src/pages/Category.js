import {useEffect,useState} from 'react'
import {useParams} from 'react-router-dom'
import {collection,getDocs,query,where,orderBy,limit,startAfter} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import Spinner from '../component/Spinner'
import { async } from '@firebase/util'
import ListingItem from '../component/ListingItem'

function Category() {
    const [listings,setListings] = useState(null)
    const [loading,setloading]= useState(true)
    const [lastFetchedListing,setLastFetchListing]=useState(null)

    const params = useParams()
    useEffect(()=>{
        const fetchListings = async()=>{
            try {
                // get reference
                const listingsRef = collection(db,'listing')
                // create a query
                const q =  query(
                    listingsRef,
                    where('type','==',params.categoryName),
                    orderBy('timestamp','desc'),
                    limit(5)
                )
                // excute query
                const querySnap = await getDocs(q)
                const lastVisible = querySnap.docs[querySnap.docs.length - 1]

                setLastFetchListing(lastVisible)

                let listing =[]
                querySnap.forEach((doc)=>{
                    return listing.push({
                        id:doc.id,
                        data:doc.data()
                    })
                })

                setListings(listing)
                setloading(false)
    
            } catch (error) {
                toast.error('couldn"t fetch listings')
            }
        }
    

        fetchListings()
    },[params.categoryName])


    const onFetchMoreListings = async()=>{
        try {
            // get reference
            const listingsRef = collection(db,'listing')
            // create a query
            console.log(lastFetchedListing)

            const q =  query(
                listingsRef,
                where('type','==',params.categoryName),
                orderBy('timestamp','desc'),
                startAfter(lastFetchedListing),
                limit(5)
            )
            // excute query
            const querySnap = await getDocs(q)
            
            const lastVisible = querySnap.docs[querySnap.docs.length-1]
            
            setLastFetchListing(lastVisible)

            let listing =[]
            querySnap.forEach((doc)=>{
                return listing.push({
                    id:doc.id,
                    data:doc.data()
                })
            })
            setListings((prevState)=> [...prevState,...listing])
            setloading(false)

        } catch (error) {
            toast.error('couldn"t fetch listing')
        }
    }


// More Load
  return (
    <div className='category'>
      <header className='pageHeader'>
        {params.categoryName==='rent'
            ? 'Places for rent'
            : 'Places for sale'}
      </header>
      
      {loading ? (<Spinner /> )
      : listings && listings.length > 0 ? 
      (<>
      <main>
        <ul className='categoryListings'>
            {
                listings.map((listing)=>(
                        <ListingItem listing={listing.data} id={listing.id} key={listing.id}/>
                    ))
            }
        </ul>
      </main>
      <br/>
      <br/>
      {lastFetchedListing&&(
        <p className='loadMore' onClick={onFetchMoreListings}>Load More</p>
      )}
      </>): (<p>No listing for {params.categoryName}</p>)}
    </div>
  )
}

export default Category
