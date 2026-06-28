import apiClient from './client';

export const getProblems = async (params = {}) => {
    // Expected query params: page, limit, difficulty, tags, title
    const query = new URLSearchParams(params).toString();
    const url = query ? `/problem/all?${query}` : '/problem/all';
    return await apiClient.get(url);
};

export const getProblemBySlug = async (slug) => {
    return await apiClient.get(`/problem/${slug}`);
};
