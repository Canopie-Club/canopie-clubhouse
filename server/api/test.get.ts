export default defineEventHandler(async () => {
  // const users = await useDrizzle().select().from(tables.users)

  // return {
  //   users,
  // };

  // Change Site Ids
  const ids: { from: string, to: string }[] = [
    { from: "eca2f25b-5c7f-4223-b14b-2c6f87574dac", to: "thedukeofnorfolk" },
    { from: "ee8e12c8-4d55-488e-b839-65efc4ee1a44", to: "disco-ordination" },
  ]

  const returnResults = [];

  for (const id of ids) {
    const [site] = await useDrizzle()
      .select().from(tables.sites)
      .where(eq(tables.sites.id, id.from))

    if (!site) {
      console.log(`Site not found: ${id.from}`)
      continue
    }

    const pages = await useDrizzle()
      .select().from(tables.pages)
      .where(eq(tables.pages.siteId, id.from))

    for (const page of pages) {
      await useDrizzle().update(tables.pages).set({ siteId: id.to }).where(eq(tables.pages.id, page.id))
    }

    // const routeRecords = await useDrizzle()
    //   .select().from(tables.routeRecords)
    //   .where(eq(tables.routeRecords.siteId, id.from))

    // for (const record of routeRecords) {
    //   await useDrizzle().update(tables.routeRecords).set({ siteId: id.to }).where(eq(tables.routeRecords.id, record.id))
    // }

    // const siteUsers = await useDrizzle()
    //   .select().from(tables.siteUsers)
    //   .where(eq(tables.siteUsers.siteId, id.from))

    // for (const user of siteUsers) {
    //   await useDrizzle().update(tables.siteUsers).set({ siteId: id.to }).where(eq(tables.siteUsers.id, user.id))
    // }

    // // Update the site ID in the sites table last
    // await useDrizzle().update(tables.sites).set({ id: id.to }).where(eq(tables.sites.id, id.from))
  }

  // return returnResults;
});