const Settings = require('../models/Settings');
const AdminLog = require('../models/AdminLog');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// @desc    Get all settings
// @route   GET /api/settings
// @access  Private (Admin only)
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = await Settings.create({});
    }
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private (Admin only)
const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }
    
    // Log the action
    await AdminLog.create({
      action: 'UPDATE_SETTINGS',
      description: 'System settings updated',
      performedBy: req.user.id
    });
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update hospital info
// @route   PUT /api/settings/hospital-info
// @access  Private (Admin only)
const updateHospitalInfo = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = await Settings.create({
        hospitalInfo: req.body
      });
    } else {
      settings.hospitalInfo = { ...settings.hospitalInfo, ...req.body };
      await settings.save();
    }
    
    // Log the action
    await AdminLog.create({
      action: 'UPDATE_HOSPITAL_INFO',
      description: 'Hospital information updated',
      performedBy: req.user.id
    });
    
    res.json({
      success: true,
      data: settings.hospitalInfo
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Backup database
// @route   POST /api/settings/backup
// @access  Private (Admin only)
const backupDatabase = async (req, res) => {
  try {
    const backupDir = path.join(__dirname, '../../backups');
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `backup-${timestamp}.json`);
    
    // This is a simplified backup - in production, use mongodump
    const collections = ['patients', 'doctors', 'appointments', 'users', 'bills', 'medicines'];
    const backupData = {};
    
    const mongoose = require('mongoose');
    
    for (const collection of collections) {
      const Model = mongoose.models[collection.charAt(0).toUpperCase() + collection.slice(1)] || 
                    require(`../models/${collection.charAt(0).toUpperCase() + collection.slice(1)}.js`);
      backupData[collection] = await Model.find({});
    }
    
    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
    
    // Update last backup timestamp
    let settings = await Settings.findOne();
    if (settings) {
      settings.backupSchedule.lastBackup = new Date();
      await settings.save();
    }
    
    // Log the action
    await AdminLog.create({
      action: 'BACKUP_DATABASE',
      description: `Database backup created: ${backupFile}`,
      performedBy: req.user.id
    });
    
    res.json({
      success: true,
      message: 'Backup created successfully',
      data: {
        backupFile,
        timestamp: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get activity logs
// @route   GET /api/settings/activity-logs
// @access  Private (Admin only)
const getActivityLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, action, user } = req.query;
    
    let query = {};
    if (action) {
      query.action = action;
    }
    if (user) {
      query.performedBy = user;
    }
    
    const skip = (page - 1) * limit;
    
    const logs = await AdminLog.find(query)
      .populate('performedBy', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await AdminLog.countDocuments(query);
    
    res.json({
      success: true,
      count: logs.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: logs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  updateHospitalInfo,
  backupDatabase,
  getActivityLogs
};
