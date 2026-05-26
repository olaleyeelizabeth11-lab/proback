const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const userRoute = require('./routes/user.route')
const jobRoutes = require('./routes/job.route');
const applicationRoutes = require('./routes/application.route')
dotenv.config();

app.set("view engine", "ejs")
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 5555;
const URI = process.env.MONGODB_URI;

mongoose.connect(URI)
  .then(() => {
    console.log("Success! MongoDB is connected. ✅");
   
  })
  .catch(err => {
    console.error("MongoDB connection error: ❌", err);
});

app.get('/', (req, res) => {
    res.send("The Job Portal API is running...");
    console.log("The Job Portal API is running...")
});

app.post('/test', (req, res) => {
    res.send("Post is working!");
});



app.use('/user', require('./routes/user.route'));
app.use('/applications', require('./routes/application.route'));
// app.use('/jobs', require('./routes/job.route'));
app.use('/jobs', jobRoutes);

app.listen(port, ()=> {
    console.log(`I am runnng on port ${port}`)
    
})