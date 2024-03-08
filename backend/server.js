
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const productRouter = require('./routes/productRoutes');
const adminRouter = require('./routes/adminRoutes');
const auditLogRouter = require('./routes/auditLogRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/products',productRouter);
app.use('/admin', adminRouter);
app.use('/auditLog',auditLogRouter);


//Specify the port number
const PORT =3001;

mongoose.connect("mongodb://127.0.0.1:27017/ClothingStoreDashboard", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to the database");
});




app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})