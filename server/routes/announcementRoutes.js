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
    makeReaded
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
router.patch('/readed', authMiddleware, makeReaded);
router.delete('/delete/:id', deleteAnnouncement);
router.patch('/update/:id', updateAnnouncement);
router.patch('/toggle/:id', toggleAnnouncementStatus);
router.get('/statistics', getAnnouncementStatistics);
module.exports = router;
