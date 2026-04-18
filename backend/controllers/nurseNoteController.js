const NurseNote = require('../models/NurseNote');

// @desc    Add nurse note
// @route   POST /api/nurse-notes
// @access  Private/Nurse
const addNote = async (req, res) => {
  try {
    const { patientId, noteType, note } = req.body;

    const nurseNote = await NurseNote.create({
      patient: patientId,
      nurse: req.user.id,
      noteType,
      note
    });

    res.status(201).json({
      success: true,
      data: nurseNote
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get patient notes
// @route   GET /api/nurse-notes/patient/:patientId
// @access  Private/Nurse
const getPatientNotes = async (req, res) => {
  try {
    const notes = await NurseNote.find({ patient: req.params.patientId })
      .populate('nurse', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update nurse note
// @route   PUT /api/nurse-notes/:id
// @access  Private/Nurse
const updateNote = async (req, res) => {
  try {
    let note = await NurseNote.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    // Check if nurse owns this note
    if (note.nurse.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this note' 
      });
    }

    note = await NurseNote.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: note
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete nurse note
// @route   DELETE /api/nurse-notes/:id
// @access  Private/Nurse
const deleteNote = async (req, res) => {
  try {
    const note = await NurseNote.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    // Check if nurse owns this note
    if (note.nurse.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this note' 
      });
    }

    await note.deleteOne();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addNote,
  getPatientNotes,
  updateNote,
  deleteNote
};
