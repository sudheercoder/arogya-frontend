import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Appcontext } from '../context/Appcontext';
export default function Doctors() {

	const { speciality } = useParams();

	//filter the doctors 
	const [filterdoc, setFilterDoc] = useState([]);
	const [showFilter, setShowfilter] = useState(false);

	//filter the doctors from appcontext
	const { doctors } = useContext(Appcontext);

	//usenavigate for booking appointmnet for specific doctor
	const navigate = useNavigate();

	//condition for doctors appointmnet 
	const applyfilter = () => {
		if (speciality) {
			setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
		} else {
			setFilterDoc(doctors)
		}
	}
	//useeefect for doctors and speciality
	useEffect(() => {
		applyfilter();
	}, [doctors, speciality]);


	return (
		<>
			<div>
				<p className='text-gray-600'>Browse through the doctors specialist.</p>
				<div className='flex flex-col sm:flex-row items-start gap-8 mt-6'>
					<button className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-[#5f6fff] text-white' : ''}`} onClick={() => setShowfilter(prev => !prev)}>Filters</button>
					<div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
						<p onClick={() => speciality === 'General physician' ? navigate('/doctors') : navigate('/doctors/General physician')} className={`w-[94vw] sm:w-auto pl-3 pr-16 border border-gray-300 py-3 text-center font-semibold rounded transition-all cursor-pointer ${speciality === "General physician" ? "bg-indigo-100 text-black" : ""}`}>General physician</p>

						<p onClick={() => speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')} className={`w-[94vw] sm:w-auto pl-3 pr-16 border border-gray-300 py-3 text-center font-semibold rounded transition-all cursor-pointer ${speciality === "Gynecologist" ? "bg-indigo-100 text-black" : ""}`}>Gynecologist</p>

						<p onClick={() => speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')} className={`w-[94vw] sm:w-auto pl-3 pr-16 border border-gray-300 py-3 text-center font-semibold rounded transition-all cursor-pointer ${speciality === "Dermatologist" ? "bg-indigo-100 text-black" : ""}`}>Dermatologist</p>

						<p onClick={() => speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')} className={`w-[94vw] sm:w-auto pl-3 pr-16 border border-gray-300 py-3 text-center font-semibold rounded transition-all cursor-pointer ${speciality === "Pediatricians" ? "bg-indigo-100 text-black" : ""}`}>Pediatricians</p>

						<p onClick={() => speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')} className={`w-[94vw] sm:w-auto pl-3 pr-16 border border-gray-300 py-3 text-center font-semibold rounded transition-all cursor-pointer ${speciality === "Neurologist" ? "bg-indigo-100 text-black" : ""}`}>Neurologist</p>

						<p onClick={() => speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} className={`w-[94vw] sm:w-auto pl-3 pr-16 border border-gray-300 py-3 text-center font-semibold rounded transition-all cursor-pointer ${speciality === "Gastroenterologist" ? "bg-indigo-100 text-black" : ""}`}>Gastroenterologist</p>
					</div>

					<div className='w-full grid md:grid-cols-4 gap-6 px-3 sm:px-0'>
						{
							filterdoc.length > 0 ? (
								filterdoc.map((item, index) => (
									<div onClick={() => navigate(`/appointment/${item._id}`)} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
										<img className='bg-blue-50 hover:bg-[#5f6fff] transition-all duration-300 ' src={item.image} alt="" />
										<div className='p-4'>
											<div className='flex items-center gap-2 text-sm text-center text-green-500'>
												<p className='w-2 h-2 bg-green-500 rounded-full'></p>
												<p>Available</p>
											</div>
											<p className='font-bold'>{item.name}</p>
											<p className='text-gray-500'>{item.speciality}</p>
										</div>
									</div>
								))
							) : (
								<p className='text-gray-500 text-lg col-span-4 text-center py-10'>No doctors found for this speciality.</p>
							)
						}
					</div>

				</div>
			</div>
		</>
	)
}
