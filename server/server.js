import express from 'express';
import { auth } from 'express-openid-connect';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import  connect  from './db/connect.js';
import asyncHandler from 'express-async-handler';
import User from './models/UserModel.js';
import fs from 'fs';
import { Session } from 'inspector/promises';
dotenv.config();

// console.log('Server-side code running');
const app = express();
// const port = 8080;

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  routes: {
    postLogoutRedirect: process.env.CLIENT_URL,
    callback: "/callback",
    logout: "/logout",
    login: "/login",
  },

  // session: {
  //   absoluteDuration: 30 * 24 * 60 * 60 * 1000, // 30days
  //   cookie: {
  //     domain: '',
  //     secure: true,
  //     sameSite: 'None',
  //   } 
  // }

};

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true, // This is important to allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

//function to check if user is exists in the database or not
const ensureUserInDB = asyncHandler(async (user) => {
  try {
    const existingUser = await User.findOne({ auth0Id: user.sub });

    if (!existingUser) {
      //create a new user if not exists
      const newUser = await User({
        name: user.name,
        email: user.email,
        auth0Id: user.sub,
        role: "jobseeker",
        profilePicture: user.picture,
      });
      
      await newUser.save();

      console.log("New user created in DB:", user);
    } else{
      console.log("User already exists in DB:", existingUser);
    }
  }
  catch(error){
    console.log("Error checking user in DB or not:", error.message);
    throw new Error("Database error");
  }
});

app.get("/", async(req, res) => {
  if(req.oidc.isAuthenticated()){
    //check if Auth0 user exists in the database
    await ensureUserInDB(req.oidc.user);

    //redirect to the frontend
    return res.redirect(process.env.CLIENT_URL);
  } else{
    return res.send("Logged out");
  }
});

//to check the connection with endpoint is okay over postman
// app.get("/random",(req,res) => {
//   res.json({random: Math.random()});
// });

// req.isAuthenticated is provided from the auth router
// app.get('/', (req, res) => {
//   res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
// });

// //listening to the port
// app.listen(port, () => {
//   console.log(`Server listening on port on ${port}` );
// });

//routes
const routeFiles = fs.readdirSync("./routes");

routeFiles.forEach((file) => {
  // import dynamic routes
  import(`./routes/${file}`)
    .then((route) => {
      app.use("/api/v1/",route.default);
    })
    .catch((error) => {
      console.log("Error importing route", error);
    });
});

const server = async () => {
  try {
    await connect();
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log('Error starting server:', error.message);
    process.exit(1);
  }
};

server();
