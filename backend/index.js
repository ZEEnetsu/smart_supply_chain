import "dotenv/config"; 
import connectDB from "./src/config/db.js";
import express from 'express'
const app = express();

const PORT  = process.env.PORT || 3000;

app.get('/',(req,res)=>{
    res.send(`{ server is running at port ${PORT}}`);
})

connectDB().then(
    app.listen(PORT,()=>{
    console.log(`{ server is running at port ${PORT}}`);
})
).catch((err)=>{
    console.log(`mongoDb connection failed : ${err}`);
})