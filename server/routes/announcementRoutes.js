const express = require('express');
const router = express.Router();
const {
    getGeneralAnnouncements,
    getAnnouncementsForUser,
    createAnnouncement,
    getAllAnnouncements,
    getActiveAnnouncements,
    getInactiveAnnouncements,
    deleteAnnouncement,
    updateAnnouncement,
    toggleAnnouncementStatus,
    getAnnouncementStatistics,

} = require('../controllers/announcement');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddlewareAdmin');

router.get('/general', getGeneralAnnouncements);

router.use(authMiddleware);
router.get('/byUser', getAnnouncementsForUser);

router.use(adminMiddleware);

router.post('/create', createAnnouncement);

router.get('/all', getAllAnnouncements);

router.get('/active', getActiveAnnouncements);

router.get('/inactive', getInactiveAnnouncements);

router.delete('/:id', deleteAnnouncement);

router.patch('/:id', updateAnnouncement);

router.patch('/toggle/:id', toggleAnnouncementStatus);

// סטטיסטיקות על המודעות
router.get('/statistics', getAnnouncementStatistics);

module.exports = router;
