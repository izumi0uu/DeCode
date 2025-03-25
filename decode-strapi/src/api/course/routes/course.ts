/**
 * course router
 */

export default {
  routes: [
    {
      method: "GET",
      path: "/courses",
      handler: "course.find",
    },
    {
      method: "GET",
      path: "/courses/popular",
      handler: "course.findPopular",
    },
  ],
};
