const { isAuthenticatedUser } = require('../middlewares/auth');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const Task = require('../models/task');
const validator = require("validator");
const ErrorHandler = require('../utils/errorHandler');
const router = require('express').Router();

router.get('/', isAuthenticatedUser, catchAsyncErrors(async(req, res, next) => {
    const tasks = await Task.findAll({
        where: { userId: req.user.id },
        order: [
            ['time', 'DESC']
        ],
        raw: true
    });
    console.log(tasks);
    res.status(200).json(tasks);
}))

router.post('/', isAuthenticatedUser, catchAsyncErrors(async(req, res, next) => {
    const { description, time } = req.body;
    if (!validator.isISO8601(time, { strict: true }))
        throw new ErrorHandler(400, "Invalid time format");

    await Task.create({ description, time, userId: req.user.id });
    res.status(200).json({ message: "Task created successfully" });
}))

router.put('/', isAuthenticatedUser, catchAsyncErrors(async(req, res, next) => {
    const { id, description, time } = req.body;
    const task = await Task.findOne({ where: { id } });
    if (!task)
        return next(new ErrorHandler(404, "Task not found"));
    if (task.userId !== req.user.id)
        return next(new ErrorHandler(403, "Unauthorized"));
    if (description)
        task.description = description;
    if (time)
        task.time = time;
    await task.save();
    res.status(200).json({ message: "Task updated successfully" });
}))

router.delete('/:id', isAuthenticatedUser, catchAsyncErrors(async(req, res, next) => {
    const id = parseInt(req.params.id);
    const task = await Task.findOne({ where: { id } });
    if (!task)
        return next(new ErrorHandler(404, "Task not found"));
    if (task.userId !== req.user.id)
        return next(new ErrorHandler(403, "Unauthorized"));
    await task.destroy();
    res.status(200).json({ message: "Task deleted successfully" });
}))

module.exports = router;