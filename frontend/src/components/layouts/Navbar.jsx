import { useState, useRef, useEffect } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { FiChevronDown, FiUser, FiSettings, FiLogOut } from "react-icons/fi";
import SlideMenu from "./sliderMenu";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const profileRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const initials =
    user?.fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-[72px] bg-white border-b border-gray-200 z-40 px-6 flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden"
            onClick={() => setOpenSideMenu(!openSideMenu)}
          >
            {openSideMenu ? (
              <HiOutlineX className="text-2xl" />
            ) : (
              <HiOutlineMenu className="text-2xl" />
            )}
          </button>

          <h2 className="text-lg font-bold">SmartIrondo Console</h2>
        </div>

        {/* RIGHT PROFILE */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setOpenProfile(!openProfile)}
            className="flex items-center gap-2"
          >
            {/* AVATAR FALLBACK */}
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              {initials}
            </div>

            <FiChevronDown
              className={`transition ${
                openProfile ? "rotate-180" : ""
              }`}
            />
          </button>

          {openProfile && (
            <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border overflow-hidden">
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-semibold">{user?.fullName || "User"}</p>
                <p className="text-xs text-gray-500">Administrator</p>
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
      </header>

      {/* MOBILE SIDEBAR OVERLAY */}
      {openSideMenu && (
        <div className="fixed inset-0 z-30 bg-black/30 lg:hidden">
          <div className="absolute left-0 top-[72px] w-72 h-[calc(100vh-72px)] bg-white shadow-xl">
            <SlideMenu activeMenu={activeMenu} />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
