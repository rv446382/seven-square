const User = require('../models/user.model');
const bcrypt = require('bcrypt');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { page = 1, limit = 5, search = '' } = req.query;

    const query = {
      isDeleted: false,
      name: { $regex: search, $options: 'i' }
    };

    const users = await User.find(query)
      .select('-password')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.json({
      totalUsers: total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      users
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, password } = req.body;
    let data = {};
    if (name) data.name = name;
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }
    if (req.file) {
      data.profileImage = req.file.filename;
    }

    const user = await User.findByIdAndUpdate(req.user.id, data, { new: true }).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.softDeleteUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.json({ message: 'User soft deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
