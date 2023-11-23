import { sendError, sendResponse } from "./send.js";

export const handleComediansRequest = async (request, response, comedians, id) => {
  if (id) {
    const comedian = comedians.find((c) => c.id === id);

    if (!comedian) {
      sendError(response, 404, "Стендапер не найден");
      return;
    }
    sendResponse(response, comedian);
    return;
  }
  sendResponse(response, comedians);
};
