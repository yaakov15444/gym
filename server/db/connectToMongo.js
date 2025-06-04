const moongoose = require('mongoose');
const { uri } = require('../secrets/dotenv')
const connectToMongo = async () => {
    try {
        await moongoose.connect(uri)
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
connectToMongo()

module.exports = connectToMongo
