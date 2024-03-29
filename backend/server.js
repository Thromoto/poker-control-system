import express from "express";
import cors from "cors";
import db from "./src/database/db.js";
import routes from "./src/routes/routes.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use(routes);

db.then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch((error) => console.log(error));
