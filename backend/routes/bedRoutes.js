const express = require("express");
const router = express.Router();

let beds = [
  {
    id: 1,
    bedId: "B-101",
    ward: "General Ward",
    room: "101",
    type: "General",
    patient: "Ali Khan",
    status: "Occupied",
  },
  {
    id: 2,
    bedId: "B-102",
    ward: "General Ward",
    room: "102",
    type: "General",
    patient: "-",
    status: "Available",
  },
  {
    id: 3,
    bedId: "B-201",
    ward: "ICU Ward",
    room: "201",
    type: "ICU",
    patient: "Ahmed Hassan",
    status: "Occupied",
  },
  {
    id: 4,
    bedId: "B-202",
    ward: "ICU Ward",
    room: "202",
    type: "ICU",
    patient: "-",
    status: "Available",
  },
  {
    id: 5,
    bedId: "B-301",
    ward: "Private Ward",
    room: "301",
    type: "Private",
    patient: "Sarah Malik",
    status: "Occupied",
  },
  {
    id: 6,
    bedId: "B-302",
    ward: "Private Ward",
    room: "302",
    type: "Private",
    patient: "-",
    status: "Available",
  },
];

// GET - all beds
router.get("/", (req, res) => {
  res.json(beds);
});

// POST - add bed
router.post("/", (req, res) => {
  const nextNum = beds.length > 0 ? Math.max(...beds.map((b) => Number(b.id) || 0)) + 1 : 1;
  const newBed = {
    id: nextNum,
    bedId: req.body.bedId || `B-${100 + nextNum}`,
    ward: req.body.ward || "General Ward",
    room: req.body.room || "101",
    type: req.body.type || "General",
    patient: req.body.patient || "-",
    status: req.body.status || "Available",
  };

  beds.push(newBed);
  res.status(201).json({ message: "Bed added successfully", bed: newBed });
});

// PUT - update bed
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = beds.findIndex((b) => Number(b.id) === id);

  if (index === -1) {
    return res.status(404).json({ message: "Bed not found" });
  }

  beds[index] = { ...beds[index], ...req.body, id };
  res.json({ message: "Bed updated successfully", bed: beds[index] });
});

// DELETE - delete bed
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = beds.findIndex((b) => Number(b.id) === id);

  if (index === -1) {
    return res.status(404).json({ message: "Bed not found" });
  }

  const deleted = beds.splice(index, 1);
  res.json({ message: "Bed deleted successfully", bed: deleted[0] });
});

module.exports = router;
