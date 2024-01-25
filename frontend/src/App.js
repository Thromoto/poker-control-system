import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/players/Login";
import Register from "./pages/players/Register";
import Home from "./pages/players/Home";
import Control from "./pages/players/Control";
import AdminPlayersPage from "./pages/admin/AdminPlayersPage";
import NavBar from "./components/Navbar";
import Reload from "./pages/players/Reload";
import Withdraw from "./pages/players/Withdraw";
import AdminReload from "./pages/admin/AdminReload";
import NavBarAdmin from "./components/NavBarAdmin";
import AdminWithdraw from "./pages/admin/AdminWithdraw";
import AdminPlayersInfo from "./pages/admin/AdminPlayersInfo";
import AdminPayments from "./pages/admin/AdminPayments";
import Payments from "./pages/players//Payments";
import AdminInfo from "./pages/admin/AdminInfo";
import AdminHome from "./pages/admin/AdminHome";
import AdminCaixa from "./pages/admin/AdminCaixa";
import RequestResetPassword from "./pages/players/RequestResetPassword";
import ResetPassword from "./pages/players/ResetPassword";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/request-reset-password"
            element={<RequestResetPassword />}
          />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route
            path="/*"
            element={
              <>
                <NavBar />
                <Routes>
                  <Route path="/home" element={<Home />} />
                  <Route path="/report" element={<Control />} />
                  <Route path="/reload" element={<Reload />} />
                  <Route path="/withdraw" element={<Withdraw />} />
                  <Route path="/payment" element={<Payments />} />
                </Routes>
              </>
            }
          />
          <Route
            path="/admin/*"
            element={
              <>
                <NavBarAdmin />
                <Routes>
                  <Route path="/adminhome" element={<AdminHome />} />
                  <Route path="/adminplayers" element={<AdminPlayersInfo />} />
                  <Route path="/adminreport" element={<AdminPlayersPage />} />
                  <Route path="/adminreload" element={<AdminReload />} />
                  <Route path="/adminwithdraw" element={<AdminWithdraw />} />
                  <Route path="/adminpayments" element={<AdminPayments />} />
                  <Route path="/admininfos" element={<AdminInfo />} />
                  <Route path="/admincaixa" element={<AdminCaixa />} />
                </Routes>
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
