import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Explore from './pages/Explore';
import ForgetPassword from './pages/ForgetPassword';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn'
import NavBar from './component/NavBar';
import SignUp from './pages/SignUp';
import Category from './pages/Category';
import PrivateRoute from './component/PrivateRoute';
import CreateListing from './pages/CreateListing';
import Listing from './pages/Listing';
import Contact from './pages/Contact';
import EditListing from './pages/EditListing';


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Explore/>} />
          <Route path='/Offers' element={<Offers/>} />
          <Route path='category/:categoryName' element={<Category />}/>
          <Route path='/SignIn' element={<SignIn/>} />
          {/* <Route path='/SignIn' element={<SignIn/>} /> */}
          <Route path='/sign-up' element={<SignUp/>} />
          <Route path='/ForgetPassword' element={<ForgetPassword/>} />
          {/* <Route path='/profile' element={<Profile />}/> */}
          <Route path='/profile' element={<PrivateRoute/>}>
            <Route path='/profile' element={<Profile />}/>
          </Route>
          <Route path='/create-listing' element={<CreateListing />}/>
          <Route path='/category/:categoryName/:listingId' element={<Listing />}/>
          <Route path='/contact/:landlordId' element={<Contact/>}/>
          <Route path='/edit-listing/:listingId' element={<EditListing/>}/>
        </Routes>
        <NavBar />
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
