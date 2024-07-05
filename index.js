import dotenv from "dotenv";
import connetDb from "./db/db.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

connetDb()
  .then(() => {
    app.listen(process.env.PORT || 8080);
    console.log(`Server is running at port : ${process.env.PORT}`);
  })
  .catch((err) => {
    console.log(`Mongodb connetion failed !!`, err);
  });
