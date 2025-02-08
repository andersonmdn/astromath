import './Navbar.css';
import { Title } from '../Title/Title';
import { SiStarship } from "react-icons/si";

export const Navbar = () => {
    return (
        <nav className="navbar" data-bs-theme="dark">
            <div className="container-fluid">
                <a className="navbar-brand d-flex align-items-center" href="#">
                    <SiStarship />
                    <Title />
                </a>
            </div>
        </nav>
    )
}