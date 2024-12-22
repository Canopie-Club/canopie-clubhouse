import { computed } from 'vue';

export const useNavigation = () => {
    const sites = useSites();

    // console.log(sites.value)

    return computed((): SiteLinkTree[] => {
        return [
            ...(sites.value || []).map(
                (site) =>
                ({
                    id: site.id,
                    label: site.name,
                    icon: "i-heroicons-map",
                    to: `/sites/${site.id}`,
                    children: childrenForSiteType(site),
                } as SiteLinkTree)
            ),
            {
                label: "Account",
                icon: "i-heroicons-user-circle",
                to: "/account",
                children: [
                    {
                        label: "Profile",
                        icon: "i-heroicons-user",
                        to: "/account/profile",
                    },
                    {
                        label: "Settings",
                        icon: "i-heroicons-cog",
                        to: "/account/settings",
                    },
                    {
                        label: "Create New Site",
                        icon: "i-heroicons-plus",
                        to: "/create/site",
                    },
                ],
            },
        ];
    });
}