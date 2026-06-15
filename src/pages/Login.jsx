import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Appcontext } from '../context/Appcontext'

export default function Login() {
	const navigate = useNavigate();
	const { backendUrl, token, setToken } = useContext(Appcontext);

	//states
	const [state, setState] = useState('Login');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');

	//formhandle-submit
	const onSubmitHandler = async (e) => {
		e.preventDefault();

		try {
			if (state === 'Sign Up') {
				const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password });
				if (data.success) {
					toast.success(data.message);
					setState('Login');
					setName('');
					setEmail('');
					setPassword('');
				} else {
					toast.error(data.message);
				}
			} else {
				const { data } = await axios.post(backendUrl + '/api/user/login', { email, password });
				if (data.success) {
					localStorage.setItem('token', data.token);
					setToken(data.token);
					toast.success(data.message);
					navigate('/');
				} else {
					toast.error(data.message);
				}
			}
		} catch (error) {
			toast.error(error.message);
		}
	}

	return (
		<>
			<form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
				<div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-900 text-sm shadow-lg'>
					<p className='text-2xl font-semibold'>{state === 'Sign Up' ? "Create Account" : "Login"}</p>
					<p>Please {state === 'Sign Up' ? "Sign Up" : "Sign In"} to book appointment</p>
					{
						state === "Sign Up" &&
						<div className='w-full'>
							<p>Full Name</p>
							<input className='border border-zinc-300 rounded w-full p-2 ' type="text" onChange={(e) => setName(e.target.value)} value={name} required />
						</div>
					}


					<div className='w-full'>
						<p>Email</p>
						<input className='border border-zinc-300 rounded w-full p-2 ' type="email" onChange={(e) => setEmail(e.target.value)} value={email} required />
					</div>

					<div className='w-full'>
						<p>Password</p>
						<input className='border border-zinc-300 rounded w-full p-2 ' type="password" onChange={(e) => setPassword(e.target.value)} value={password} required />
					</div>
					<button className='bg-[#5f6fff] text-white w-full py-2 rounded-md text-base cursor-pointer' type='submit'>{state === 'Sign Up' ? "Create Account" : "Login"}</button>

					{
						state === "Sign Up"
							? <p>Already have an account?<span onClick={() => setState('Login')} className='text-[#5f6fff] font-semibold cursor-pointer'>Login</span></p>
							: <p>Don't have an account?<span onClick={() => setState('Sign Up')} className='text-[#5f6fff] font-semibold cursor-pointer'> Sign Up</span></p>
					}
				</div>
			</form>
		</>
	)
}
