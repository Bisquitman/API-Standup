import http from 'node:http';
import fs from 'node:fs/promises';

const PORT = 8080;
const COMEDIANS = './comedians.json';
const CLIENTS = './clients.json';

const checkFiles = async () => {
  try {
    await fs.access(COMEDIANS);
  } catch (error) {
    console.error(`Файл ${COMEDIANS} не найден`);
    return false;
  }

  try {
    await fs.access(CLIENTS);
  } catch (error) {
    await fs.writeFile(CLIENTS, JSON.stringify([]));
    console.log(`Файл ${CLIENTS} был создан`);
    return false;
  }

  return true;
};

const sendResponse = (response, data) => {
  response.writeHead(200, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  });
  response.end(data);
};

const sendError = (response, statusCode, errMessage) => {
  response.writeHead(statusCode, {
    'Content-Type': 'text/html; charset=utf-8',
  });
  response.end(errMessage);
};

const startServer = async () => {
  if (!(await checkFiles())) return;

  http
    .createServer(async (request, response) => {
      try {
        const segments = request.url.split('/').filter(Boolean); // Получить все, кроме первого
        console.log('segments: ', segments);

        if (request.method === 'GET' && segments[0] === 'comedians') {
          const data = await fs.readFile(COMEDIANS, 'utf-8');

          if (segments.length === 2) {
            const comediant = JSON.parse(data).find(
              (c) => c.id === segments[1],
            );

            if (!comediant) {
              sendError(response, 404, 'Стендапер не найден');
              return;
            }
            sendResponse(response, JSON.stringify(comediant));
            return;
          }
          sendResponse(response, data);
          return;
        }

        if (request.method === 'POST' && segments[0] === 'clients') {
          // POST '/clients'
          // Добавление клиента
        }

        if (
          request.method === 'GET' &&
          segments[0] === 'clients' &&
          segments.length === 2
        ) {
          // GET '/clients/:ticket'
          // Получение клиента по номеру билета
        }

        if (
          request.method === 'PATCH' &&
          segments[0] === 'clients' &&
          segments.length === 2
        ) {
          // PATCH '/clients/:ticket'
          // Изменение данных клиента по номеру билета
        }
        sendError(response, 404, 'Страница не найдена');
      } catch (error) {
        sendError(response, 500, `Ошибка сервера: ${error}`);
      }
    })
    .listen(PORT);

  console.log(`Сервер запущен и доступен по адресу http://localhost:${PORT}`);
};
startServer();
