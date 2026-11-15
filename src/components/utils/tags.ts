type TagLike = { title?: string | null; tag?: { title?: string | null } };

/**
 * Whether a record carries a tag with this title, ignoring case.
 *
 * Takes `unknown` tags because the SDK types disagree with the API: profiles
 * are typed `{ tagId, tag: { title } }` but come back as `{ id, title }`, and
 * pages aren't typed as having tags at all though the API returns them. Both
 * shapes are accepted.
 */
export const hasTag = (record: object, title: string) => {
  const tags = (record as { tags?: unknown }).tags;
  if (!Array.isArray(tags)) return false;

  const wanted = title.toLowerCase();
  return tags.some((tag: TagLike) => {
    const tagTitle = tag?.tag?.title ?? tag?.title;
    return tagTitle?.toLowerCase() === wanted;
  });
};
