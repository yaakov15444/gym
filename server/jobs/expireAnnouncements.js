const Announcement = require('../models/announcement');

const expireAnnouncements = async () => {
    try {
        console.log("Running expireAnnouncements job...");

        const now = new Date();

        const result = await Announcement.updateMany(
            { expirationDate: { $lte: now }, isActive: true }, // מודעות שפג תוקפן ועדיין פעילות
            { $set: { isActive: false } } // עדכון ל-לא פעיל
        );

        console.log(`Expired ${result.modifiedCount} announcements.`);
    } catch (error) {
        console.error("Error in expireAnnouncements job:", error);
    }
};

module.exports = () => {
    // הפעלה ראשונית של הפונקציה בעת הפעלת השרת
    expireAnnouncements();

    // תזמון הפונקציה כך שתפעל כל שעה
    setInterval(expireAnnouncements, 60 * 60 * 1000); // 60 דקות * 60 שניות * 1000 מילישניות
};
