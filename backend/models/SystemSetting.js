const mongoose = require("mongoose");

const systemSettingSchema = new mongoose.Schema(
  {
    hospitalName: {
      type: String,
      default: "Apex Care International Hospital",
    },
    tagline: {
      type: String,
      default: "Excellence in Healthcare & Medical Research",
    },
    contactEmail: {
      type: String,
      default: "contact@apexcare.org",
    },
    contactPhone: {
      type: String,
      default: "+1 (800) 555-0199",
    },
    address: {
      type: String,
      default: "742 Evergreen Terrace, Medical District, NY 10001",
    },
    currency: {
      type: String,
      default: "$",
    },
    taxRate: {
      type: Number,
      default: 5,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SystemSetting", systemSettingSchema);
