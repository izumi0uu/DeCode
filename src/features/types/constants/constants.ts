export const LESSON_LIGHT_FIELDS = [
  "id",
  "title",
  "slug",
  "description",
  "videoUrl",
  "duration",
  "sortOrder",
  "isPreview",
  "publishedAt",
  "createdAt",
  "updatedAt",
] as const;

export const COURSE_LIGHT_FIELDS = ["id", "title", "slug", "locale"] as const;

export const QUIZ_LIGHT_FIELDS = ["id", "title", "passingScore"] as const;
