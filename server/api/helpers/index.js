const conn = require("../../dbConfig");

exports.getTables = async () => {
  try {
    const { rows } = await conn.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    return rows;
  } catch (err) {
    return err.message;
  }
};

exports.getList = async (
  tableName,
  orderByColumn,
  orderByDirection,
  searchColumn,
  searchText,
  page,
  resultsPerPage
) => {
  try {
    if (isNaN(Number(resultsPerPage)) && resultsPerPage !== undefined)
      throw new Error(
        `Results per page expected a number, but got "${resultsPerPage}" instead.`
      );
    const numResults = !resultsPerPage ? 30 : Number(resultsPerPage);
    const currentPage = !page ? 1 : Number(page);
    const search = !searchText ? "" : searchText;
    const direction =
      !orderByDirection ||
      orderByDirection === "asc" ||
      orderByDirection === "ASC"
        ? "asc"
        : "desc";

    if (
      orderByDirection !== "asc" &&
      orderByDirection !== "ASC" &&
      orderByDirection !== "desc" &&
      orderByDirection !== "DESC" &&
      orderByDirection !== undefined &&
      orderByDirection !== null
    )
      throw new Error(
        "URL Query Error (orderByDirection): Please enter 'asc' or 'ASC' for ascending order (this is the default behavior if blank) or 'desc' or 'DESC' for descending order."
      );

    const countQuery = !searchColumn
      ? `select count(*) from ${tableName};`
      : `select count(*) from ${tableName} where ${searchColumn} like '%${search}%';`;

    const { rows: countRows } = await conn.query(countQuery);

    const count = Number(countRows[0].count);
    const totalPages = Math.ceil(count / numResults);

    const offset = (currentPage - 1) * numResults;

    const readQuery = !searchColumn
      ? `SELECT * FROM ${tableName}
        ORDER BY ${!orderByColumn ? "id" : orderByColumn} ${direction}
        LIMIT ${numResults}
        OFFSET ${offset};`
      : `SELECT * FROM ${tableName}
        WHERE ${searchColumn} LIKE '%${search}%'
        ORDER BY ${!orderByColumn ? searchColumn : orderByColumn}
        LIMIT ${numResults}
        OFFSET ${offset};`;

    const { rows } = await conn.query(readQuery);

    if (totalPages === 0)
      throw new Error(
        `The table you queried exists, but is empty. Please add some data so you can get results back.`
      );

    if (currentPage > totalPages)
      throw new Error(
        `You tried to grab page ${currentPage} but there are only ${totalPages} pages for this query.`
      );

    return {
      currentPage,
      totalPages,
      resultsPerPage: numResults,
      totalResults: count,
      resultsRange: `${offset + 1}-${
        offset + numResults > count ? count : offset + numResults
      }`,
      results: rows,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

// interface Column {
//   name: String;
//   dataType: String;
//   size: Number;
//   notNUll: Boolean;
//   unique: Boolean;
//   defaultValue?: typeof dataType;
//   primaryKey: Boolean;
//   foreignKey?: {
//     table: String,
//     column?: String,
//     onDelete?: "CASCADE" | "RESTRICT",
//   };
// }

exports.createTable = async (tableName, columns) => {
  try {
    const createTableQuery = `
      CREATE TABLE ${tableName} (
        id SERIAL PRIMARY KEY,
        ${columns.map(
          (column) =>
            `${column.name} ${column.dataType}${
              !column.size ? "" : `(${column.size})`
            } ${!column.notNull ? "" : "NOT NULL"} ${
              !column.unique ? "" : "UNIQUE"
            } ${
              !column.defaultValue ? "" : `DEFAULT '${column.defaultValue}'`
            } ${!column.primaryKey ? "" : "PRIMARY KEY"}`
        )}
      );
    `;

    console.log("query:", createTableQuery);
    const res = await conn.query(createTableQuery);

    return res;
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getOne = async (tableName, id) => {
  try {
    const getOneQuery = `
      SELECT * FROM ${tableName} WHERE id=${id};
    `;

    console.log("query:", getOneQuery);
    const res = await conn.query(getOneQuery);

    return res.rows[0];
  } catch (err) {
    throw new Error(err.message);
  }
};
