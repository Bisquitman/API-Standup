import fs from "node:fs/promises";
import {createFileIfNotExist} from "./checkFile.js";
import {CLIENTS} from "../index.js";
import {sendError, sendResponse} from "./send.js";
import {readRequestBody} from "./helpers.js";

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
        !newClient.booking.every((item) => item.comedian && item.time))
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
        !updateDataClient.booking.every((item) => item.comedian && item.time))
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

