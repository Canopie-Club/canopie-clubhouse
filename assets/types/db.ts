import type { InferSelectModel } from 'drizzle-orm';
import type { Role, SiteExtra, SiteType } from '~/server/database/schema';

export type User = InferSelectModel<typeof tables.users>

export type Site = InferSelectModel<typeof tables.sites>

export type SiteSummary = {
    id: Site['id']
    name: Site['name']
    type: Site['type']
    extras: SiteExtraType[]
}

export type Page = InferSelectModel<typeof tables.pages>

export type SiteUser = InferSelectModel<typeof tables.siteUsers>

export type UserSession = InferSelectModel<typeof tables.userSessions>

export type UserRole = InferSelectModel<typeof tables.userRoles>

export type RouteRecord = InferSelectModel<typeof tables.routeRecords>

export type SiteExtra = InferSelectModel<typeof tables.siteExtras>

export type RoleType = keyof typeof Role

export type SiteType = keyof typeof SiteType

export type SiteExtraType = keyof typeof SiteExtra

export type BackupData = {
    users: User[]
    sites: Site[]
    pages: Page[]
    siteUsers: SiteUser[]
    userSessions: UserSession[]
    userRoles: UserRole[]
    routeRecords: RouteRecord[]
    siteExtras: SiteExtra[]
}