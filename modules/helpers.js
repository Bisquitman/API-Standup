export const readRequestBody = (req) => new Promise((resolve, reject) => {
  let body = '';

  // Аналог addEventListener на фронте, срабатывает по событию 'data'
  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    resolve(body);
  });

  req.on('error', (err) => {
    reject(err);
  });
});