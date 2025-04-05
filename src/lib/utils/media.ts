import { Media } from "@/features/types/api/common";

/**
 * 从Strapi媒体对象中获取图片URL
 * @param media Strapi媒体对象或null
 * @param format 可选的图片格式 (thumbnail, small, medium, large)
 * @returns 图片URL或null
 */
export const getStrapiMediaUrl = (
  media: Media | null,
  format: string = "medium"
): string | null => {
  if (!media) return null;

  // 如果media是数组，取第一个
  const mediaItem = Array.isArray(media) ? media[0] : media;
  if (!mediaItem) return null;

  // 优先使用指定格式
  if (mediaItem.formats && mediaItem.formats[format]) {
    return mediaItem.formats[format].url;
  }

  // 如果指定格式不存在，使用原始URL
  return mediaItem.url || null;
};
