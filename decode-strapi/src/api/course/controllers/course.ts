/**
 * course controller
 */

import { factories } from "@strapi/strapi";
import { Context } from "koa";

async function findPopular(ctx: Context) {
  try {
    const popularCourses = await strapi
      .service("api::course.course")
      .findPopular();

    return { data: popularCourses };
  } catch (error) {
    ctx.throw(500, error);
  }
}

export default factories.createCoreController("api::course.course", {
  findPopular,
});
