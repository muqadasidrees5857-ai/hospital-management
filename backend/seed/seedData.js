const User = require("../models/User");
const Department = require("../models/Department");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const Prescription = require("../models/Prescription");
const Invoice = require("../models/Invoice");
const Staff = require("../models/Staff");
const SystemSetting = require("../models/SystemSetting");

const runSeeder = async (forceClear = false) => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0 && !forceClear) {
      console.log("Database already contains users. Skipping auto-seed.");
      return;
    }

    console.log("Seeding default hospital database records...");

    if (forceClear) {
      await User.deleteMany();
      await Department.deleteMany();
      await Doctor.deleteMany();
      await Patient.deleteMany();
      await Appointment.deleteMany();
      await Prescription.deleteMany();
      await Invoice.deleteMany();
      await Staff.deleteMany();
      await SystemSetting.deleteMany();
    }

    await SystemSetting.create({
      hospitalName: "Apex Care International Hospital",
      tagline: "Excellence in Healthcare & Medical Research",
      contactEmail: "admin@apexcare.org",
      contactPhone: "+1 (800) 555-0199",
      address: "742 Evergreen Terrace, Medical District, NY 10001",
      currency: "$",
      taxRate: 5,
    });

    await User.create({
      name: "Dr. Alexander Wright (Admin)",
      email: "admin@hospital.com",
      password: "admin123",
      role: "admin",
      phone: "+1 (555) 019-2831",
      avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150",
    });

    await User.create({
      name: "Sarah Jenkins (Reception)",
      email: "staff@hospital.com",
      password: "staff123",
      role: "staff",
      phone: "+1 (555) 018-9921",
    });

    const depts = await Department.insertMany([
      {
        name: "Cardiology",
        code: "CARD",
        description: "Comprehensive cardiovascular care, heart surgeries, and vascular diagnosis.",
        headOfDepartment: "Dr. Robert Vance",
        location: "Building A, Floor 3",
      },
      {
        name: "Neurology",
        code: "NEUR",
        description: "Brain, spinal cord, and peripheral nervous system specialized treatments.",
        headOfDepartment: "Dr. Elena Rostova",
        location: "Building B, Floor 2",
      },
      {
        name: "Pediatrics",
        code: "PEDI",
        description: "Specialized healthcare for infants, children, and adolescents.",
        headOfDepartment: "Dr. Marcus Brody",
        location: "Building C, Floor 1",
      },
      {
        name: "Orthopedics",
        code: "ORTH",
        description: "Bone health, joint replacement, sports injuries, and trauma rehab.",
        headOfDepartment: "Dr. David Miller",
        location: "Building A, Floor 1",
      },
    ]);

    const docs = await Doctor.insertMany([
      {
        name: "Dr. Robert Vance",
        email: "robert.vance@apexcare.org",
        phone: "+1 (555) 234-5678",
        specialization: "Interventional Cardiologist",
        department: depts[0]._id,
        qualification: "MBBS, MD (Cardiology), FACC",
        experience: "14+ Years",
        consultationFee: 120,
        availability: {
          days: ["Monday", "Wednesday", "Friday"],
          timeSlots: "09:00 AM - 02:00 PM",
        },
      },
      {
        name: "Dr. Elena Rostova",
        email: "elena.rostova@apexcare.org",
        phone: "+1 (555) 345-6789",
        specialization: "Neurosurgeon",
        department: depts[1]._id,
        qualification: "MD, Ph.D. (Neuroscience)",
        experience: "11+ Years",
        consultationFee: 150,
        availability: {
          days: ["Tuesday", "Thursday", "Saturday"],
          timeSlots: "10:00 AM - 04:00 PM",
        },
      },
      {
        name: "Dr. Marcus Brody",
        email: "marcus.brody@apexcare.org",
        phone: "+1 (555) 456-7890",
        specialization: "Pediatric Specialist",
        department: depts[2]._id,
        qualification: "MBBS, DCH, MD (Pediatrics)",
        experience: "8+ Years",
        consultationFee: 90,
        availability: {
          days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          timeSlots: "08:30 AM - 01:30 PM",
        },
      },
      {
        name: "Dr. David Miller",
        email: "david.miller@apexcare.org",
        phone: "+1 (555) 567-8901",
        specialization: "Orthopedic Surgeon",
        department: depts[3]._id,
        qualification: "MBBS, MS (Orthopedics)",
        experience: "12+ Years",
        consultationFee: 110,
        availability: {
          days: ["Monday", "Wednesday", "Thursday"],
          timeSlots: "01:00 PM - 06:00 PM",
        },
      },
    ]);

    const patients = await Patient.insertMany([
      {
        patientId: "PAT-0101",
        name: "James Wilson",
        age: 45,
        gender: "Male",
        phone: "+1 (555) 901-2345",
        email: "j.wilson@example.com",
        address: "124 Conch Street, NY 10002",
        bloodGroup: "A+",
        disease: "Hypertension & Angina",
        emergencyContact: {
          name: "Mary Wilson",
          relationship: "Spouse",
          phone: "+1 (555) 901-9988",
        },
        medicalHistory: [
          { condition: "High Blood Pressure", diagnosedDate: "2023-04-12", status: "Ongoing" },
        ],
        status: "Outpatient",
      },
      {
        patientId: "PAT-0102",
        name: "Sophia Martinez",
        age: 29,
        gender: "Female",
        phone: "+1 (555) 890-1234",
        email: "sophia.m@example.com",
        address: "45 West Elm Ave, NY 10005",
        bloodGroup: "O-",
        disease: "Migraine & Vertebral Aura",
        emergencyContact: {
          name: "Carlos Martinez",
          relationship: "Brother",
          phone: "+1 (555) 890-7711",
        },
        medicalHistory: [
          { condition: "Chronic Migraine", diagnosedDate: "2024-01-15", status: "Active" },
        ],
        status: "Outpatient",
      },
      {
        patientId: "PAT-0103",
        name: "Liam O'Connor",
        age: 7,
        gender: "Male",
        phone: "+1 (555) 789-0123",
        email: "parent.oconnor@example.com",
        address: "88 Maple Drive, NY 10012",
        bloodGroup: "B+",
        disease: "Acute Bronchitis",
        emergencyContact: {
          name: "Fiona O'Connor",
          relationship: "Mother",
          phone: "+1 (555) 789-0022",
        },
        medicalHistory: [],
        status: "Admitted",
      },
      {
        patientId: "PAT-0104",
        name: "Emily Davis",
        age: 38,
        gender: "Female",
        phone: "+1 (555) 678-9012",
        email: "emily.davis@example.com",
        address: "312 Oak Ridge Rd, NY 10018",
        bloodGroup: "AB+",
        disease: "Knee Ligament Strain",
        emergencyContact: {
          name: "Mark Davis",
          relationship: "Husband",
          phone: "+1 (555) 678-4455",
        },
        medicalHistory: [
          { condition: "ACL Tear Surgery", diagnosedDate: "2022-09-10", status: "Resolved" },
        ],
        status: "Outpatient",
      },
    ]);

    const today = new Date().toISOString().split("T")[0];
    await Appointment.insertMany([
      {
        appointmentId: "APT-01001",
        patient: patients[0]._id,
        doctor: docs[0]._id,
        department: depts[0]._id,
        appointmentDate: today,
        timeSlot: "09:30 AM",
        reason: "Cardiovascular quarterly routine evaluation",
        status: "Scheduled",
      },
      {
        appointmentId: "APT-01002",
        patient: patients[1]._id,
        doctor: docs[1]._id,
        department: depts[1]._id,
        appointmentDate: today,
        timeSlot: "11:00 AM",
        reason: "Severe recurring migraine follow-up",
        status: "Scheduled",
      },
      {
        appointmentId: "APT-01003",
        patient: patients[2]._id,
        doctor: docs[2]._id,
        department: depts[2]._id,
        appointmentDate: today,
        timeSlot: "02:00 PM",
        reason: "Child fever & persistent coughing",
        status: "Completed",
      },
      {
        appointmentId: "APT-01004",
        patient: patients[3]._id,
        doctor: docs[3]._id,
        department: depts[3]._id,
        appointmentDate: today,
        timeSlot: "03:30 PM",
        reason: "Right knee MRI review & physical therapy plan",
        status: "Scheduled",
      },
    ]);

    await Prescription.insertMany([
      {
        prescriptionId: "RX-00501",
        patient: patients[0]._id,
        doctor: docs[0]._id,
        diagnosis: "Essential Hypertension & Mild Angina",
        medicines: [
          { name: "Amlodipine Besylate", dosage: "5mg", frequency: "1-0-0", duration: "30 Days", instructions: "Take every morning after breakfast" },
          { name: "Atorvastatin Calcium", dosage: "10mg", frequency: "0-0-1", duration: "30 Days", instructions: "Take at bedtime" },
        ],
        notes: "Reduce dietary sodium intake and log blood pressure readings daily.",
        date: today,
      },
      {
        prescriptionId: "RX-00502",
        patient: patients[1]._id,
        doctor: docs[1]._id,
        diagnosis: "Acute Migraine Episode",
        medicines: [
          { name: "Sumatriptan Succinate", dosage: "50mg", frequency: "As needed", duration: "10 Days", instructions: "Take at onset of aura" },
        ],
        notes: "Avoid bright screens during onset; drink minimum 2.5L water daily.",
        date: today,
      },
    ]);

    await Invoice.insertMany([
      {
        invoiceNumber: "INV-02001",
        patient: patients[0]._id,
        items: [
          { description: "Cardiology Specialist Consultation", category: "Consultation", amount: 120 },
          { description: "EKG Diagnostic Scan", category: "Lab Test", amount: 150 },
          { description: "Prescription Medicines (Amlodipine)", category: "Medicine", amount: 45 },
        ],
        subtotal: 315,
        tax: 5,
        discount: 15,
        totalAmount: 315.75,
        paymentStatus: "Paid",
        paymentMethod: "Credit Card",
        dueDate: today,
      },
      {
        invoiceNumber: "INV-02002",
        patient: patients[1]._id,
        items: [
          { description: "Neurology Specialist Consultation", category: "Consultation", amount: 150 },
          { description: "Brain MRI Contrast Scan", category: "Lab Test", amount: 450 },
        ],
        subtotal: 600,
        tax: 5,
        discount: 0,
        totalAmount: 630,
        paymentStatus: "Pending",
        paymentMethod: "Insurance",
        dueDate: today,
      },
    ]);

    await Staff.insertMany([
      {
        staffId: "STF-0301",
        name: "Nancy Wheeler",
        role: "Nurse",
        department: "Cardiology ICU",
        email: "nancy.w@apexcare.org",
        phone: "+1 (555) 111-2233",
        shift: "Morning",
        status: "Active",
      },
      {
        staffId: "STF-0302",
        name: "Kevin Bacon",
        role: "Receptionist",
        department: "Front Desk",
        email: "kevin.b@apexcare.org",
        phone: "+1 (555) 222-3344",
        shift: "Morning",
        status: "Active",
      },
      {
        staffId: "STF-0303",
        name: "Rachel Green",
        role: "Pharmacist",
        department: "Main Pharmacy",
        email: "rachel.g@apexcare.org",
        phone: "+1 (555) 333-4455",
        shift: "Evening",
        status: "Active",
      },
    ]);

    console.log("Database Seeded Successfully!");
  } catch (err) {
    console.error("Error Seeding Database:", err);
  }
};

// If run directly from terminal:
if (require.main === module) {
  const dotenv = require("dotenv");
  const path = require("path");
  dotenv.config({ path: path.join(__dirname, "../.env") });
  const connectDB = require("../config/db");

  connectDB().then(async () => {
    await runSeeder(true);
    process.exit(0);
  });
}

module.exports = runSeeder;
