const app = require("./src/app")
const connectDb = require("./src/config/db")
require("dotenv").config()

const startServer = async () => {

    const port = process.env.PORT;

    //connection to db
    await connectDb()

    //starting the server
    app.listen(port, () => {
        console.log(`server is running at ${port}`)
    })
}

startServer()