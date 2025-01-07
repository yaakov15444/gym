const express = require('express');
const app = express();
const path = require('path');
const { port, base_url_client } = require('./secrets/dotenv');
const cors = require('cors');
const cookieParser = require("cookie-parser");
require('./db/connectToMongo');
const expireAnnouncements = require('./jobs/expireAnnouncements')();
const syncCourseParticipants = require('./jobs/syncCourseParticipants')();
const router = require('./routes/indexRouter');

const corsOptions = {
    origin: [base_url_client, "https://gym-one-gray-yaakov.vercel.app",
        "https://gym-oh9l7iwbh-yaakovs-projects-b65f313b.vercel.app/",
        "https://gym-yaakovs-projects-b65f313b.vercel.app/"
    ],
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} request to ${req.originalUrl}`);

    next();
});
app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.use(router);
// app.use('/', express.static(path.join(__dirname, 'pictures')));


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})