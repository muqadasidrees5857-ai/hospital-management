const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Doctor name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Department is required"],
    },
    qualification: {
      type: String,
      default: "MBBS, MD",
    },
    experience: {
      type: String,
      default: "5+ Years",
    },
    consultationFee: {
      type: Number,
      required: [true, "Consultation fee is required"],
      default: 50,
    },
    availability: {
      days: {
        type: [String],
        default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      },
      timeSlots: {
        type: String,
        default: "09:00 AM - 05:00 PM",
      },
    },
    status: {
      type: String,
      enum: ["Available", "On Leave", "Busy"],
      default: "Available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
