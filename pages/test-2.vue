<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-900">
    <LayoutHeaderShad :navMenu="navMenu">
      <template #content>
        <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card v-for="(item, index) in cardItems" :key="index">
            <CardHeader class="flex flex-row items-center space-x-4">
              <component :is="item.icon" class="h-8 w-8 text-orange-500" />
              <div>
                <CardTitle>{{ item.title }}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ item.description }}</p>
            </CardContent>
          </Card>
        </div>
      </template>
    </LayoutHeaderShad>
    <!-- Sidebar -->
    <!-- <aside class="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        </aside> -->

    <!-- Main content -->
    <!-- <main class="flex-1 overflow-y-auto"> -->
    <!-- <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
                <div class="flex space-x-4">
                    <Button variant="ghost">Sites</Button>
                    <Button variant="ghost">Logout</Button>
                </div>
                <Button variant="ghost" size="icon">
                    <SunIcon class="h-5 w-5" />
                </Button>
            </header> -->
    <!-- <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card v-for="(item, index) in cardItems" :key="index">
                    <CardHeader class="flex flex-row items-center space-x-4">
                        <component :is="item.icon" class="h-8 w-8 text-orange-500" />
                        <div>
                            <CardTitle>{{ item.title }}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ item.description }}</p>
                    </CardContent>
                </Card>
            </div> -->
    <!-- </main> -->
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MapIcon,
  UserIcon,
  SettingsIcon,
  FileTextIcon,
  CalendarIcon,
  TicketIcon,
  ChevronDownIcon,
  SunIcon,
  FileIcon,
} from "lucide-vue-next";

interface NavItem {
  name: string;
  href: string;
  icon: any;
  current?: boolean;
  children?: NavItem[];
}

interface NavMenu {
  mainNav: NavItem[];
  secondaryNav: NavItem[];
}

const navMenu: NavMenu = {
  mainNav: [
    {
      name: "Disco Ordination",
      href: "/disco-ordination",
      icon: MapIcon,
      children: [
        {
          name: "Artists",
          href: "/artists",
          icon: UserIcon,
        },
        {
          name: "Ticketing",
          href: "/ticketing",
          icon: TicketIcon,
        },
        {
          name: "Events",
          href: "/events",
          icon: CalendarIcon,
        },
        {
          name: "Pages",
          href: "/pages",
          icon: FileIcon,
          children: [
            {
              name: "Page Routes",
              href: "/page-routes",
              icon: MapIcon,
            },
            {
              name: "Blog",
              href: "/blog",
              icon: FileTextIcon,
            },
          ],
        },
      ],
    },
    {
      name: "The Duke of Norfolk",
      href: "/the-duke-of-norfolk",
      icon: MapIcon,
      children: [],
    },
    {
      name: "Account",
      href: "/account",
      icon: UserIcon,
    },
  ],
  secondaryNav: [
    {
      name: "Settings",
      href: "/settings",
      icon: SettingsIcon,
    },
  ],
};

const cardItems = [
  {
    icon: MapIcon,
    title: "Disco Ordination",
    description: "Review or edit the Disco Ordination site.",
  },
  {
    icon: MapIcon,
    title: "The Duke of Norfolk",
    description: "Review or edit the The Duke of Norfolk site.",
  },
  {
    icon: UserIcon,
    title: "Account",
    description: "Edit your account information.",
  },
  {
    icon: SettingsIcon,
    title: "Settings",
    description: "Edit your account settings.",
  },
];

definePageMeta({
  layout: "empty",
});
</script>

<style scoped></style>
