import { backendApi } from "./backendClient";

export const getDiscussions = async () => {
  const { data } = await backendApi.get("/discussions");
  return data.discussions;
};

export const getDiscussion = async (id) => {
  const { data } = await backendApi.get(`/discussions/${id}`);
  return data.discussion;
};

export const createDiscussion = async ({ mediaId, mediaType, title, content }) => {
  const { data } = await backendApi.post("/discussions", {
    mediaId,
    mediaType,
    title,
    content,
  });
  return data.discussion;
};

export const deleteDiscussion = async (id) => {
  const { data } = await backendApi.delete(`/discussions/${id}`);
  return data;
};

export const getComments = async (discussionId) => {
  const { data } = await backendApi.get(`/discussions/${discussionId}/comments`);
  return data.comments;
};

export const createComment = async (discussionId, content) => {
  const { data } = await backendApi.post(`/discussions/${discussionId}/comments`, {
    content,
  });
  return data.comment;
};

export const deleteComment = async (commentId) => {
  const { data } = await backendApi.delete(`/comments/${commentId}`);
  return data;
};
