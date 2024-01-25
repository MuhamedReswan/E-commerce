const express = require('express'); 
const app = express();
const path = require('path');
const flash = require('express-flash')



// data base connected
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/Ecommerce')
.then(() => {
    console.log("Mongo Db Connected");
}).catch((error) => {
    console.log(error);
});

app.use(flash());
app.use(express.static(path.join(__dirname,'public')));
// app.use('/user',express.static(path.join(__dirname,'public/user')));
app.use(express.static(path.join(__dirname,'public/user')));



// uer route 
const user_route = require('./router/userRoute');
app.use('/', user_route)


// app.get('/',(req, res)=>{
//     res.send("i am here")
// })


app.listen(3000,()=>{
    console.log(`http://localhost:3000`)
})