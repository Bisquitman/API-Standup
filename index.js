import http from "node:http";
import fs from "node:fs/promises";
import { sendError } from "./modules/send.js";
import { checkFileExist, createFileIfNotExist } from "./modules/checkFile.js";
import { handleComediansRequest } from "./modules/handleComediansRequest.js";
import { handleAddClient } from "./modules/handleAddClient.js";
import { handleClientsRequest } from "./modules/handleClientsRequest.js";
import {handleUpdateClient} from "./modules/handleUpdateClient.js";

const PORT = 8080;
const COMEDIANS = "./comedians.json";
export const CLIENTS = "./clients.json";

const startServer = async (port) => {
  if (!(await checkFileExist(COMEDIANS))) return;
  await createFileIfNotExist(CLIENTS);

  const comediansData = await fs.readFile(COMEDIANS, "utf-8");
  const comedians = JSON.parse(comediansData);

  const server = http.createServer(async (request, response) => {
    try {
      response.setHeader("Access-Control-Allow-Origin", "*");

      const segments = request.url.split("/").filter(Boolean); // Получить все, кроме первого
      console.log("segments: ", segments);

      if (!segments.length) {
        sendError(response, 404, "Страница не найдена");
      }

      // Деструктуризайия segments: segments[0] === resource
      //                            segments[1] === id
      const [resource, id] = segments;

      if (request.method === "GET" && resource === "comedians") {
        handleComediansRequest(request, response, comedians, id);
        return;
      }

      if (request.method === "POST" && resource === "clients") {
        // POST '/clients'
        // Добавление клиента
        handleAddClient(request, response);
        return;
      }

      if (request.method === "GET" && resource === "clients" && id) {
        // GET '/clients/:ticket'
        // Получение клиента по номеру билета
        await handleClientsRequest(request, response, id);
        return;
      }

      if (request.method === "PATCH" && resource === "clients" && id) {
        // PATCH '/clients/:ticket'
        // Изменение данных клиента по номеру билета
        handleUpdateClient(request, response, id);
        return;
      }
      sendError(response, 404, "Страница не найдена");
    } catch (error) {
      sendError(response, 500, `Ошибка сервера: ${error}`);
    }
  });
  server.listen(port, () => {
    console.log(`Сервер запущен и доступен по адресу http://localhost:${port}`);
  });
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Порт ${port} занят. Пробуем запуститься на порту ${port + 1}`);
      startServer(port + 1);
    } else {
      console.log(`Возникла ошибка: ${err}`);
    }
  });
};
startServer(PORT);
