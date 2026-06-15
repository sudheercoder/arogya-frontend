import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom';

export default function Footer() {
	const year = new Date().getFullYear();
	const navigate = useNavigate();
	return (
		<>
			<div className="md:mx-10">
				<div className=' flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

					{/* left side */}
					<div className="">
						<img src={assets.logo} alt="" className='mb-5 w-40 mx-auto md:mx-0' />
						<div p className='w-full md:w-1/2 text-gray-600 leading-6'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque iusto nobis cumque. Laudantium consequuntur dicta esse adipisci maxime ducimus ipsam?

						</div>
					</div>

					{/* center side */}
					<div className="">
						<p className='text-xl text-center  font-medium mb-5'>COMPANY</p>
						<ul className='flex flex-col gap-2 text-center  text-gray-600'>
							<li className='cursor-pointer' onClick={() => { navigate('/'); scrollTo(0, 0) }}>Home</li>
							<li className='cursor-pointer' onClick={() => { navigate('/about'); scrollTo(0, 0) }}>About Us</li>
							<li className='cursor-pointer' onClick={() => { navigate('/contact'); scrollTo(0, 0) }}>Contact Us</li>
							<li className='cursor-pointer' onClick={() => { navigate(); scrollTo(0, 0) }}>Privacy Policy</li>
						</ul>
					</div>

					{/* right side */}
					<div className="">
						<p className='text-xl font-medium mb-5 text-center'>GET IN TOUCH</p>
						<ul className='flex flex-col gap-2 text-center text-gray-600'>
							<li>+91 9341283363</li>
							<li>info@aarogyawellness.com</li>
						</ul>
					</div>
				</div>
				{/* ----------copyright text--------------	 */}
				<div>
					<hr />
					<p className='text-center text-sm py-4 font-semibold'> &copy; {year} Aarogya Wellness. All rights reserved.</p>
				</div>
			</div>
		</>
	)
}
