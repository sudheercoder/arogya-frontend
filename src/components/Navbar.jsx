import { useState, useContext } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Appcontext } from '../context/AppContext';

export default function Navbar() {
	const navigate = useNavigate();
	const [showMenu, setShowMenu] = useState(false);
	const { token, setToken } = useContext(Appcontext);
	const [showDropdown, setShowDropdown] = useState(false);

	return (
		<>
			<div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
				{/* Logo */}
				<img
					onClick={() => navigate('/')}
					className="w-44 cursor-pointer"
					src={assets.logo}
					alt=""
				/>

				{/* Main links (desktop only) */}
				<ul className="hidden md:flex gap-5 items-start font-medium">
					<NavLink to="/">
						<li className="py-1 hover:scale-105">HOME</li>
						<hr className="border-none outline-none h-0.5 bg-[#5f6fff] m-auto hidden" />
					</NavLink>
					<NavLink to="/doctors">
						<li className="py-1 hover:scale-105">All Doctors</li>
						<hr className="border-none outline-none h-0.5 bg-[#5f6fff] m-auto hidden" />
					</NavLink>
					<NavLink to="/about">
						<li className="py-1 hover:scale-105">About Us</li>
						<hr className="border-none outline-none h-0.5 bg-[#5f6fff] m-auto hidden" />
					</NavLink>
					<NavLink to="/contact">
						<li className="py-1 hover:scale-105">Contact Us</li>
						<hr className="border-none outline-none h-0.5 bg-[#5f6fff] m-auto hidden" />
					</NavLink>
				</ul>

				{/* Profile / Login */}
				<div className="flex items-center gap-4 relative">
					{token ? (
						<div
							className="flex items-center gap-2 cursor-pointer relative"
							onClick={() => setShowDropdown(!showDropdown)} // toggle dropdown on tap
						>
							<img className="w-8 rounded-full" src={assets.profile_pic} alt="" />
							<img className="w-2.5" src={assets.dropdown_icon} alt="" />

							{/* Dropdown menu */}
							{showDropdown && (
								<div className="absolute top-10	 right-[-40px]  left-0.1 bg-gray-200 min-w-40 rounded flex flex-col gap-4 p-4 text-base font-medium text-gray-600 z-20">
									<p
										onClick={() => {
											navigate('/my-profile');
											setShowDropdown(false);
										}}
										className="hover:text-blue-700 cursor-pointer"
									>
										My Profile
									</p>
									<p
										onClick={() => {
											navigate('/my-appointment');
											setShowDropdown(false);
										}}
										className="hover:text-blue-700 cursor-pointer"
									>
										My Appointment
									</p>
									<p
										onClick={() => {
											Swal.fire({
												title: 'Are you sure?',
												text: 'Do you want to logout?',
												icon: 'warning',
												showCancelButton: true,
												confirmButtonColor: '#5f6fff',
												cancelButtonColor: '#d33',
												confirmButtonText: 'Yes, logout!'
											}).then((result) => {
												if (result.isConfirmed) {
													localStorage.removeItem('token');
													setToken(false);
													setShowDropdown(false);
													navigate('/login');
												}
											});
										}}
										className="hover:text-blue-700 cursor-pointer"
									>
										Logout
									</p>
								</div>
							)}
						</div>
					) : (
						<button
							onClick={() => navigate('/login')}
							className="py-2 rounded-full font-light hidden md:block text-white px-8 bg-[#5f6fff] cursor-pointer"
						>
							Create account
						</button>
					)}

					{/* Mobile menu icon */}
					<img
						onClick={() => setShowMenu(true)}
						className="w-6 md:hidden"
						src={assets.menu_icon}
						alt=""
					/>

					{/* Mobile Menu */}
					<div
						className={`${showMenu ? 'fixed w-full' : 'h-0 w-0'
							} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
					>
						<div className="flex items-center justify-between">
							<img
								className="w-36 mt-2 ml-2"
								onClick={() => {
									navigate('/');
									setShowMenu(false);
								}}
								src={assets.logo}
								alt=""
							/>
							<img
								className="w-7 mr-3"
								onClick={() => setShowMenu(false)}
								src={assets.cross_icon}
								alt=""
							/>
						</div>
						<ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
							<NavLink onClick={() => setShowMenu(false)} to="/">
								<p className="px-4 rounded-full inline-block">Home</p>
							</NavLink>
							<NavLink onClick={() => setShowMenu(false)} to="/doctors">
								<p className="px-4 rounded-full inline-block">All Doctors</p>
							</NavLink>
							<NavLink onClick={() => setShowMenu(false)} to="/about">
								<p className="px-4 rounded-full inline-block">About Us</p>
							</NavLink>
							<NavLink onClick={() => setShowMenu(false)} to="/contact">
								<p className="px-4 rounded-full inline-block">Contact Us</p>
							</NavLink>
						</ul>
					</div>
				</div>
			</div>
		</>
	);
}
