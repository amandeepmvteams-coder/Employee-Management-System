const express = require("express");
const router = express.Router();
const leaveController = require("../controllers/leaveConroller");
const authMiddleware = require("../middlewares/authMiddleware");

router.post(
  "/add-leave",
  authMiddleware.protect,
  authMiddleware.admin,
  leaveController.addLeave,
);
router.get(
  "/dashboard-stats",
  authMiddleware.protect,
  authMiddleware.admin,
  leaveController.getLeaveDashboardStats,
);
router.put(
  "/:leaveId/status",
  authMiddleware.protect,
  authMiddleware.admin,
  leaveController.updateLeaveStatus,
);
router.route("/").get(leaveController.fetchLeaves);
router
  .route("/:leaveId")
  .put(
    authMiddleware.protect,
    authMiddleware.admin,
    leaveController.updateLeave,
  )
  .delete(leaveController.deleteLeave);

module.exports = router;
