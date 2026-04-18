const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  addNote,
  getPatientNotes,
  updateNote,
  deleteNote
} = require('../controllers/nurseNoteController');

router.use(protect);
router.use(authorize('Nurse'));

router.post('/', addNote);
router.get('/patient/:patientId', getPatientNotes);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

module.exports = router;
