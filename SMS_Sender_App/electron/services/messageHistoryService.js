import { messageHistoryRepo } from "../repositories/messageHistoryRepo.js";

export const messageHistoryService = {
  getHistory: async (page, limit, sortBy, sortOrder) => {
    return messageHistoryRepo.getPaginated({ page, limit, sortBy, sortOrder });
  },
};
