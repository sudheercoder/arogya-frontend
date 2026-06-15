import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const Appcontext = createContext();

const AppcontextProvider = (props) => {
	const currencysymbol = '$';
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	const [doctors, setDoctors] = useState([]);
	const [token, setToken] = useState(localStorage.getItem('token') || false);
	const [userData, setUserData] = useState(false);

	const getDoctorsData = async () => {
		try {
			const { data } = await axios.get(backendUrl + '/api/admin/all-doctors');
			if (data.success) {
				setDoctors(data.doctors);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const loadUserProfileData = async () => {
		try {
			const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } });
			if (data.success) {
				setUserData(data.userData);
			} else {
				console.log(data.message);
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getDoctorsData();
	}, []);

	useEffect(() => {
		if (token) {
			loadUserProfileData();
		} else {
			setUserData(false);
		}
	}, [token]);

	const value = {
		doctors,
		currencysymbol,
		backendUrl,
		token,
		setToken,
		userData,
		setUserData,
		loadUserProfileData,
		getDoctorsData
	};
	return (
		<Appcontext.Provider value={value}>
			{props.children}
		</Appcontext.Provider>
	);
};
export default AppcontextProvider;