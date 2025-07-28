import express from "express";
import Task from "../models/Task.js";
import createError from "../utlis/createError.js";

export const getAllTasks = async (req, res, next) => {
  const {
    isCompleted,
    dueDate,
    sortBy,
    order,
    search,
    page: pageParam,
  } = req.query;

  const page = Number(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * 5;
  try {
    const filter = { user: req.user.id };

    if (typeof isCompleted === "string") {
      filter.isCompleted = isCompleted.toLowerCase() === "true";
    }

    if (dueDate) {
      const date = new Date(dueDate);

      const startDate = new Date(date.setHours(0, 0, 0, 0));
      const endDate = new Date(date.setHours(23, 59, 59, 999));

      filter.dueDate = { $gte: startDate, $lte: endDate };
    }

    let sortOptions = {};

    if (sortBy) {
      const sortOrder = order === "desc" ? -1 : 1;
      sortOptions = { [sortBy]: sortOrder };
    } else {
      sortOptions = { createdAt: -1 };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    const tasks = await Task.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const totalTasks = await Task.countDocuments(filter);
    const totalPages = Math.ceil(totalTasks / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    if (tasks.length === 0) {
      return next(createError(404, "No tasks found"));
    }

    res.status(200).json({
      message: "Tasks fetched successfully!",
      tasks,
      currentPage: page,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    });
  } catch (err) {
    next(err);
  }
};

export const getTask = async (req, res, next) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);

    if (!task) {
      return next(createError(404, "Task not found"));
    }
    if (task.user.toString() !== req.user.id) {
      return next(createTask(403, "Not authorised to view this"));
    }

    res.status(200).json({ message: "Task fetched successfully!", task });
  } catch (err) {
    next(err);
  }
};

export const createTask = async (req, res, next) => {
  const { title, description, isCompleted, dueDate } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      isCompleted,
      dueDate,
      user: req.user.id,
    });

    await newTask.save();

    res.status(201).json({ message: "Task created successfully!", newTask });
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req, res, next) => {
  const { id } = req.params;
  const { title, description, isCompleted, dueDate } = req.body;
  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "No task found" });
    }

    if (task.user.toString() !== req.user.id) {
      return next(createError(403, "Not authorised to view this"));
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (typeof isCompleted === "boolean") task.isCompleted = isCompleted;
    if (dueDate) task.dueDate = dueDate;

    await task.save();
    res.status(200).json({ message: "Task upadted successfully!", task });
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "No task found" });
    }

    if (task.user.toString() !== req.user.id) {
      return next(createError(403, "Not authorised to delete this task"));
    }
    await task.deleteOne();
    res.status(200).json({ message: "Task deleted successfully!", task });
  } catch (err) {
    next(err);
  }
};
