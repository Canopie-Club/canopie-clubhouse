import { computed } from 'vue';
import type { NavigationTree } from '@nuxt/ui-pro/types';

export const useNavigation = () => {
    const sites = useSites();

    return computed((): NavigationTree[] => {
        return [
            ...(sites.value || []).map(
                (site) =>
                ({
                    id: site.id,
                    label: site.name,
                    icon: "i-heroicons-map",
                    to: `/sites/${site.id}`,
                    children: childrenForSiteType(site),
                } as NavigationTree)
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
                ],
            },
        ];
    });
}