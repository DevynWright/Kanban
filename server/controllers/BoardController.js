import _boardService from "../services/BoardService";
import express from "express";
import _listService from "../services/ListService.js";
import _taskService from "../services/TaskService";
import { Authorize } from "../middleware/authorize.js";

//PUBLIC
export default class BoardsController {
  constructor() {
    this.router = express
      .Router()
      .use(Authorize.authenticated)
      .get("", this.getAll)
      // .get("/:id/lists/:id/tasks", this.getTasksById)
      .get("/:id/lists", this.getListsById)
      .get("/:id", this.getById)
      .post("", this.create)
      .put("/:id", this.edit)
      .delete("/:id", this.delete)
      .use(this.defaultRoute);
  }

  // this is pretty neat

  defaultRoute(req, res, next) {
    next({ status: 404, message: "No Such Route" });
  }
  // async getTasksById(req, res, next) {
  //   try {
  //     let data = await _taskService.getTasks(req.params.id, req.session.uid);
  //     return res.send(data);
  //   } catch (error) {
  //     next(error);
  //   }
  // }
  async getListsById(req, res, next) {
    try {
      let data = await _listService.getById(req.params.id, req.session.uid);
      return res.send(data);
    } catch (error) {
      next(error);
    }
  }
  async getAll(req, res, next) {
    try {
      //only gets boards by user who is logged in
      let data = await _boardService.getAll(req.session.uid);
      return res.send(data);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      let data = await _boardService.getById(req.params.id, req.session.uid);
      return res.send(data);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      req.body.authorId = req.session.uid;
      let data = await _boardService.create(req.body);
      return res.status(201).send(data);
    } catch (error) {
      next(error);
    }
  }

  async edit(req, res, next) {
    try {
      let data = await _boardService.edit(
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
      await _boardService.delete(req.params.id, req.session.uid);
      return res.send("Successfully deleted");
    } catch (error) {
      next(error);
    }
  }
}
