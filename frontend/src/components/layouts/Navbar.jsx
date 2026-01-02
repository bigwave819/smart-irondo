import { useState, useRef, useEffect } from 'react'
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi"
import { FiChevronDown, FiUser, FiSettings, FiLogOut } from "react-icons/fi"
import SlideMenu from './sliderMenu'

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false)
  const [openProfile, setOpenProfile] = useState(false)
  const profileRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="flex items-center justify-between bg-white border-b border-gray-200/50 backdrop-blur-[20px] py-4 px-7 sticky top-0 z-30">
      
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <button
          className="block lg:hidden text-black"
          onClick={() => setOpenSideMenu(!openSideMenu)}
        >
          {openSideMenu ? (
            <HiOutlineX className="text-2xl" />
          ) : (
            <HiOutlineMenu className="text-2xl" />
          )}
        </button>

        <h2 className="text-lg font-bold text-black">
          SmartIrondo Console
        </h2>
      </div>

      {/* RIGHT - PROFILE */}
      <div className="relative" ref={profileRef}>
        <button
          onClick={() => setOpenProfile(!openProfile)}
          className="flex items-center gap-2 focus:outline-none"
        >
          <img
            src="https://via.placeholder.com/40"
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-100"
          />
          <FiChevronDown
            className={`text-gray-600 transition-transform ${
              openProfile ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* DROPDOWN */}
        {openProfile && (
          <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fadeIn">
            
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-800">
                Hirwa Tresor
              </p>
              <p className="text-xs text-gray-500">
                Administrator
              </p>
            </div>

            <button className="dropdown-item">
              <FiUser /> Profile
            </button>

            <button className="dropdown-item">
              <FiSettings /> Settings
            </button>

            <button className="dropdown-item text-red-600 hover:bg-red-50">
              <FiLogOut /> Logout
            </button>
          </div>
        )}
      </div>

      {/* MOBILE SIDE MENU */}
      {openSideMenu && (
        <div className="fixed top-18 left-0 bg-white shadow-xl z-40">
          <SlideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  )
}

export default Navbar
