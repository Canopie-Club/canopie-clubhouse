import { readFileSync } from "fs";

interface Page {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  path: string;
  content: string;
  siteId: string;
}

interface CleanPage extends Omit<Page, "createdAt" | "updatedAt"> {}

interface Site {
  id: string;
  name: string;
  template: string;
  createdAt: Date;
  updatedAt: Date;
  pages: Page[];
  routes: Route[];
}

interface CleanSite extends Omit<Site, "pages" | "routes" | "createdAt" | "updatedAt"> {}

interface Route {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  domain: string;
  subdomain: string;
  siteId: string;
}

interface CleanRoute extends Omit<Route, "createdAt" | "updatedAt"> {}

export default defineTask({
  meta: {
    name: "db:seed-sites",
    description: "Run database seed sites task",
  },
  async run() {
    console.log("Running DB seed sites task...");

    const sites = JSON.parse(
      readFileSync("./dev/data/secret/sites.json", "utf-8")
    ) as Site[];
    const pages = sites.flatMap((site) => site.pages);
    const routes = sites.flatMap((site) => site.routes);

    const cleanSites: CleanSite[] = sites.map(({ pages, routes, createdAt, updatedAt, ...cleanSite }) => cleanSite);
    const cleanPages: CleanPage[] = pages.map(({ createdAt, updatedAt, ...cleanPage }) => cleanPage);
    const cleanRoutes: CleanRoute[] = routes.map(({ createdAt, updatedAt, ...cleanRoute }) => cleanRoute);

    await useDrizzle().insert(tables.sites).values(cleanSites);

    await useDrizzle().insert(tables.pages).values(cleanPages);

    await useDrizzle().insert(tables.routeRecords).values(cleanRoutes);

    return {
      result: "success",
      sites: sites.length,
      pages: pages.length,
      routes: routes.length,
    };
  },
});
