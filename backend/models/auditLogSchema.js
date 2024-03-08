const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  action: {
    type: String,
    required: true,
  },
  details: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
