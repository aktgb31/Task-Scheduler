const { isAuthenticatedUser } = require('../middlewares/auth');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const Task = require('../models/task');
const validator = require("validator");
const ErrorHandler = require('../utils/errorHandler');
const router = require('express').Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - description
 *         - time
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the task
 *         description:
 *           type: string
 *           description: The description of the task
 *         time:
 *           type: datetime
 *           description: The time of the task
 */

/**
 * @swagger
 * tags:
 *   name: Task
 *   description: The Task related API
 */

/**
 * @swagger
 * /api/task/:
 *   get:
 *     summary: Get all the tasks of current user
 *     tags: [Task]
 *     description: Get all the tasks of current user
 *     responses:
 *      '200':
 *          description: Successfully get all the tasks
 *          content:
 *             application/json:
 *               schema:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/Task'
 *      '400':
 *         description: Error in Message
 *       
 */

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

/**
 * @swagger
 * /api/task:
 *   post:
 *     summary: Creates a new task
 *     tags: [Task]
 *     description: Creates a new task
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *              schema: 
 *                  $ref: '#/components/schemas/Task'
 *     responses:
 *      '200':
 *          description: Task created successfully
 *      '400':
 *          description: Error in Message
 *       
 */


router.post('/', isAuthenticatedUser, catchAsyncErrors(async(req, res, next) => {
    const { description, time } = req.body;
    if (!validator.isISO8601(time, { strict: true }))
        throw new ErrorHandler(400, "Invalid time format");

    await Task.create({ description, time, userId: req.user.id });
    res.status(200).json({ message: "Task created successfully" });
}))

/**
 * @swagger
 * /api/task/:
 *   put:
 *     summary: Changes task details
 *     tags: [Task]
 *     description: Changes task
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *              schema: 
 *                  $ref: '#/components/schemas/Task'
 *     responses:
 *      '200':
 *          description: Task updated successfully
 *     '400':
 *         description: Error in Message
 *       
 */


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

/**
 * @swagger
 * /api/task/{id}:
 *   delete:
 *     summary: Deletes a task
 *     tags: [Task]
 *     description: Deletes a task
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *         type: integer
 *        required: true
 *        description: The id of the task
 *     responses:
 *      '200':
 *          description: Task deleted successfully
 *      '400':
 *        description: Error in Message 
 */


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