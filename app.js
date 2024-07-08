import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
const allowedOrigins = ["https://main--magenta-cascaron-7d14cf.netlify.app"];

app.options("*", cors());

// const corsOptions = {
//   origin: 'https://main--magenta-cascaron-7d14cf.netlify.app',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true // This allows cookies to be sent with the request
// };
// app.use(cors(corsOptions));
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );
// app.use(cors());

app.use(
  cors({
    origin: "https://mern-blog-backend-n0da.onrender.com/api/v1",
    credentials: true, // This should be lowercase
  })
);
app.use(express.json());
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
