/**
 * course service
 */

import { factories } from "@strapi/strapi";

async function findPopular(options = {}) {
  try {
    const courses = await strapi.db.query("api::course.course").findMany({
      filters: {
        isPopular: true,
        published: true,
      },
    });

    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        const enrollmentCount = await strapi.db
          .query("api::user-course-progress.user-course-progress")
          .count({
            where: { course: course.id },
          });
        return {
          ...course,
          enrollmentCount,
        };
      })
    );

    return coursesWithStats;
  } catch (error) {
    console.error("Error finding popular courses:", error);
    throw error;
  }
}

export default factories.createCoreService("api::course.course", {
  findPopular,
});
