import './Navbar.css';
import { Title } from '../Title/Title';
import { SiStarship } from "react-icons/si";

import { Link } from "react-router-dom";

export const Navbar = () => {
    return (
        <nav className="navbar" data-bs-theme="dark">
            <div className="container-fluid">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <SiStarship />
                    <Title />
                </Link>
            </div>
        </nav>
    )
}