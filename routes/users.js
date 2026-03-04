var express = require('express');
var router = express.Router();
const { dataUser } = require('../utils/data2');

// GET all users
router.get('/', function(req, res, next) {
  res.json({
    success: true,
    data: dataUser,
    message: 'Get all users successfully'
  });
});

// GET user by username
router.get('/:username', function(req, res, next) {
  const user = dataUser.find(u => u.username === req.params.username);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  res.json({
    success: true,
    data: user,
    message: 'Get user successfully'
  });
});

// POST create new user
router.post('/', function(req, res, next) {
  const newUser = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    fullName: req.body.fullName,
    avatarUrl: req.body.avatarUrl || 'https://i.sstatic.net/l60Hf.png',
    status: req.body.status !== undefined ? req.body.status : true,
    loginCount: req.body.loginCount || 0,
    role: req.body.role,
    creationAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Validation
  if (!newUser.username || !newUser.password || !newUser.email || !newUser.fullName || !newUser.role) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: username, password, email, fullName, role'
    });
  }

  // Check if username already exists
  if (dataUser.find(u => u.username === newUser.username)) {
    return res.status(400).json({
      success: false,
      message: 'Username already exists'
    });
  }

  dataUser.push(newUser);
  res.status(201).json({
    success: true,
    data: newUser,
    message: 'User created successfully'
  });
});

// PUT update user
router.put('/:username', function(req, res, next) {
  const user = dataUser.find(u => u.username === req.params.username);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Update fields
  if (req.body.password) user.password = req.body.password;
  if (req.body.email) user.email = req.body.email;
  if (req.body.fullName) user.fullName = req.body.fullName;
  if (req.body.avatarUrl) user.avatarUrl = req.body.avatarUrl;
  if (req.body.status !== undefined) user.status = req.body.status;
  if (req.body.loginCount !== undefined) user.loginCount = req.body.loginCount;
  if (req.body.role) user.role = req.body.role;
  
  user.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    data: user,
    message: 'User updated successfully'
  });
});

// DELETE user
router.delete('/:username', function(req, res, next) {
  const index = dataUser.findIndex(u => u.username === req.params.username);
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  const deletedUser = dataUser.splice(index, 1);
  res.json({
    success: true,
    data: deletedUser[0],
    message: 'User deleted successfully'
  });
});

module.exports = router;
