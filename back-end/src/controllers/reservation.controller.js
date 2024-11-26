const reservationService = require("../services/reservationService");
const reservationDAO = require("../DAOs/reservation.dao");
const tableDAO = require("../DAOs/table.dao");

const getAllHandler = async (req, res) => {
  const reservations = await reservationService.getAllReservations(
    reservationDAO
  );

  return res.status(200).json({
    success: true,
    collection: reservations,
  });
};

const registerHandler = async (req, res) => {
  const payload = req.body;
  await reservationService.registerReservation(reservationDAO, payload);

  return res.status(201).json({
    success: true,
    message: "Você fez sua reserva com sucesso!",
  });
};

const editHandler = async (req, res) => {
  const payload = req.body;
  const reservationId = req.params.reservationId;
  const reservation = await reservationService.editReservation(
    reservationId,
    reservationDAO,
    payload
  );

  return res.status(200).json({
    success: true,
    message: "Você atualizou sua reserva com sucesso!",
    item: reservation,
  });
};

const cancelHandler = async (req, res) => {
  const reservationId = req.params.reservationId;
  const reservation = await reservationService.cancelReservation(
    reservationId,
    reservationDAO
  );

  return res.status(200).json({
    success: true,
    message: "Você cancelou sua reserva com sucesso",
    item: reservation,
  });
};

const chooseTableHandler = async (req, res) => {
  const reservationId = req.params.reservationId;
  const { tableId } = req.body;

  const info = await reservationService.chooseTable(
    reservationId,
    tableId,
    reservationDAO,
    tableDAO
  );

  return res.status(200).json({
    success: true,
    message: "Você escolheu sua mesa com sucesso!",
    item: info,
  });
};

module.exports = {
  getAllHandler,
  registerHandler,
  editHandler,
  cancelHandler,
  chooseTableHandler,
};
