const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createTask,
  getTasks,
  getTaskStats,
  updateTask,
  deleteTask
} = require('../controllers/nurseTaskController');

router.use(protect);
router.use(authorize('Nurse'));

router.post('/', createTask);
router.get('/', getTasks);
router.get('/stats', getTaskStats);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
