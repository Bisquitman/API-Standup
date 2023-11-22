import fs from "node:fs/promises";
import { sendError, sendResponse } from "./send.js";
import { CLIENTS } from "../index.js";
import { createFileIfNotExist } from "./checkFile.js";
import { readRequestBody } from "./helpers.js";

export const handleAddClient = async (request, response) => {
  try {
    const body = await readRequestBody(request);
    const newClient = JSON.parse(body);

    if (!newClient.fullName || !newClient.phone || !newClient.ticketNumber || !newClient.booking) {
      sendError(response, 400, "Неверные данные клиента");
      return;
    }

    if (
      newClient.booking &&
      (!newClient.booking.length ||
        !Array.isArray(newClient.booking) ||
        !newClient.booking.every((item) => item.comediant && item.time))
    ) {
      sendError(response, 400, "Неверно заполнены поля бронирования");
      return;
    }

    await createFileIfNotExist(CLIENTS);
    const clientData = await fs.readFile(CLIENTS, "utf-8");
    const clients = JSON.parse(clientData);

    clients.push(newClient);
    await createFileIfNotExist(CLIENTS);
    await fs.writeFile(CLIENTS, JSON.stringify(clients));

    sendResponse(response, newClient);
  } catch (error) {
    console.log("error: ", error);
    sendError(response, 500, `Ошибка сервера при чтении запроса`);
  }
};
