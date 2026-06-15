import React, { useContext, useEffect, useState } from 'react'
import { Appcontext } from '../context/Appcontext'
import { useNavigate } from 'react-router-dom';

export default function RelatedDoctors({ speciality, docId }) {
	//context
	const { doctors } = useContext(Appcontext);

	//state for doctors
	const [realtedDocs, setRelatedDocs] = useState([]);

	//navigate to appointment page
	const navigate = useNavigate()

	//use effect to filter related doctors
	useEffect(() => {
		if (doctors.length > 0 && speciality) {
			const doctorData = doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId);
			setRelatedDocs(doctorData);
		}
	}, [doctors, speciality, docId]);


	return (
		<>
			<div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
				<h1 className='text-3xl mt-0 md:mt-0 font-medium'>Related Doctors</h1>
				<p className='sm:w-1/2 text-center text-lg md:text-sm'>Simply browse through our extensive list of trusted doctors.</p>
				<div className='w-full grid md:grid-cols-5 gap-y-6 gap-4 px-3 sm:px-0'>
					{realtedDocs.slice(0,5).map((item, index) => (
						<div onClick={() => {navigate(`/appointment/${item._id}`);scrollTo(0,0)}} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
							<img className='bg-blue-50 ' src={item.image} alt="" />
							<div className='p-4'>
								<div className='flex items-center gap-2 text-sm text-center text-green-500'>
									<p className='w-2 h-2 bg-green-500 rounded-full'></p>
									<p>Available</p>
								</div>
								<p className='font-bold'>{item.name}</p>
								<p className='text-gray-500'>{item.speciality}</p>
							</div>
						</div>
					))}
				</div>
				 
			</div>
		</>
	)
}
