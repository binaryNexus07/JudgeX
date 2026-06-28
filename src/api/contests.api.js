import apiClient from './client';

export const getContests = async () => {
    return await apiClient.get('/contest/all');
};

export const getContestById = async (id) => {
    return await apiClient.get(`/contest/${id}`);
};
