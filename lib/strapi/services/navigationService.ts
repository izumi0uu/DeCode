async function getCacheNavigation() {
  const res = await fetch(`${process.env.STRAPI_URL}/api/navigation`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
    },
    next: {
      tags: ["navigation"],
      revalidate: 3600,
    },
  });
  const data = await res.json();
  return data;
}

export { getCacheNavigation };
