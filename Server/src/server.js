import { app } from "./app.js";
import connectDB from "./db/dbConnection.js";
import { createUser } from "./seeders/user.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 8080;
console.log(port);
connectDB()
  .then(() => {
    app.on("error", (err) => {
      console.log("server error ", err);
    });

    app.listen(port, () => {
      console.log(
        `server is running on  port ${port} and its link is http://localhost:${port}`
      );
    });
  })
  .catch((error) => {
    console.log("mongo Db connection failed  !!!!!", error);
  });

//  createUser(10);  to create a random user data using faker npm package
