const express = require("express");
const AuditLog = require('../models/auditLogSchema');
const auditLogRouter = express.Router();

auditLogRouter.get('/', async (req, res) => {
    try {
      // Fetch all audit logs from the database
      const auditLogs = await AuditLog.find().populate('admin', ['staffId','firstName', 'lastName', 'profilePic']);
  
      // Respond with the audit logs
      res.json(auditLogs);
      console.log("auditLoG:",auditLogs);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  module.exports = auditLogRouter;