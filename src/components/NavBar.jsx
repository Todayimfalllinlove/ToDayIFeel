import { Link } from "react-router-dom"
import useMediaQuery from "../hooks/useMediaQuery"
import { useState, useEffect } from "react"
import { Brain, Menu, X, Loader2 } from "lucide-react"
import DarkMode from "./DarkMode"
import useUser from "../hooks/useUser"
import { supabase } from "../js/supabaseClient"
import '../css/NavBar.css'

function NavBar() {
    const [isOpen, setIsOpen] = useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const { user, loading } = useUser()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        window.location.href = '/'
    }

    useEffect(() => {
        if (isDesktop) setIsOpen(false)
    }, [isDesktop])

    return (
        <div className="main-nav sticky top-0 z-50main-nav shadow-lg">
            <div className="container">
                <nav className="flex justify-between items-center px-4 py-4">
                    <div className="flex items-center gap-3 font-bold text-3xl">
                        <div className="img-logo w-10 h-10 rounded-xl flex items-center justify-center">
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <Link to='/' className="logo">TodayIFeel</Link>
                    </div>

                    {/* Desktop */}
                    <div className="hidden md:flex items-center gap-5 font-medium">
                        <Link to="/" className="nav-link">Home</Link>
                        <Link to="/About" className="nav-link">About</Link>
                        <Link to="/Dashboard" className="nav-link">Dashboard</Link>
                        <DarkMode />
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : user ? (
                            <button onClick={handleLogout} className="btn">Logout</button>
                        ) : (
                            <Link to="/Auth"><button className="btn">Login</button></Link>
                        )}
                    </div>

                    {/* Hamburger Menu */}
                    <div className="md:hidden flex items-center gap-5">
                        <DarkMode />
                        <button className="btn" onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </nav>

                {/* Mobile */}
                {isOpen && (
                    <div className="md:hidden px-4 pb-4 font-medium">
                        <ul className="flex flex-col gap-3">
                            <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
                            <Link to="/About" onClick={() => setIsOpen(false)}>About</Link>
                            <Link to="/Dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : user ? (
                                <button onClick={handleLogout} className="btn">Logout</button>
                            ) : (
                                <Link to="/Auth"><button className="btn">Login</button></Link>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

export default NavBar