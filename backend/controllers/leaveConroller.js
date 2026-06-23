const User = require("../model/userModel");
const Attendance = require("../model/attendanceModel");
const Leave = require("../model/leaveModel");

exports.addLeave = async (req, res) => {
  try {
    const { employee, startDate, endDate, leaveType, reason } = req.body;

    if (!employee || !leaveType || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      return res.status(400).json({
        success: false,
        message: "End date cannot be before start date",
      });
    }

    // Calculate leave days excluding weekends
    let totalDays = 0;

    for (
      let current = new Date(start);
      current <= end;
      current.setDate(current.getDate() + 1)
    ) {
      const day = current.getDay();

      if (day !== 0 && day !== 6) {
        totalDays++;
      }
    }

    // Prevent leave request if selected range contains only weekends
    if (totalDays === 0) {
      return res.status(400).json({
        success: false,
        message: "Selected dates contain only weekends",
      });
    }

    // Employee validation
    const employeeExists = await User.findById(employee);

    if (!employeeExists) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Check overlapping leaves
    const existingLeave = await Leave.findOne({
      employee,
      startDate: { $lte: end },
      endDate: { $gte: start },
    });

    if (existingLeave) {
      return res.status(400).json({
        success: false,
        message: "Leave already exists for the selected dates",
      });
    }

    // Create leave
    const leave = await Leave.create({
      employee,
      leaveType,
      startDate: start,
      endDate: end,
      reason,
      totalDays,
      status: "Pending",
      approvedBy: null,
      approvedAt: null,
    });

    return res.status(201).json({
      success: true,
      message: "Leave added successfully",
      leave,
    });
  } catch (error) {
    console.error("Add Leave Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.fetchLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({}).populate(
      "employee",
      "name profilePhoto department designation",
    );
    if (!leaves) {
      return res.status(404).json({
        message: "No Leaves Found",
      });
    }
    const formattedLeaves = leaves.map((leave) => {
      const leaveDays =
        Math.ceil(
          (new Date(leave.endDate) - new Date(leave.startDate)) /
            (1000 * 60 * 60 * 24),
        ) + 1;

      return {
        ...leave.toObject(),
        leaveDays,
      };
    });
    res.status(200).json({
      message: "Succesfully fetch leaves",
      leaves: formattedLeaves,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.updateLeave = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status, startDate, endDate, leaveType, reason } = req.body;

    const leave = await Leave.findById(leaveId);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    // if (leave.status !== "Pending") {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Only pending leaves can be updated",
    //   });
    // }

    const updatedStartDate = startDate || leave.startDate;
    const updatedEndDate = endDate || leave.endDate;

    if (new Date(updatedEndDate) < new Date(updatedStartDate)) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    leave.startDate = updatedStartDate;
    leave.endDate = updatedEndDate;
    leave.status = status || leave.status;
    leave.leaveType = leaveType || leave.leaveType;
    leave.reason = reason || leave.reason;

    await leave.save();

    res.status(200).json({
      success: true,
      message: "Leave updated successfully",
      leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteLeave = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const leave = await Leave.findByIdAndDelete(leaveId);
    if (!leave) {
      return res.status(404).json({
        message: "Leave not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Leave deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateLeaveStatus = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["Pending", "Approved", "Rejected"];

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const leave = await Leave.findByIdAndUpdate(
      leaveId,
      { status },
      { new: true, runValidators: true },
    );

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getLeaveDashboardStats = async (req, res) => {
  try {
    const totalRequests = await Leave.countDocuments();

    const approvedLeaves = await Leave.countDocuments({
      status: "Approved",
    });

    const pendingLeaves = await Leave.countDocuments({
      status: "Pending",
    });

    const rejectedLeaves = await Leave.countDocuments({
      status: "Rejected",
    });

    const totalEmployees = await User.countDocuments({
      role: "employee",
    });

    const approvedLeaveRecords = await Leave.find({
      status: "Approved",
    });

    let plannedLeaves = 0;
    let unplannedLeaves = 0;
    let totalLeaveDays = 0;

    approvedLeaveRecords.forEach((leave) => {
      const diffDays =
        (new Date(leave.startDate) - new Date(leave.createdAt)) /
        (1000 * 60 * 60 * 24);

      if (diffDays >= 1) {
        plannedLeaves++;
      } else {
        unplannedLeaves++;
      }

      totalLeaveDays +=
        Math.ceil(
          (new Date(leave.endDate) - new Date(leave.startDate)) /
            (1000 * 60 * 60 * 24),
        ) + 1;
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayPresent = await Attendance.countDocuments({
      status: "Present",
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    });
    const todayAbsent = await Attendance.countDocuments({
      status: "Absent",
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    const todayLeave = await Attendance.countDocuments({
      status: "Leave",
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    });
    res.status(200).json({
      success: true,
      stats: {
        totalRequests,
        approvedLeaves,
        pendingLeaves,
        rejectedLeaves,
        plannedLeaves,
        unplannedLeaves,
        totalLeaveDays,
        todayPresent,
        todayAbsent,
        todayLeave,
        totalEmployees,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.fetchLeavesByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const employee = await User.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        message: "Employee not Found",
      });
    }
    const leave = await Leave.find({ employee: employeeId }).populate(
      "employee",
      "name profilePhoto department designation",
    );
    if (leave.length === 0) {
      return res.status(404).json({
        message: "Leaves not Found",
      });
    }
    const formattedLeaves = leave.map((leave) => {
      const leaveDays =
        Math.ceil(
          (new Date(leave.endDate) - new Date(leave.startDate)) /
            (1000 * 60 * 60 * 24),
        ) + 1;

      return {
        ...leave.toObject(),
        leaveDays,
      };
    });
    res.status(200).json({
      success: true,
      message: "Employee Leaves Found Successfully",
      leave: formattedLeaves,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
