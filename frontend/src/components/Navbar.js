import { NavLink } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import './Navbar.css';

function NavBar() {
    return (
      <nav>
        <NavLink to="/home">Home</NavLink>
        <NavLink to="/report">Report</NavLink>
        <NavLink to="/reload">Reload</NavLink>
        <NavLink to="/withdraw">Withdraw</NavLink>
        <NavLink to="/payment">Payment</NavLink>
        <LogoutButton />
      </nav>
    )
  }
  
  export default NavBar;