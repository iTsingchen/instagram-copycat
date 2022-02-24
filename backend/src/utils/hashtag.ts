export const extractHashtags = (caption?: string | null) => {
  if (!caption) return [];

  const hashtags = caption.match(/#[\w]+/g) || [];
  return hashtags.map((hashtag) => ({ hashtag }));
};
