const tableService = require("../services/tableService");
const tableDAO = require("../DAOs/table.dao");
const reservationDAO = require("../DAOs/reservation.dao");

const getAllHandler = async (req, res) => {
  const tables = await tableService.getAllTables(tableDAO);

  if (tables.length === 0)
    throw {
      status: 404,
      message: "Nenhuma mesa do restaurante está no banco de dados",
    };

  return res.status(200).json({
    success: true,
    collection: tables,
  });
};

const registerHandler = async (req, res) => {
  const { name, capacity } = req.body;

  if (!name && !capacity)
    throw {
      status: 400,
      message: "Por favor preencha todos os campos",
    };

  const table = await tableService.registerTable(tableDAO, {
    name,
    capacity,
  });

  return res.status(201).json({
    success: true,
    message: "Mesa registrada no restaurante com sucesso!",
    item: table,
  });
};

const freeTableHandler = async (req, res) => {
  const tableId = req.params.tableId;
  const info = await tableService.freeTable(
    { reservationDAO, tableDAO },
    tableId
  );

  return res.status(200).json({
    success: true,
    message: "Liberada com sucesso a mesa escolhida!",
    item: info,
  });
};

module.exports = {
  getAllHandler,
  registerHandler,
  freeTableHandler,
};
