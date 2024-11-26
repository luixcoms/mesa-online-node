const dateTimeValidator = require("../utils/dateAndTimeValidator");

const getAllReservations = async (reservationDAO) => {
  return await reservationDAO.findAllReservations();
};

const validateTime = (currDate, resDate, resTime) => {
  if (resDate === dateTimeValidator.asDateString(currDate)) {
    if (resTime < dateTimeValidator.asTimeString(currDate)) {
      throw {
        status: 400,
        message: "ERROR: Horário no passado!",
      };
    }
  }
};

const checkClosingOpeningTime = (resTime) => {
  if (resTime > "23:00:59") {
    throw {
      status: 400,
      message:
        "A reserva deve ser feita pelo menos uma hora antes do horário de fechamento (12h00)",
    };
  } else if (resTime < "11:00:59") {
    throw {
      status: 400,
      message: "Você não pode fazer reserva antes do horário de funcionamento! (11h00)",
    };
  }
};

const isFieldEmpty = (payload) => {
  if (
    !payload.firstName ||
    !payload.lastName ||
    !payload.phone ||
    !payload.email ||
    !payload.resDate ||
    !payload.resTime ||
    !payload.people
  ) {
    throw {
      status: 400,
      message: "Por favor preencha todos os campos",
    };
  }
};

const registerReservation = async (reservationDAO, payload) => {
  isFieldEmpty(payload);
  validateTime(new Date(), payload.resDate, payload.resTime);
  checkClosingOpeningTime(payload.resTime);
  return await reservationDAO.createReservation(payload);
};

const editReservation = async (reservationId, reservationDAO, payload) => {
  const reservation = await reservationDAO.findReservationById(reservationId);
  if (!reservation)
    throw {
      status: 404,
      message: "Reserva não encontrada!",
    };
  validateTime(new Date(), payload.resDate, payload.resTime);
  checkClosingOpeningTime(payload.resTime);
  return await reservationDAO.updateReservation(reservationId, payload);
};

const cancelReservation = async (reservationId, reservationDAO) => {
  const reservation = await reservationDAO.findReservationById(reservationId);
  if (reservation) return await reservationDAO.deleteReservation(reservation);

  throw {
    status: 400,
    message: "Dada reserva não existe!",
  };
};

const compareResDateToCurrDate = (resDate, currDate) => {
  return resDate > currDate ? 1 : resDate < currDate ? -1 : 0;
};

const chooseTable = async (
  reservationId,
  tableId,
  reservationDAO,
  tableDAO
) => {
  let reservation = await reservationDAO.findReservationById(reservationId);
  if (!reservation) {
    throw {
      status: 404,
      message: "Reserva não encontrada!",
    };
  }
  const table = await tableDAO.findTableById(tableId);

  const currDate = new Date();
  const currDateStr = dateTimeValidator.asDateString(currDate);

  /**
   * if the reservation day is in the future (compared to current date)
   *  => throw error
   */
  if (compareResDateToCurrDate(reservation.resDate, currDateStr) === 1) {
    throw {
      status: 400,
      message: "A reserva de mesa só está disponível na data da reserva!",
    };
  }

  /**
   * if the reservation day is in the past (compared to current date)
   *  => update the reservation's status to 'missed'
   */

  if (compareResDateToCurrDate(reservation.resDate, currDateStr) === -1) {
    await reservationDAO.setReservationStatus(reservation, "missed");
  }

  /**
   * If the reservation day is equal to current day
   *  and reservation time is the past (compared to current date - 30 minutes)
   *  => update the reservation's status to missed
   */
  if (compareResDateToCurrDate(reservation.resDate, currDateStr) === 0) {
    const currTimePlus30minsStr = dateTimeValidator.asTimeString(
      new Date(currDate.setMinutes(currDate.getMinutes() - 2))
    );
    if (currTimePlus30minsStr > reservation?.resTime) {
      reservation = await reservationDAO.setReservationStatus(
        reservation,
        "missed"
      );
    }
  }
  /**
   *
   * if reservation.resStatus === 'seated'
   *  => throw error => "You've already reserved a table. Please make a new reservation."
   * if reservation.resStatus === 'missed'
   *  => throw error => "You've missed your reservation date"
   */
  if (reservation.resStatus === "seated") {
    throw {
      status: 400,
      message:
        "Você já reservou uma mesa! Por favor faça uma nova reserva.",
    };
  } else if (reservation.resStatus === "missed") {
    throw {
      status: 400,
      message:
        "Você perdeu a data e hora da reserva! Por favor faça uma nova reserva.",
    };
  }
  /**
   *
   * If the given table is already occupied throw an error
   */
  if (table.isOccupied)
    throw {
      status: 400,
      message: "Mesa já reservada!",
    };

  /**
   *
   * If the given reservation's party size is bigger than the table's capacity =>
   *  throw Error
   *  else => create the record
   */
  if (reservation.people > table.capacity)
    throw {
      status: 400,
      message: "O tamanho da festa da reserva é muito grande para esta mesa!",
    };

  return await reservationDAO.setReservationTable(reservationId, tableId);
};

module.exports = {
  getAllReservations,
  registerReservation,
  editReservation,
  cancelReservation,
  chooseTable,
};
