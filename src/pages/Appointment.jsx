import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Appcontext } from '../context/Appcontext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function Appointment() {
	//days
	const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
	const { docId } = useParams();
	const { doctors, currencysymbol, backendUrl, token, userData } = useContext(Appcontext);
	const navigate = useNavigate();
	const [docInfo, setDocInfo] = useState(null);
	//slot booking
	const [docslot, setDocSlot] = useState([]);
	const [slotindex, setSlotIndex] = useState(0);
	const [slottime, setSlotTime] = useState('');
	const [showBookingForm, setShowBookingForm] = useState(false);
	const [showPaymentModal, setShowPaymentModal] = useState(false);
	const [paymentQR, setPaymentQR] = useState('');
	const [currentAppointmentId, setCurrentAppointmentId] = useState(null);
	const [paymentAmount, setPaymentAmount] = useState(0);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		address: '',
		age: ''
	});
	const fetchDocInfo = async () => {
		const docInfo = doctors.find((doc) => doc._id === docId);
		setDocInfo(docInfo);
	}

	const getAvailableSlot = async () => {
		setDocSlot([])
		//getting current date
		let today = new Date()

		for (let i = 0; i < 7; i++) {
			//getting daye with index

			let currentDate = new Date(today);
			currentDate.setDate(today.getDate() + i);

			//setting end time of the date

			let endTime = new Date();
			endTime.setDate(today.getDate() + i);
			endTime.setHours(21, 0, 0, 0);

			//setting hours

			if (today.getDate() === currentDate.getDate()) {
				currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
				currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
			} else {
				currentDate.setHours(10);
				currentDate.setMinutes(0);
			}

			let timeslot = [];

			while (currentDate < endTime) {
				let formattedTime = currentDate.toLocaleDateString([], { hour: '2-digit', minute: '2-digit', })
				//add slot to array

				timeslot.push({
					datetime: new Date(currentDate),
					time: formattedTime
				})

				//increament current time by 30 minutes

				currentDate.setMinutes(currentDate.getMinutes() + 30);
			}

			setDocSlot(prev => ([...prev, timeslot]));
		}
	}
	//use-effects

	useEffect(() => {
		fetchDocInfo();
	}, [doctors, docId]);

	useEffect(() => {
		getAvailableSlot();
	}, [docInfo]);

	useEffect(() => {
		if (userData) {
			setFormData({
				name: userData.name || '',
				email: userData.email || '',
				phone: userData.phone || '',
				address: userData.address?.line1 || '',
				age: ''
			});
		}
	}, [userData]);

	const handleBookingClick = () => {
		if (!token) {
			toast.error('Please login to book appointment');
			navigate('/login');
			return;
		}
		if (!slottime) {
			toast.error('Please select a time slot');
			return;
		}
		setShowBookingForm(true);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handlePayment = async () => {
		if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.age) {
			toast.error('Please fill all fields');
			return;
		}

		try {
			const date = docslot[slotindex][0].datetime;
			const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;

			const { data } = await axios.post(backendUrl + '/api/user/book-appointment', 
				{ docId, slotDate, slotTime: slottime },
				{ headers: { token } }
			);

			if (data.success) {
				setCurrentAppointmentId(data.appointmentId);
				const qrData = await axios.post(backendUrl + '/api/user/generate-qr',
					{ appointmentId: data.appointmentId },
					{ headers: { token } }
				);
				if (qrData.data.success) {
					setPaymentQR(qrData.data.qrCode);
					setPaymentAmount(qrData.data.amount);
					setShowBookingForm(false);
					setShowPaymentModal(true);
				}
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	const handlePaymentSuccess = async () => {
		try {
			const { data } = await axios.post(backendUrl + '/api/user/verify-payment',
				{ appointmentId: currentAppointmentId },
				{ headers: { token } }
			);
			if (data.success) {
				toast.success('Payment successful!');
				setShowPaymentModal(false);
				navigate('/my-appointment');
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	useEffect(() => {
		console.log(docslot);
	}, [docslot])
	return (
		<div>
			{/* ------------------------------doctors details------------------------------- */}

			<div className='flex flex-col sm:flex-row gap-4'>
				<div>
					<img className='bg-[#5f6fff] w-fit sm:max-w-72 rounded-lg' src={docInfo?.image} alt="" />
				</div>
				<div className='flex-1 border border-gray400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[0px] md:mt-0 sm:mt-0'>

					{/* ..................Doc Info name,degree,experiance.............................. */}

					<p className='flex gap-2 items-center text-2xl font-medium text-gray-900' >{docInfo?.name} <img className='w-5' src={assets.verified_icon} alt="" /></p>

					<div className='flex gap-2 text-sm text-gray-600 mt-1 items-center'>
						<p>{docInfo?.degree} - {docInfo?.speciality} </p>
						<button className='py-0.5 px-2 text-xs   border rounded-full'>{docInfo?.experience}</button>
					</div>

					{/* -----------------------Doctor About---------------------- */}

					<div className='mt-2'>
						<p className='flex gap-1  font-bold text-sm text-gray-900 mt-3 item-center'>About <img src={assets.info_icon} alt="" /></p>
						<p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo?.about}</p>
					</div>
					{/*------------------------------- appointment fees---------------------- */}
					<p className='text-gray-500 font-medium mt-4'>
						Appointment fees: <span className='font-bold text-black text-lg'>{currencysymbol}{docInfo?.fees}</span>
					</p>
				</div>
			</div>
			{/*-------------------Booking slots--------------------- */}
			<div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
				<p>Booking Slots</p>
				<div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
					{
						docslot.length && docslot.map((item, index) => (
							<div onClick={() => setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotindex === index ? 'bg-[#5f6fff] text-white' : 'border border-gray-200'}`} key={index}>

								<p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
								<p>{item[0] && item[0].datetime.getDate()}</p>
								<p></p>
							</div>
						))
					}
				</div>
				{/* ----------------time slots------------------ */}
				<div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
					{docslot.length && docslot[slotindex].map((item, index) => (
						<p onClick={() => setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slottime ? 'bg-[#5f6fff] text-white' : 'text-gray-400 border border-gray-300'}`} key={index}>
							{item.time.toLowerCase()}
						</p>
					))}
				</div>
				<button onClick={handleBookingClick} className='bg-[#5f6fff] text-white text-sm font-light px-14 py-3 rounded-full mt-4 cursor-pointer hover:bg-[#4a56e8] transition-all'>Book an Appointment</button>
			</div>

			{/* Booking Form Modal */}
			{showBookingForm && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
					<div className='bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl'>
						{/* Header */}
						<div className='bg-gradient-to-r from-[#5f6fff] to-[#4a56e8] p-6 rounded-t-2xl'>
							<div className='flex justify-between items-center'>
								<h2 className='text-2xl font-bold text-white'>Confirm Appointment</h2>
								<button onClick={() => setShowBookingForm(false)} className='text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all'>
									<svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
										<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
									</svg>
								</button>
							</div>
						</div>

						{/* Doctor Info Card */}
						<div className='p-6 border-b border-gray-200'>
							<div className='flex gap-4 items-center bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl'>
								<img className='w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg' src={docInfo?.image} alt='' />
								<div className='flex-1'>
									<h3 className='text-xl font-bold text-gray-800 flex items-center gap-2'>
										{docInfo?.name}
										<img className='w-5' src={assets.verified_icon} alt='' />
									</h3>
									<p className='text-gray-600 text-sm'>{docInfo?.speciality}</p>
									<p className='text-gray-500 text-xs mt-1'>{docInfo?.degree}</p>
								</div>
								<div className='text-right'>
									<p className='text-sm text-gray-600'>Appointment Fee</p>
									<p className='text-2xl font-bold text-[#5f6fff]'>{currencysymbol}{docInfo?.fees}</p>
								</div>
							</div>

							{/* Selected Slot */}
							<div className='mt-4 flex gap-4'>
								<div className='flex-1 bg-blue-50 p-3 rounded-lg'>
									<p className='text-xs text-gray-600 mb-1'>Selected Date</p>
									<p className='font-semibold text-gray-800'>
										{docslot[slotindex]?.[0] && `${daysOfWeek[docslot[slotindex][0].datetime.getDay()]}, ${docslot[slotindex][0].datetime.getDate()}/${docslot[slotindex][0].datetime.getMonth() + 1}/${docslot[slotindex][0].datetime.getFullYear()}`}
									</p>
								</div>
								<div className='flex-1 bg-purple-50 p-3 rounded-lg'>
									<p className='text-xs text-gray-600 mb-1'>Selected Time</p>
									<p className='font-semibold text-gray-800'>{slottime}</p>
								</div>
							</div>
						</div>

						{/* Form */}
						<div className='p-6'>
							<h3 className='text-lg font-semibold text-gray-800 mb-4'>Patient Details</h3>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>Full Name *</label>
									<input
										type='text'
										name='name'
										value={formData.name}
										onChange={handleInputChange}
										className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f6fff] focus:border-transparent outline-none transition-all'
										placeholder='Enter your name'
									/>
								</div>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>Email *</label>
									<input
										type='email'
										name='email'
										value={formData.email}
										onChange={handleInputChange}
										className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f6fff] focus:border-transparent outline-none transition-all'
										placeholder='Enter your email'
									/>
								</div>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>Phone Number *</label>
									<input
										type='tel'
										name='phone'
										value={formData.phone}
										onChange={handleInputChange}
										className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f6fff] focus:border-transparent outline-none transition-all'
										placeholder='Enter phone number'
									/>
								</div>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>Age *</label>
									<input
										type='number'
										name='age'
										value={formData.age}
										onChange={handleInputChange}
										className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f6fff] focus:border-transparent outline-none transition-all'
										placeholder='Enter your age'
									/>
								</div>
								<div className='md:col-span-2'>
									<label className='block text-sm font-medium text-gray-700 mb-2'>Address *</label>
									<textarea
										name='address'
										value={formData.address}
										onChange={handleInputChange}
										rows='3'
										className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f6fff] focus:border-transparent outline-none transition-all resize-none'
										placeholder='Enter your address'
									/>
								</div>
							</div>

							{/* Payment Section */}
							<div className='mt-6 bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border border-green-200'>
								<div className='flex items-center justify-between mb-3'>
									<h4 className='font-semibold text-gray-800'>Payment Summary</h4>
									<span className='text-2xl font-bold text-[#5f6fff]'>{currencysymbol}{docInfo?.fees}</span>
								</div>
								<p className='text-sm text-gray-600 mb-4'>Secure payment gateway powered by Razorpay</p>
								<button
									onClick={handlePayment}
									className='w-full bg-gradient-to-r from-[#5f6fff] to-[#4a56e8] text-white py-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all flex items-center justify-center gap-2'
								>
									<svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
										<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
									</svg>
									Proceed to Payment
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Payment QR Modal */}
			{showPaymentModal && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
					<div className='bg-white rounded-2xl max-w-md w-full shadow-2xl'>
						<div className='bg-gradient-to-r from-[#5f6fff] to-[#4a56e8] p-6 rounded-t-2xl'>
							<h2 className='text-2xl font-bold text-white text-center'>Scan to Pay</h2>
						</div>
						<div className='p-6 text-center'>
							<div className='bg-white border-4 border-[#5f6fff] rounded-xl p-4 inline-block mb-4'>
								<img src={paymentQR} alt='Payment QR' className='w-64 h-64' />
							</div>
							<div className='bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl mb-4'>
								<p className='text-sm text-gray-600 mb-2'>Amount to Pay</p>
								<p className='text-3xl font-bold text-[#5f6fff]'>{currencysymbol}{paymentAmount}</p>
								<p className='text-xs text-red-600 mt-2 font-semibold'>⚠️ Amount cannot be edited</p>
							</div>
							<p className='text-sm text-gray-600 mb-4'>Scan this QR code with any UPI app to complete payment</p>
							<button
								onClick={handlePaymentSuccess}
								className='w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all mb-2'
							>
								I have completed the payment
							</button>
							<button
								onClick={() => setShowPaymentModal(false)}
								className='w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all'
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
			{/* ----------------Listing Related Doctors------------------- */}

			<RelatedDoctors docId={docId} speciality={docInfo?.speciality} />
		</div>
	)
}
