import fs from "node:fs/promises";
import { sendError, sendResponse } from "./send.js";
import { CLIENTS } from "../index.js";
import { createFileIfNotExist } from "./checkFile.js";

export const handleClientsRequest = async (request, response, ticketNumber) => {
  try {
    await createFileIfNotExist(CLIENTS);

    const clientData = await fs.readFile(CLIENTS, "utf-8");
    const clients = JSON.parse(clientData);
    const client = clients.find((c) => c.ticketNumber === ticketNumber);

    if (!client) {
      sendError(response, 404, `Клиент с билетом № ${ticketNumber} не найден`);
      return;
    }

    sendResponse(response, client);
  } catch (error) {
    console.error(`Ошибка при обработке запроса: ${error}`);
    sendError(response, 500, `Ошибка сервера при обработке запроса: ${error}`);
  }
};
