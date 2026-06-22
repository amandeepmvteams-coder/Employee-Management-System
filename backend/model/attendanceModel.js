const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    checkIn: {
      type: String,
      default: "",
    },

    checkOut: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Present", "Absent", "Leave"],
      default: "Present",
    },

    leaveType: {
      type: String,
      enum: ["Sick", "Casual", "Paid", "Unpaid", "Other"],
      default: undefined,
    },

    workDuration: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
