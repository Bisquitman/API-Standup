import http from 'node:http';
import fs from 'node:fs/promises';

const PORT = 8080;

http
  .createServer(async (request, response) => {
    if (request.method === 'GET' && request.url === '/comedians') {
      try {
        const data = await fs.readFile('./comedians.json', 'utf-8');

        response.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
        });
        response.end(data);
      } catch (error) {
        response.writeHead(500, {
          'Content-Type': 'text/html; charset=utf-8',
        });
        response.end(`<h1>Ошибка сервера: ${error}</h1>`);
      }
    } else {
      response.writeHead(404, {
        'Content-Type': 'text/html; charset=utf-8',
      });
      response.end('<h1>Такая страница не существует</h1>');
    }
  })
  .listen(PORT);

console.log(`Сервер запущен и доступен по адресу http://localhost:${PORT}`);
