import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Profile from './pages/Profile'
import MyAppointment from './pages/MyAppointment'
import Appointment from './pages/Appointment'
import Contact from './pages/Contact'
import Navbar from './components/Navbar'
import './App.css'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function App() {
  return (
  <>
  <div className="mx-4 sm:mx-[10%]">
  <ToastContainer />
  <Navbar/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/my-profile' element={<Profile />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/my-appointment' element={<MyAppointment/>}/>
        <Route path='/appointment/:docId' element={<Appointment/>}/>
      </Routes>
			<Footer />
  </div>
      </>
  )
}

//import { Route, Routes } from 'react-router-dom'
//import AppRoute from './AppRoute/Approute'

// export default function App() {
//   return (
//     <>
//    <div className='mx-4 sm:mx-[10%]'>
      
//       <Routes>
//        {AppRoute.map((item,index)=><Route key={index} path={item.path} element={<item.Component/>}/>)}
//       </Routes>
//    </div>

//     </>
//   )
// }
