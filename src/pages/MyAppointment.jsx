import React, { useContext, useEffect, useState } from 'react'
import { Appcontext } from '../context/Appcontext';
import axios from 'axios';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';

export default function MyAppointmnet() {
	const { backendUrl, token, currencysymbol } = useContext(Appcontext);
	const [appointments, setAppointments] = useState([]);
	const [showPaymentModal, setShowPaymentModal] = useState(false);
	const [paymentQR, setPaymentQR] = useState('');
	const [selectedAppointment, setSelectedAppointment] = useState(null);
	const [paymentAmount, setPaymentAmount] = useState(0);

	const getUserAppointments = async () => {
		try {
			const { data } = await axios.post(backendUrl + '/api/user/appointments', {}, { headers: { token } });
			if (data.success) {
				setAppointments(data.appointments.reverse());
			} else {
				console.log('Error fetching appointments:', data.message);
			}
		} catch (error) {
			console.log('Error:', error);
		}
	};

	const handlePayOnline = async (appointmentId) => {
		try {
			const { data } = await axios.post(backendUrl + '/api/user/generate-qr',
				{ appointmentId },
				{ headers: { token } }
			);
			if (data.success) {
				setPaymentQR(data.qrCode);
				setPaymentAmount(data.amount);
				setSelectedAppointment(appointmentId);
				setShowPaymentModal(true);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	const handlePaymentSuccess = async () => {
		try {
			const { data } = await axios.post(backendUrl + '/api/user/verify-payment',
				{ appointmentId: selectedAppointment },
				{ headers: { token } }
			);
			if (data.success) {
				toast.success('Payment successful!');
				setShowPaymentModal(false);
				getUserAppointments();
				generateReceipt(data.appointment);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	const generateReceipt = (appointment) => {
		const doc = new jsPDF();
		const pageWidth = doc.internal.pageSize.getWidth();
		
		// Header with logo placeholder
		doc.setFillColor(95, 111, 255);
		doc.rect(0, 0, pageWidth, 40, 'F');
		
		// Logo text
		doc.setTextColor(255, 255, 255);
		doc.setFontSize(24);
		doc.setFont('helvetica', 'bold');
		doc.text('AAROGYA', pageWidth / 2, 20, { align: 'center' });
		doc.setFontSize(10);
		doc.text('Healthcare Services', pageWidth / 2, 28, { align: 'center' });
		
		// Receipt title
		doc.setTextColor(0, 0, 0);
		doc.setFontSize(18);
		doc.setFont('helvetica', 'bold');
		doc.text('PAYMENT RECEIPT', pageWidth / 2, 55, { align: 'center' });
		
		// Receipt details box
		doc.setDrawColor(95, 111, 255);
		doc.setLineWidth(0.5);
		doc.rect(15, 65, pageWidth - 30, 120);
		
		// Receipt content
		doc.setFontSize(11);
		doc.setFont('helvetica', 'normal');
		let yPos = 80;
		
		const addLine = (label, value) => {
			doc.setFont('helvetica', 'bold');
			doc.text(label, 25, yPos);
			doc.setFont('helvetica', 'normal');
			doc.text(value, 80, yPos);
			yPos += 10;
		};
		
		addLine('Receipt No:', `RCP${appointment._id.slice(-8).toUpperCase()}`);
		addLine('Date:', new Date().toLocaleDateString('en-IN'));
		addLine('Patient Name:', appointment.userData.name);
		addLine('Doctor Name:', appointment.docData.name);
		addLine('Speciality:', appointment.docData.speciality);
		addLine('Appointment Date:', appointment.slotDate);
		addLine('Appointment Time:', appointment.slotTime);
		
		// Amount section
		yPos += 5;
		doc.setDrawColor(200, 200, 200);
		doc.line(25, yPos, pageWidth - 25, yPos);
		yPos += 10;
		
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(12);
		doc.text('Consultation Fee:', 25, yPos);
		doc.text(`${currencysymbol}${appointment.amount}`, pageWidth - 25, yPos, { align: 'right' });
		
		// Payment status
		yPos += 15;
		doc.setFillColor(34, 197, 94);
		doc.roundedRect(25, yPos - 5, 50, 10, 2, 2, 'F');
		doc.setTextColor(255, 255, 255);
		doc.setFontSize(10);
		doc.text('PAID', 50, yPos + 2, { align: 'center' });
		
		// Footer
		doc.setTextColor(100, 100, 100);
		doc.setFontSize(9);
		doc.setFont('helvetica', 'italic');
		doc.text('Thank you for choosing Aarogya Healthcare Services', pageWidth / 2, 200, { align: 'center' });
		doc.text('For queries, contact: support@aarogya.com | +91-1800-XXX-XXXX', pageWidth / 2, 207, { align: 'center' });
		
		// Save PDF
		doc.save(`Receipt_${appointment._id.slice(-8)}.pdf`);
	};

	const cancelAppointment = async (appointmentId) => {
		try {
			const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment',
				{ appointmentId },
				{ headers: { token } }
			);
			if (data.success) {
				toast.success(data.message);
				getUserAppointments();
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	useEffect(() => {
		if (token) {
			getUserAppointments();
		}
	}, [token]);
		return (
			<>
				<div>
					<p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>
					<div>
						{appointments.length === 0 ? (
							<p className='text-center text-gray-500 mt-8'>No appointments found</p>
						) : (
							appointments.map((item, index) => (
								<div className='grid gap-4 grid-cols-[1fr_2fr] sm:flex sm:gap-6 py-2 border-b border-b-zinc-300' key={index}>
									<div>
										<img className='w-40 md:w-32 bg-indigo-100 rounded-lg' src={item.docData.image} alt="" />
									</div>
									<div className='flex-1 text-sm text-zinc-600'>
										<p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
										<p>{item.docData.speciality}</p>
										<p className='text-zinc-700 font-semibold mt-1'>Address:</p>
										<p className='text-xs'>{item.docData.address.line1}</p>
										<p className='text-xs'>{item.docData.address.line2}</p>
										<p className='text-xs mt-2'>
											<span className='text-xs text-neutral-900 font-medium'>Date & Time: </span>
											{item.slotDate} | {item.slotTime}
										</p>
										<p className='text-xs mt-1'>
											<span className='text-xs text-neutral-900 font-medium'>Amount: </span>
											{currencysymbol}{item.amount}
										</p>
										{item.isCompleted && (
											<p className='text-xs mt-2 inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold'>
												✓ Completed
											</p>
										)}
									</div>
									<div></div>
									<div className='flex flex-col gap-2 justify-end'>
										{!item.cancelled && !item.payment && (
											<button
												onClick={() => handlePayOnline(item._id)}
												className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded-xl hover:bg-[#5f6fff] hover:text-white cursor-pointer transition-all duration-300'
											>
												Pay Online
											</button>
										)}
										{item.payment && !item.cancelled && (
											<>
												<span className='text-sm text-green-600 text-center sm:min-w-48 py-2 border border-green-500 rounded-xl bg-green-50 font-semibold'>
													✓ Paid
												</span>
												<button
													onClick={() => generateReceipt(item)}
													className='text-sm text-white text-center sm:min-w-48 py-2 bg-[#5f6fff] rounded-xl hover:bg-[#4a56e8] cursor-pointer transition-all duration-300 flex items-center justify-center gap-2'
												>
													<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
														<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
													</svg>
													Download Receipt
												</button>
											</>
										)}
										{!item.cancelled && !item.payment && (
											<button
												onClick={() => cancelAppointment(item._id)}
												className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded-xl hover:bg-red-500 hover:text-white cursor-pointer transition-all duration-300'
											>
												Cancel Appointment
											</button>
										)}
										{item.cancelled && (
											<span className='text-sm text-red-600 text-center sm:min-w-48 py-2 border border-red-500 rounded-xl bg-red-50 font-semibold'>
												Cancelled
											</span>
										)}
									</div>
								</div>
							))
						)}
					</div>
				</div>

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
			</>
		)
	}