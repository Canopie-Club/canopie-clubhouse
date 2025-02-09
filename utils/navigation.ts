import clone from 'just-clone';
import type { SiteSummary, SiteType } from '~/assets/types/db';

export interface SiteLinkTree {
  title?: string;
  description?: string;
  label?: string;
  to?: string;
  icon?: string
  iconClass?: string
  badge?: string
  comingSoon?: boolean
  children?: SiteLinkTree[]
  function?: () => void
}

const basicNav = (label: string, icon: string, to: string, description: string, extend?: Partial<SiteLinkTree>) => {
  return {
    title: label,
    label,
    icon,
    to,
    description,
    ...extend,
  };
};

export const childrenForSiteType = (site: SiteSummary): SiteLinkTree[] => {
  const type = site.type as SiteType;
  const s = `/sites/${site.id}`
  const h = "i-heroicons-"

  const newsletter = site.extras.includes("NEWSLETTER") ? [
    basicNav("Newsletter", `${h}envelope`, `${s}/newsletter`, "View/Edit your newsletter", {
      comingSoon: true,
      children: [
        basicNav("Contacts", `${h}users`, `${s}/newsletter/contacts`, "Manage your newsletter contacts"),
        basicNav("Letters", `${h}envelope-open`, `${s}/newsletter/letters`, "Create and manage newsletter campaigns"),
        // basicNav("Templates", `${h}document-text`, `${s}/newsletter/templates`, "Design and manage newsletter templates"),
        // basicNav("Analytics", `${h}chart-bar`, `${s}/newsletter/analytics`, "View newsletter performance analytics")
      ]
    })
  ] : []

  const defaults: SiteLinkTree[] = [
    basicNav("Website", `${h}document`, `${s}/site`, "Edit your site's menu and page routes", {
      children: [
        basicNav("Page Routes", `${h}map`, `${s}/site/routes`, "Edit your site's menu and page routes", { comingSoon: true }),
        // basicNav("Homepage", `${h}home`, `${s}/homepage`, "Edit your homepage"),
        // basicNav("Blog", `${h}document-text`, `${s}/blog`, "View/Edit your blog"),
        // basicNav("Contact Form", `${h}pencil-square`, `${s}/contact-form`, "View/Edit your contact form"),
        basicNav("Pages", `${h}document-duplicate`, `${s}/site/pages`, "View/Edit your site’s pages"),
        basicNav("Design", `${h}paint-brush`, `${s}/site/design`, "View/Edit your design", { comingSoon: true }),
      ]
    }),
    ...newsletter,
    basicNav("Users", `${h}users`, `${s}/users`, "View/Edit your site’s users"),
    basicNav("Settings", `${h}cog`, `${s}/settings`, "View/Edit your settings", {
      comingSoon: true
    }),
  ]


  const ticketing = site.extras.includes("EVENT_TICKETING") ? [basicNav("Ticketing", `${h}ticket`, `${s}/ticketing`, "View/Edit your ticketing", {
    comingSoon: true
  })] : []

  switch (type) {
    case "MUSICIAN":
      const d = clone(defaults)
      const pages = d.find((d) => d.title === "Pages")
      const epk = basicNav("EPK", `${h}newspaper`, `${s}/epk`, "View/Edit your EPK")
      if (pages) {
        if (!pages.children) pages.children = []
        pages.children.push(epk)
      }

      return [
        basicNav("Discography", `${h}musical-note`, `${s}/discography`, "View/Edit your discography", {
          comingSoon: true
        }),
        basicNav("Events", `${h}calendar`, `${s}/events`, "View/Edit your events", {
          comingSoon: true
        }),
        ...ticketing,
        ...d,
      ];
    case "RECORD_LABEL":

      return [
        basicNav("Artists", `${h}users`, `${s}/artists`, "View/Edit your artists", {
          comingSoon: true
        }),
        ...ticketing,
        basicNav("Events", `${h}calendar`, `${s}/events`, "View/Edit your events", {
          comingSoon: true
        }),
        ...defaults,
      ];
    default:
      return defaults;
  }
};