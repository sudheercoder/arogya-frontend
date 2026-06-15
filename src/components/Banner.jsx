import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

export default function Banner() {
	const navigate = useNavigate()
	return (
		<>
			<div className='flex bg-[#5f6fff] rounded-xl px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10'>
				{/*------------------left side------------------------- */}
				<div className='flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5'>
					<div className='text-white text-xl font-semibold sm:text-2xl md:text-3xl lg:text-5xl'>
						<p>Book Appointment</p>
						<p className='mt-4'>With 100+ Trusted Doctors</p>
					</div>
					<button onClick={()=>{navigate("/login"); scrollTo(0,0)}} className='py-2 flex gap-2 px-8 text-black bg-blue-50 rounded-full mt-10 cursor-pointer hover:scale-105 transition-all duration-300'>Create account <img className='w-3' src={assets.arrow_icon} alt="" /></button>
				</div>

				{/*------------------right side------------------------- */}

				<div className='hidden md:block md:w-1/2 lg:w-[370px] relative'>
					<img className='w-full absolute bottom-0 right-0 max-w-md' src={assets.appointment_img} alt="" />
				</div>
			</div>
		</>
	)
}
