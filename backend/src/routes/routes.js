import { Router } from "express";
import authenticateToken from "../authenticateToken/auth.js";
import getUser from "../controllers/UserController.js";
import {
  deleteAdmin,
  deletePlayer,
  editPlayer,
  getAdmin,
  getAdminUsers,
} from "../controllers/AdminController.js";
import {
  editBanck,
  getBanck,
  saveBank,
} from "../controllers/BankController.js";
import {
  loginAdmin,
  postLogin,
  postRegister,
  postRegisterAdmin,
  requestReset,
  resetPassword,
} from "../controllers/LoginController.js";
import {
  adminEditPayments,
  getAdminPayments,
  getPayments,
  postPayments,
} from "../controllers/PaymentsController.js";
import {
  deleteReload,
  getAdminReload,
  getReload,
  getReloadAll,
  postReload,
  updateReload,
} from "../controllers/ReloadController.js";
import {
  getAdminReport,
  getReport,
  getReportIdPlayer,
  saveReport,
} from "../controllers/ReportController.js";
import { getTax, saveNewTax } from "../controllers/TaxController.js";
import {
  deleteWithdraw,
  getAdminWithdraw,
  getAllWithdraw,
  getWithdraw,
  saveWithdraw,
  updateAdminWithdrawStatus,
  updateWithdrawStatus,
} from "../controllers/WithdrawController.js";
import validateRegister from "../middlewares/validateRegister.js";

const routes = Router();

// UserControllerRoute
routes.get("/api/user", getUser);

//AdminControllerRoute
routes.get("/api/admin/players", authenticateToken, getAdminUsers);
routes.get("/api/admin/admin", authenticateToken, getAdmin);
routes.put("/api/admin/players/:playerId", authenticateToken, editPlayer);
routes.delete("/api/admin/players/:playerId", authenticateToken, deletePlayer);
routes.delete("/api/admin/admin/:adminId", authenticateToken, deleteAdmin);

//BanckController
routes.get("/api/bank", authenticateToken, getBanck);
routes.post("/api/bank", authenticateToken, saveBank);
routes.put("/api/bank/:id", authenticateToken, editBanck);

//LoginController
routes.post("/api/login", postLogin);
routes.post("/api/register", validateRegister, postRegister);
routes.post("/api/register-admin", postRegisterAdmin);
routes.post("/api/login-admin", loginAdmin);
routes.post("/api/request-reset-password", requestReset);
routes.post("/api/reset-password", resetPassword);

//PaymentsController
routes.post("/api/payment", authenticateToken, postPayments);
routes.get("/api/payment-requests", authenticateToken, getPayments);
routes.get("/api/admin/payment-requests", authenticateToken, getAdminPayments);
routes.put(
  "/api/admin/payment-requests/:requestId",
  authenticateToken,
  adminEditPayments
);

//ReloadController
routes.post("/api/reload", authenticateToken, postReload);
routes.get("/api/reload-requests/all", authenticateToken, getReloadAll);
routes.get("/api/reload-requests", authenticateToken, getReload);
routes.get("/api/admin/reload-requests", authenticateToken, getAdminReload);
routes.put(
  "/api/admin/reload-requests/:requestId",
  authenticateToken,
  updateReload
);
routes.delete(
  "/api/admin/reload-requests/:requestId",
  authenticateToken,
  deleteReload
);

//ReportController
routes.get("/api/report", authenticateToken, getReport);
routes.post("/api/report", authenticateToken, saveReport);
routes.get("/api/admin/report", authenticateToken, getAdminReport);
routes.get(
  "/api/admin/players/:playerId/reports",
  authenticateToken,
  getReportIdPlayer
);

//TaxController
routes.get("/api/tax", authenticateToken, getTax);
routes.post("/api/tax", authenticateToken, saveNewTax);

//WithdrawController
routes.get("/api/withdraw-requests/all", authenticateToken, getAllWithdraw);
routes.post("/api/withdraw", authenticateToken, saveWithdraw);
routes.get("/api/withdraw-requests", authenticateToken, getWithdraw);
routes.get("/api/admin/withdraw-requests", authenticateToken, getAdminWithdraw);
routes.put(
  "/api/admin/withdraw-requests/:requestId",
  authenticateToken,
  updateAdminWithdrawStatus
);
routes.put(
  "/api/withdraw/update-status/:withdrawId",
  authenticateToken,
  updateWithdrawStatus
);
routes.delete(
  "/api/admin/withdraw-requests/:requestId",
  authenticateToken,
  deleteWithdraw
);

export default routes;
