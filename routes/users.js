var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user')
var router = express.Router();
var passport = require('passport');



router.use(bodyParser.json());
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});



router.post('/signup', (req, res, next) => {
  User.register(new User({ username: req.body.username }),
    req.body.password, (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err: err });
      }
      else {
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({ status: "Registration Successful", success: true });
        });
      }//else error
    }// register callback
  )// register
}// post call back
); //post


router.post('/login',
  passport.authenticate('local'),
  (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ status: "You are successfully Logged In!", success: true });
  });


// router.post('/login', (req, res, next) => {
//   if (!req.session.user) {
//     // expect user to authenticate him/herself
//     var authHeader = req.headers.authorization;
//     console.log(authHeader);
//     if (!authHeader) {
//       var err = new Error('You are not authenticated!')
//       res.setHeader("WWW-Authenticate", "Basic");
//       err.status = 401;
//       return next(err);
//     }

//     var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');

//     var username = auth[0];
//     var password = auth[1];

//     // find one to see it exists or not
//     User.findOne({ username: username })
//       .then((user) => {
//         if (user === null) {
//           var err = new Error('User ' + username + ' does not exist');
//           err.status = 403;
//           return next(err);
//         }
//         else if (user.password !== password) {
//           var err = new Error('Your password is incorrect!')
//           err.status = 403;
//           return next(err);
//         }
//         else if (user.username === username && user.password === password) {
//           req.session.user = "authenticated";
//           res.statusCode = 200;
//           res.setHeader('Content-Type', 'text/plain');
//           res.end("You are authenticated!");
//           next()
//         };
//       })
//       .catch((err) => {
//         next(err);
//       })
//   }
//   else {
//     // req.session.user is not null, valid session
//     res.statusCode = 200;
//     res.setHeader('Content-Type', "text/plain");
//     res.end('You are already authenticated!');
//   }
// })

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy(); // remove session information on the server side
    res.clearCookie('session-id');
    res.redirect('/') // return to homepage
  }
  else {
    var err = new Error("You are not login!");
    err.status = 403;
    next(err);
  }
})



module.exports = router;