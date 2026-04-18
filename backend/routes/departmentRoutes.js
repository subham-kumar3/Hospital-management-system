const express = require('express');
const router = express.Router();
const {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentStats
} = require('../controllers/departmentController');

router.route('/')
  .get(getDepartments)
  .post(createDepartment);

router.route('/stats/overview')
  .get(getDepartmentStats);

router.route('/:id')
  .get(getDepartment)
  .put(updateDepartment)
  .delete(deleteDepartment);

module.exports = router;
