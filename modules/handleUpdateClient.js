import fs from "node:fs/promises";
import { sendError, sendResponse } from "./send.js";
import { createFileIfNotExist } from "./checkFile.js";
import { CLIENTS } from "../index.js";
import { readRequestBody } from "./helpers.js";

export const handleUpdateClient = async (request, response, ticketNumber) => {
  try {
    const body = await readRequestBody(request);
    const updateDataClient = JSON.parse(body);

    if (!updateDataClient.fullName || !updateDataClient.phone || !updateDataClient.ticketNumber || !updateDataClient.booking) {
      sendError(response, 400, "Неверные данные клиента");
      return;
    }

    if (
      updateDataClient.booking &&
      (!updateDataClient.booking.length ||
        !Array.isArray(updateDataClient.booking) ||
        !updateDataClient.booking.every((item) => item.comediant && item.time))
    ) {
      sendError(response, 400, "Неверно заполнены поля бронирования");
      return;
    }

    await createFileIfNotExist(CLIENTS);
    const clientData = await fs.readFile(CLIENTS, "utf-8");
    const clients = JSON.parse(clientData);

    const clientIndex = clients.findIndex((c) => (c.ticketNumber = ticketNumber));

    if (clientIndex === -1) {
      sendError(response, 404, `Клиент с билетом № ${ticketNumber} не найден`);
    }

    clients[clientIndex] = {
      ...clients[clientIndex],
      ...updateDataClient,
    };

    await createFileIfNotExist(CLIENTS);
    await fs.writeFile(CLIENTS, JSON.stringify(clients));
    sendResponse(response, clients[clientIndex]);
  } catch (error) {
    console.error(`error: ${error}`);
    sendError(response, 500, `Ошибка сервера при обновлении данных`);
  }
};
