import express  from "express"
import mysql  from "mysql"
import dotenv  from "dotenv"
import cors from "cors"




import userRoute from './routes/user.js'
import authRoute from './routes/authroute.js'
import gameroute from './routes/gamesroute.js'

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors())




///using routes
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/games", gameroute);






////Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
  
  // Connect to database
  db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
    console.log('Connected to MySQL database');
  });






  ///websites server
  app.listen(5500,()=>{
    console.log("Connected to Backend..!!!");
})


export default db;