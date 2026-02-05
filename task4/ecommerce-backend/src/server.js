import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/dbConfig.js";

dotenv.config();
connectDB();

app.listen(process.env.PORT, () =>{
  console.log(`server running on port ${process.env.PORT}`);
});