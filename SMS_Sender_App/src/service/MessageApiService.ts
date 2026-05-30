export const messageHistoryApi = {
  getHistory: async (
    page: number,
    limit: number,
    sortBy?: string,
    sortOrder?: string,
  ) => {
    return await window.api.getMessageHistoryPaginated(
      page,
      limit,
      sortBy,
      sortOrder,
    );
  },
};
