const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/;

const dataRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;

const validateRegister = (req, res, next) => {
  const { name, email, password, street, cpf, birthday, lastName, phone } =
    req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }
  if (!lastName) {
    return res.status(400).json({ message: "Last Name is required" });
  }
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Email must be valid" });
  }
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }
  if (!street) {
    return res.status(400).json({ message: "Street is required" });
  }
  if (!cpf) {
    return res.status(400).json({ message: "Cpf is required" });
  }
  if (!cpfRegex.test(cpf)) {
    return res.status(400).json({ message: "Cpf must be valid" });
  }
  if (!birthday) {
    return res.status(400).json({ message: "Birthday is required" });
  }
  if (!dataRegex.test(birthday)) {
    return res.status(400).json({ message: "Birthday must be valid" });
  }
  if (!phone) {
    return res.status(400).json({ message: "Phone is required" });
  }
  next();
};

export default validateRegister;
