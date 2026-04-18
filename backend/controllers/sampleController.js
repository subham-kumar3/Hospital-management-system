const LabSample = require('../models/LabSample');
const LabTest = require('../models/LabTest');

// @desc    Get all samples
// @route   GET /api/lab/samples
// @access  Private/Lab Technician
exports.getSamples = async (req, res) => {
  try {
    const { collectionStatus, status, search, page = 1, limit = 10 } = req.query;

    let query = {};

    if (collectionStatus) {
      query.collectionStatus = collectionStatus;
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { sampleId: new RegExp(search, 'i') },
        { sampleType: new RegExp(search, 'i') }
      ];
    }

    const samples = await LabSample.find(query)
      .populate('patient', 'name age gender phone')
      .populate('labTest', 'testType testName priority status')
      .populate('collectedBy', 'name email')
      .sort({ collectionDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await LabSample.countDocuments(query);

    res.json({
      success: true,
      count: samples.length,
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: page,
      data: samples
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get single sample
// @route   GET /api/lab/samples/:id
// @access  Private/Lab Technician
exports.getSample = async (req, res) => {
  try {
    const sample = await LabSample.findById(req.params.id)
      .populate('patient', 'name age gender phone email address')
      .populate('labTest', 'testType testName priority status')
      .populate('collectedBy', 'name email');

    if (!sample) {
      return res.status(404).json({ success: false, message: 'Sample not found' });
    }

    res.json({ success: true, data: sample });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Create sample
// @route   POST /api/lab/samples
// @access  Private/Lab Technician
exports.createSample = async (req, res) => {
  try {
    const {
      labTest,
      patient,
      sampleType,
      collectionDate,
      storageConditions,
      expiryDate,
      storageLocation,
      notes
    } = req.body;

    const sample = await LabSample.create({
      labTest,
      patient,
      sampleType,
      collectionDate: collectionDate || Date.now(),
      storageConditions,
      expiryDate,
      storageLocation,
      notes
    });

    // Update lab test sample collection status
    await LabTest.findByIdAndUpdate(labTest, {
      sampleCollected: true,
      sampleCollectionDate: Date.now()
    });

    const populatedSample = await LabSample.findById(sample._id)
      .populate('patient', 'name age gender')
      .populate('labTest', 'testType testName');

    res.status(201).json({ success: true, data: populatedSample });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update sample collection status
// @route   PUT /api/lab/samples/:id/collection
// @access  Private/Lab Technician
exports.updateCollectionStatus = async (req, res) => {
  try {
    const { collectionStatus, notes } = req.body;

    const sample = await LabSample.findById(req.params.id);

    if (!sample) {
      return res.status(404).json({ success: false, message: 'Sample not found' });
    }

    sample.collectionStatus = collectionStatus;

    if (collectionStatus === 'Collected' && !sample.collectionTime) {
      sample.collectionTime = Date.now();
      sample.collectedBy = req.user.id;
    }

    if (notes) {
      sample.notes = notes;
    }

    await sample.save();

    const updatedSample = await LabSample.findById(sample._id)
      .populate('patient', 'name age gender')
      .populate('collectedBy', 'name email');

    res.json({ success: true, data: updatedSample });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update sample
// @route   PUT /api/lab/samples/:id
// @access  Private/Lab Technician
exports.updateSample = async (req, res) => {
  try {
    const {
      storageConditions,
      expiryDate,
      storageLocation,
      notes,
      status
    } = req.body;

    let sample = await LabSample.findById(req.params.id);

    if (!sample) {
      return res.status(404).json({ success: false, message: 'Sample not found' });
    }

    if (storageConditions) sample.storageConditions = storageConditions;
    if (expiryDate) sample.expiryDate = expiryDate;
    if (storageLocation) sample.storageLocation = storageLocation;
    if (notes) sample.notes = notes;
    if (status) sample.status = status;

    await sample.save();

    sample = await LabSample.findById(sample._id)
      .populate('patient', 'name age gender')
      .populate('labTest', 'testType testName');

    res.json({ success: true, data: sample });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get expiring samples
// @route   GET /api/lab/samples/expiring
// @access  Private/Lab Technician
exports.getExpiringSamples = async (req, res) => {
  try {
    const next24Hours = new Date();
    next24Hours.setHours(next24Hours.getHours() + 24);

    const expiringSamples = await LabSample.find({
      collectionStatus: 'Collected',
      status: 'Active',
      expiryDate: { $lte: next24Hours, $gte: new Date() }
    })
    .populate('patient', 'name age gender')
    .populate('labTest', 'testType testName')
    .sort({ expiryDate: 1 });

    res.json({ success: true, count: expiringSamples.length, data: expiringSamples });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
