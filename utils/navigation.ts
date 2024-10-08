import type { NavigationTree } from '@nuxt/ui-pro/types';
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
  children?: SiteLinkTree[]
}

const basicNav = (label: string, icon: string, to: string, description: string, children?: SiteLinkTree[]) => {
  return {
    title: label,
    label,
    icon,
    to,
    description,
    children,
  };
};

export const childrenForSiteType = (site: SiteSummary): SiteLinkTree[] => {
  const type = site.type as SiteType;
  const s = `/sites/${site.id}`
  const h = "i-heroicons-"

  const newsletter = site.extras.includes("NEWSLETTER") ? [
    basicNav("Newsletter", `${h}envelope`, `${s}/newsletter`, "View/Edit your newsletter", [
      basicNav("Contacts", `${h}users`, `${s}/newsletter/contacts`, "Manage your newsletter contacts"),
      basicNav("Letters", `${h}envelope-open`, `${s}/newsletter/letters`, "Create and manage newsletter campaigns"),
      // basicNav("Templates", `${h}document-text`, `${s}/newsletter/templates`, "Design and manage newsletter templates"),
      // basicNav("Analytics", `${h}chart-bar`, `${s}/newsletter/analytics`, "View newsletter performance analytics")
    ])
  ] : []

  const defaults: SiteLinkTree[] = [
    basicNav("Pages", `${h}document`, `${s}/pages`, "Edit your site's menu and page routes", [
      basicNav("Page Routes", `${h}map`, `${s}/routes`, "Edit your site's menu and page routes"),
      basicNav("Blog", `${h}document-text`, `${s}/blog`, "View/Edit your blog"),
      basicNav("Contact Form", `${h}pencil-square`, `${s}/contact-form`, "View/Edit your contact form"),
      basicNav("Additional Pages", `${h}document-duplicate`, `${s}/additional-pages`, "View/Edit your additional pages"),
    ]),
    ...newsletter,
    basicNav("Design", `${h}paint-brush`, `${s}/design`, "View/Edit your design"),
    basicNav("Settings", `${h}cog`, `${s}/settings`, "View/Edit your settings"),
  ]


  const ticketing = site.extras.includes("EVENT_TICKETING") ? [basicNav("Ticketing", `${h}ticket`, `${s}/ticketing`, "View/Edit your ticketing")] : []

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
        basicNav("Discography", `${h}musical-note`, `${s}/discography`, "View/Edit your discography"),
        basicNav("Events", `${h}calendar`, `${s}/events`, "View/Edit your events"),
        ...ticketing,
        ...d,
      ];
    case "RECORD_LABEL":

      return [
        basicNav("Artists", `${h}users`, `${s}/artists`, "View/Edit your artists"),
        ...ticketing,
        basicNav("Events", `${h}calendar`, `${s}/events`, "View/Edit your events"),
        ...defaults,
      ];
    default:
      return defaults;
  }
};