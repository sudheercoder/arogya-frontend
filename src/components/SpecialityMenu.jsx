import { Link } from "react-router-dom"
import { assets, specialityData } from "../assets/assets"

export default function SpecialityMenu() {
	return (
		<>
			<div id='speciality' className="flex flex-col items-center gap-4 py-16 text-gray-800">
				<h1 className="text-3xl font-medium">Find by Speciality</h1>
				<p className="w-1/3 text-center md:text-sm text-xl">Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita suscipit nesciunt, inventore soluta eos veritatis? </p>
				<div className="md:flex  mt-4 md:mt-0 gap-5 justify-between sm:justify-center md:gap-4 overflow-scroll">
					{
						specialityData.map((item, index) => (
							<Link onClick={() => scrollTo(0, 0)} className="flex flex-col items-center z-10 text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500 " key={index} to={`/doctors/${item.speciality}`}>
								<img className="w-30 md:w-24 mb-0 md:mb-2" src={item.image} alt="" />
								<p className="text-center text-xl md:text-sm">{item.speciality}</p>
							</Link>
						))
					}
				</div>
			</div>
		</>
	)
}
