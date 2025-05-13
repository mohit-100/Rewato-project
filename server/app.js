import express from "express";
import dotenv from "dotenv";
import riderRoutes from "./Routes/RiderAuth.js"; // Import rider routes

dotenv.config();

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies

// Link the rider routes
app.use("/api/riders", riderRoutes);

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
