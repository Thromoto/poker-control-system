import { NavLink } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import "./Navbar.css";

function NavBarAdmin() {
  return (
    <nav>
      <NavLink to="/admin/adminhome">Home</ NavLink>
      <NavLink to="/admin/adminplayers">Info Players</ NavLink>
      <NavLink to="/admin/admininfos">Info Admins</ NavLink>
      <NavLink to="/admin/adminreport">Reports</NavLink>
      <NavLink to="/admin/adminreload">Reloads</NavLink>
      <NavLink to="/admin/adminwithdraw">Withdraws</NavLink>
      <NavLink to="/admin/adminpayments">Payments</NavLink>
      <NavLink to="/admin/admincaixa">Bank</NavLink>
      <LogoutButton />
    </nav>
  );
}

export default NavBarAdmin;
