import express  from "express"
import mysql  from "mysql"
import dotenv  from "dotenv"
import cors from "cors"
import pkg from "pg"




import userRoute from './routes/user.js'
import authRoute from './routes/authroute.js'
import gameroute from './routes/gamesroute.js'
import quizroute from './routes/quizroute.js'
import scoreroute from './routes/gamescoreroute.js'

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors())




///using routes
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/games", gameroute);
app.use("/api/quiz", quizroute);
app.use("/api/gamesscore", scoreroute)






const { Pool } = pkg;
const db = new Pool({
  host: process.env.PG_HOST,
  // port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  ssl: {
    rejectUnauthorized: false  // Important for Neon
  }
});

db.connect((err, client, release) => {
  if (err) {
    console.error('❌ Failed to connect to Neon:', err.stack);
  } else {
    console.log('✅ Connected to Neon PostgreSQL successfully!');
    release();
  }
});


app.get('/', (req,res)=>{
  res.json("hello")
})


  ///websites server
  app.listen(5500,()=>{
    console.log("Connected to Backend..!!!");
})


export default db;