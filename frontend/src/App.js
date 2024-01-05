import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Control from "./components/Control";
import AdminPlayersPage from "./components/AdminPlayersPage";
import NavBar from "./components/Navbar";
import Reload from "./components/Reload";
import Withdraw from "./components/Withdraw";
import AdminReload from "./components/AdminReload";
import NavBarAdmin from "./components/NavBarAdmin";
import AdminWithdraw from "./components/AdminWithdraw";
import AdminPlayersInfo from "./components/AdminPlayersInfo";
import AdminPayments from "./components/AdminPayments";
import Payments from "./components/Payments";
import AdminInfo from "./components/AdminInfo";
import AdminHome from "./components/AdminHome";
import AdminCaixa from "./components/AdminCaixa";
import RequestResetPassword from "./components/RequestResetPassword";
import ResetPassword from "./components/ResetPassword";

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
