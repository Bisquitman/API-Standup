import { sendError, sendResponse } from "./send.js";

export const handleComediansRequest = async (request, response, comedians, id) => {
  if (id) {
    const comediant = comedians.find((c) => c.id === id);

    if (!comediant) {
      sendError(response, 404, "Стендапер не найден");
      return;
    }
    sendResponse(response, comediant);
    return;
  }
  sendResponse(response, comedians);
};
