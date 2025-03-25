/**
 * course service
 */

import { factories } from "@strapi/strapi";

async function findPopular() {
  try {
    const courses = await strapi.entityService.findMany("api::course.course", {
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

    const pagination = {
      page: 1,
      pageSize: 10,
      pageCount: 1,
      total: coursesWithStats.length,
    };

    return {
      data: coursesWithStats,
      meta: {
        pagination,
      },
    };
  } catch (error) {
    console.error("Error finding popular courses:", error);
    throw error;
  }
}

export default factories.createCoreService("api::course.course", {
  findPopular,
});
