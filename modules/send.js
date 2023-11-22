export const sendResponse = (response, data) => {
  response.writeHead(200, {
    'Content-Type': 'application/json; charset=utf-8',
  });
  response.end(JSON.stringify(data));
};

export const sendError = (response, statusCode, errMessage) => {
  response.writeHead(statusCode, {
    'Content-Type': 'text/html; charset=utf-8',
  });
  response.end(errMessage);
};
