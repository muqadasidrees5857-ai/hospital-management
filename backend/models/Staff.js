const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    staffId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Staff name is required"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["Nurse", "Receptionist", "Pharmacist", "Lab Technician", "Accountant", "Administrator"],
      required: true,
    },
    department: {
      type: String,
      default: "General",
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    shift: {
      type: String,
      enum: ["Morning", "Evening", "Night"],
      default: "Morning",
    },
    joiningDate: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
    status: {
      type: String,
      enum: ["Active", "On Leave", "Resigned"],
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Staff", staffSchema);
