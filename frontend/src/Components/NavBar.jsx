import React, { useState } from 'react'
import { Link } from 'react-router-dom';

function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("expiryDate");
        localStorage.removeItem("uid");
        window.location.href = "/";
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div className="h-20 bg-orange-600 flex items-center justify-between px-6 shadow-lg relative">
            <div className="flex items-center">
                <img
                    src="/src/assets/FedExLogo.png"
                    alt="Logo"
                    className="rounded-full h-10 w-10 mr-3 border border-orange-300"
                />
                <div>
                    <span className="text-white font-bold text-lg">Pynapple Share</span>
                    <p className="text-sm text-white">Your File Sharing Companion</p>
                </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
                <Link
                    to="/home"
                    className="text-white text-sm font-medium border border-white rounded-full px-4 py-1 hover:bg-white hover:text-orange-800 transition duration-300 shadow-lg"
                >
                    Home
                </Link>
                <Link
                    to="/home/links"
                    className="text-white text-sm font-medium border border-white rounded-full px-4 py-1 hover:bg-white hover:text-orange-800 transition duration-300 shadow-lg"
                >
                    Links
                </Link>
                <button
                    onClick={handleLogout}
                    className="text-white text-sm font-medium border border-red-800 bg-red-700 rounded-full px-4 py-1 hover:bg-red-600 hover:from-red-600 hover:to-red-800 hover:text-white transition duration-300 transform hover:scale-105 shadow-lg"
                >
                    Logout
                </button>
            </div>
            <div className="flex md:hidden items-center">
                <button
                    onClick={toggleMenu}
                    className="text-white text-sm font-medium border border-white rounded-full px-3 py-1 hover:bg-white hover:text-orange-800 transition duration-300 shadow-lg"
                >
                    Menu
                </button>
                {menuOpen && (
                    <div className="absolute top-16 right-0 bg-white w-40 mt-2 rounded-lg shadow-lg overflow-hidden">
                        <Link
                            to="/home"
                            className="block px-4 py-2 text-gray-800 hover:bg-gray-200 transition duration-300"
                        >
                            Home
                        </Link>
                        <Link
                            to="/home/links"
                            className="block px-4 py-2 text-gray-800 hover:bg-gray-200 transition duration-300"
                        >
                            Links
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="block px-4 py-2 text-gray-800 hover:bg-gray-200 transition duration-300"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default NavBar;
