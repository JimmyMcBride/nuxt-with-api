const express = require("express");
// const conn = require("../dbConfig");
const db = require("./helpers");

const rootRouter = express.Router();

rootRouter.get("/read/all-tables", async (_, res) => {
  try {
    const rows = await db.getTables();
    res.status(200).json(rows);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

rootRouter.get("/read/:tableName", async (req, res) => {
  try {
    const { tableName } = req.params;
    const {
      orderByColumn,
      orderByDirection,
      searchColumn,
      searchText,
      page,
      resultsPerPage,
    } = req.query;
    console.log("query:", req.query);
    const rows = await db.getList(
      tableName,
      orderByColumn,
      orderByDirection,
      searchColumn,
      searchText,
      page,
      resultsPerPage
    );
    res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

rootRouter.get("/read/:tableName/:id", async (req, res) => {
  const { tableName, id } = req.params;
  const result = await db.getOne(tableName, id);

  res.status(200).json(result);
});

rootRouter.post("/create-table", async (req, res) => {
  const { tableName, columns } = req.body;
  const result = await db.createTable(tableName, columns);

  res.status(200).json(result);
});

module.exports = rootRouter;
