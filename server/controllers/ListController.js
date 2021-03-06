import express from "express";
import _listService from "../services/ListService";
import _taskService from "../services/TaskService.js";
import { Authorize } from "../middleware/authorize.js";

export default class ListsController {
  constructor() {
    this.router = express
      .Router()
      .use(Authorize.authenticated)
      .get("/:id/tasks", this.getTasks)
      .post("", this.create)
      .delete("/:id", this.delete)
      .use(this.defaultRoute);
  }

  defaultRoute(req, res, next) {
    next({ status: 404, message: "No Such Route Found" });
  }

  async getTasks(req, res, next) {
    try {
      let data = await _taskService.getTasks(req.params.id, req.session.uid);
      return res.send(data);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      req.body.authorId = req.session.uid;
      let data = await _listService.create(req.body);
      return res.status(201).send(data);
    } catch (error) {
      next(error);
    }
  }
  async edit(req, res, next) {
    try {
      let data = await _listService.edit(
        req.params.id,
        req.session.uid,
        req.body
      );
      return res.send(data);
    } catch (error) {
      next(error);
    }
  }
  async delete(req, res, next) {
    try {
      await _listService.delete(req.params.id, req.session.uid);
      return res.send("SHE GONE");
    } catch (error) {
      next(error);
    }
  }
}
