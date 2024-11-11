const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors')
const authMiddleware = require('./middlewares/auth.js');

//Settings
require('dotenv').config()
app.use(cors())


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(()=>{

    app.listen(process.env.PORT, () => {
        console.log('Welcome to My Empire');
    });

})
.catch((err)=>console.log(err))

app.get("/",(req,res)=>{
    res.json("Server is Working Fine")
})

app.use('/graphql', authMiddleware ,graphqlHTTP({
    schema,
    graphiql: true
}));

