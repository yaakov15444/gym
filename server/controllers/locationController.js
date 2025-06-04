const Location = require("../models/locationModel");
const AppError = require("../utils/handleError");
const ctrl = {
    async createLocation(req, res, next) {
        try {
            const { name, address } = req.body;
            const location = await Location.create({ name, address });
            if (!location) {
                return next(new AppError("היצירה נכשלה", 400));
            }
            res.status(201).json({ location, message: "היצירה בוצעה בהצלחה" });
        } catch (error) {
            next(new AppError(error.message, 400));
        }
    },
    async getAllLocations(req, res, next) {
        try {
            const locations = await Location.find({ isActive: true });
            if (!locations || locations.length <= 0) {
                return next(new AppError("לא נמצאו מיקומים זמינים", 404));
            }
            res.status(200).json({ locations });
        } catch (error) {
            next(new AppError(error.message, 400));
        }
    },
    async getLocationById(req, res, next) {
        try {
            const { id } = req.params;
            const location = await Location.findOne({ _id: id, isActive: true });
            if (!location) {
                return next(new AppError("לא נמצא מיקום", 404));
            }
            res.status(200).json({ location });
        } catch (error) {
            next(new AppError(error.message, 400));
        }
    },
    async editLocation(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const location = await Location.findOneAndUpdate(
                { _id: id, isActive: true },
                updateData,
                { new: true, runValidators: true }
            );
            if (!location) {
                return next(new AppError("מיקום לא נמצא", 404));
            }
            res.status(200).json({ location, message: "המיקום עודכן בהצלחה" });
        } catch (error) {
            next(new AppError(error.message, 400));
        }
    },
    async deleteLocation(req, res, next) {
        try {
            const { id } = req.params;
            const location = await Location.findOneAndUpdate(
                { _id: id, isActive: true },
                { isActive: false },
                { new: true, runValidators: true }
            );
            if (!location) {
                return next(new AppError("מיקום לא נמצא", 404));
            }
            res.status(200).json({
                location,
                message: "המיקום נמחק בהצלחה"
            });
        } catch (error) {
            next(new AppError(error.message, 400));
        }
    }
}
module.exports = ctrl