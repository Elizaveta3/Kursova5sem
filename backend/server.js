import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';


import {AccountController} from './controllers/index.js'

dotenv.config();

const app = express();

app.use(express.json());

app.post('/api/users/auth', AccountController.login);
app.post('/api/users/register', AccountController.register);
app.post('/api/users/logout', AccountController.logout);


app.get("/", (req,res) => {
    res.send("Server is ready");
})

app.listen(8086, () => {
    connectDB();
    console.log("Server started");
});