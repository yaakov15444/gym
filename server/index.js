const express = require('express');
const app = express();
const path = require('path');

const { port } = require('./secrets/dotenv');
const cors = require('cors');
const cookieParser = require("cookie-parser");
require('./db/connectToMongo');
const router = require('./routes/indexRouter');
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} request to ${req.originalUrl}`);

    next();
});
app.use(router);
// app.use('/', express.static(path.join(__dirname, 'pictures')));


app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})