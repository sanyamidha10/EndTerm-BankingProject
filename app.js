const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const alert = require('alert');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine', 'ejs');

app.use(express.static('public'));


// ----------------Mongoose-----------------

mongoose.connect('mongodb://localhost:27017/endtermproject').then(() => console.warn('db connection done'))

const usersSchema = {
    name : String,
    email : String,
    balance : Number,
    accountNo : Number
}

const User = mongoose.model('User', usersSchema);

const user1 = new User({
    name: "Sanya Midha",
    email: "sanyamidha.10@gmail.com",
    balance: 100000,
    accountNo: 10021
})

const user2 = new User({
    name: "Shruti Bansal",
    email: "shruti@gmail.com",
    balance: 100000,
    accountNo: 10022
})

const user3 = new User({
    name: "Vikram",
    email: "vik@gmail.com",
    balance: 100000,
    accountNo: 10023
})

const user4 = new User({
    name: "Happy",
    email: "happy@gmail.com",
    balance: 100000,
    accountNo: 10024
})

const user5 = new User({
    name: "Shreya",
    email: "shreya@gmail.com",
    balance: 100000,
    accountNo: 10025
})

const user6 = new User({
    name: "Satyam",
    email: "satyam@gmail.com",
    balance: 100000,
    accountNo: 10026
})

const userArray = [user1, user2, user3, user4, user5, user6];


// -------x--------Mongoose-------x---------



// ------------------Date-----------------

var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
var today  = new Date();
let day = today.toLocaleDateString("en-US", options);

// ---------x--------Date-------x---------



const history = [];
let amount = 0;


app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
})

app.get('/get-started', (req, res) => {
    
    User.find({}, (err, foundUsers) => {
        if(foundUsers.length === 0) {
            User.insertMany(userArray, (err) => {
                if(err) console.log(err);
            })
        } else {
            res.render('get-started', {
                balance : foundUsers[0].balance
            })
        }
    } )
    
})

app.get('/add', (req, res) => {
    User.find({}, (err, foundUsers) => {
        res.render('add', {
            balance: foundUsers[0].balance
        })
    })
})



app.get('/transaction', (req, res) => {
    
    User.find({}, (err, foundUsers) => {
        if(foundUsers.length === 0) {
            User.insertMany(userArray, (err) => {

            })
        } else {
            res.render('transaction', {
                users : foundUsers,
                balance : foundUsers[0].balance 
            })
        }
    } )

})

app.get('/members', (req, res) => {

    User.find({}, (err, foundUsers) => {
        if(foundUsers.length === 0) {
            User.insertMany(userArray, (err) => {

            })

            res.redirect('/members');
        } else {

            res.render('members', {
                users : foundUsers,
                balance : foundUsers[0].balance 
            })
        }
    } )

})

app.post('/trans-money', (req, res) => {

    amount = Number(req.body.amount);

    User.find({}, (err, foundUsers) => {
        if(foundUsers.length === 0) {
            User.insertMany(userArray, (err) => {

            })
        } else {
            
            if(amount > foundUsers[0].balance) {
                alert('Failed! Not enough balance')
                res.redirect('/transaction');
            }

            else {
                foundUsers[0].balance -= amount;

                foundUsers[0].save();

            User.findById(req.body.select, (err, found) => {
                found.balance += amount;
                found.save();
                history.push({
                    sender : foundUsers[0].name,
                    receiver : found.name,
                    amount : amount,
                    date : day
                })
            })

            alert('successful')
            res.render('get-started', {
                balance : foundUsers[0].balance
            })
            }

        }
    } )

  
})

app.post('/members', (req, res) => {
  
    User.find({}, (err, foundUsers) => {
        if(foundUsers.length === 0) {
            User.insertMany(userArray, (err) => {
                console.log(err);
            })
        } else {

            let newuser = new User({
                name : req.body.name,
                email : req.body.email,
                balance : Number(req.body.balance),
                accountNo : Number(req.body.account)
            })
           newuser.save();

           res.redirect('/members');

        }
    } )

})

app.post('/addmoney', (req, res) => {
  
    User.find({}, (err, foundUsers) => {
        if(foundUsers.length === 0) {
            User.insertMany(userArray, (err) => {
                console.log(err);
            })
        } else {
            foundUsers[0].balance += Number(req.body.money);
            foundUsers[0].save();
           res.redirect('/members');

        }
    } )

})

app.get('/add-money', (req, res) => {
    console.log("enter function");
    User.find({}, (err, foundUsers) => {
        if(foundUsers.length === 0) {
            User.insertMany(userArray, (err) => {

            })
        } else {
            res.render('add-money', {
                balance : foundUsers[0].balance 
            })
        }
    } )
})

app.get('/transaction-history', (req, res) => {
    User.find({}, (err, foundUsers) => {
        if(foundUsers.length === 0) {
            User.insertMany(userArray, (err) => {

            })
        } else {
            res.render('history', {
                history : history,
                balance : foundUsers[0].balance 
            })
        }
    } )

})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);