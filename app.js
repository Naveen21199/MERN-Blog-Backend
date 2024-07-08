import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
const allowedOrigins = ["https://main--magenta-cascaron-7d14cf.netlify.app"];

app.options('*', cors(corsOptions));
// const corsOptions = {
//   origin: 'https://main--magenta-cascaron-7d14cf.netlify.app',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// };

// app.use(cors(corsOptions));
const corsOptionsDelegate = (req, callback) => {
  const allowedOrigins = ['http://localhost:5173', 'https://main--magenta-cascaron-7d14cf.netlify.app'];
  let corsOptions;
  if (allowedOrigins.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { 
      origin: true, 
      credentials: true, 
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

app.use(cors(corsOptionsDelegate));
app.use(express.json());
app.options('*', cors(corsOptionsDelegate));
app.use(cookieParser());

// imports
import authRoutes from "./routes/auth.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import imapgeuploadRoutes from "./routes/imageUpload.routes.js";

// rotuer
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/image", imapgeuploadRoutes);

app.get("/api/v1/blogcategories", async (req, res) => {
  const blogCategories = [
    "Technology Trends",
    "Health and Wellness",
    "Travel Destinations",
    "Food and Cooking",
    "Personal Finance",
    "Career Development",
    "Parenting Tips",
    "Self-Improvement",
    "Home Decor and DIY",
    "Book Reviews",
    "Environmental Sustainability",
    "Fitness and Exercise",
    "Movie and TV Show Reviews",
    "Entrepreneurship",
    "Mental Health",
    "Fashion and Style",
    "Hobby and Crafts",
    "Pet Care",
    "Education and Learning",
    "Sports and Recreation",
  ];
  res.json({
    message: "Categories fetched successfully",
    categories: blogCategories,
  });
});

export { app };
