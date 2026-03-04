var express = require('express');
var router = express.Router();
const { dataRole, dataUser } = require('../utils/data2');

// GET all roles
router.get('/', function(req, res, next) {
  res.json({
    success: true,
    data: dataRole,
    message: 'Get all roles successfully'
  });
});

// GET role by id
router.get('/:id', function(req, res, next) {
  const role = dataRole.find(r => r.id === req.params.id);
  if (!role) {
    return res.status(404).json({
      success: false,
      message: 'Role not found'
    });
  }
  res.json({
    success: true,
    data: role,
    message: 'Get role successfully'
  });
});

// GET all users in a role
router.get('/:id/users', function(req, res, next) {
  const role = dataRole.find(r => r.id === req.params.id);
  if (!role) {
    return res.status(404).json({
      success: false,
      message: 'Role not found'
    });
  }

  const usersInRole = dataUser.filter(u => u.role && u.role.id === req.params.id);
  res.json({
    success: true,
    data: usersInRole,
    roleInfo: role,
    message: `Get all users in role ${role.name} successfully`,
    totalUsers: usersInRole.length
  });
});

// POST create new role
router.post('/', function(req, res, next) {
  const newRole = {
    id: req.body.id || 'r' + (dataRole.length + 1),
    name: req.body.name,
    description: req.body.description,
    creationAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Validation
  if (!newRole.name || !newRole.description) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: name, description'
    });
  }

  // Check if role id already exists
  if (dataRole.find(r => r.id === newRole.id)) {
    return res.status(400).json({
      success: false,
      message: 'Role id already exists'
    });
  }

  dataRole.push(newRole);
  res.status(201).json({
    success: true,
    data: newRole,
    message: 'Role created successfully'
  });
});

// PUT update role
router.put('/:id', function(req, res, next) {
  const role = dataRole.find(r => r.id === req.params.id);
  if (!role) {
    return res.status(404).json({
      success: false,
      message: 'Role not found'
    });
  }

  // Update fields
  if (req.body.name) role.name = req.body.name;
  if (req.body.description) role.description = req.body.description;
  
  role.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    data: role,
    message: 'Role updated successfully'
  });
});

// DELETE role
router.delete('/:id', function(req, res, next) {
  const index = dataRole.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Role not found'
    });
  }

  const deletedRole = dataRole.splice(index, 1);
  res.json({
    success: true,
    data: deletedRole[0],
    message: 'Role deleted successfully'
  });
});

module.exports = router;
