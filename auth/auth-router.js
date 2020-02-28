const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../api/config/secrets');
const USER = require('../api/users/modal');

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  };

  const options = {
    expiresIn: '3h'
  };

  return jwt.sign(payload, jwtSecret, options);
}

router.post('/register', (req, res) => {
  // implement registration
  let user = req.body;
  console.log(user, 'user');
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;
  USER.add(user)
    .then(saved => res.status(201).json(saved))
    .catch(err => res.status(500).json(err.message));
});

router.post('/login', (req, res) => {
  // implement login
  console.log(req.body);
  let { username, password } = req.body;
  if (username && password) {
    USER.findby({ username })
      .then(user => {
        console.log(user, 'USSSEERRR');
        if (user && bcrypt.compareSync(password, user.password)) {
          const token = generateToken(user);
          res.status(200).json({
            message: 'Login Successful',
            token
          });
        } else {
          res.status(500).json({ Error: 'Login error' });
        }
      })
      .catch(({ name, message, stack, code }) =>
        res.status(500).json({ name, message, stack, code })
      );
  } else {
    res.status(400).json({ message: 'invalid username or password' });
  }
});

module.exports = router;
