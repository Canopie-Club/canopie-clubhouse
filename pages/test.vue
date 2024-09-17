<template>
    <div class="flex h-screen bg-gray-100 dark:bg-gray-900">
        <!-- Sidebar -->
        <aside class="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                <h1 class="text-2xl font-bold text-orange-500">CanopieClub.house</h1>
            </div>
            <ScrollArea class="h-[calc(100vh-5rem)]">
                <nav class="p-4">
                    <div class="mb-4">
                        <Button variant="ghost" class="w-full justify-start">
                            <MapIcon class="mr-2 h-4 w-4" />
                            Disco Ordination
                            <ChevronDownIcon class="ml-auto h-4 w-4" />
                        </Button>
                        <div class="ml-4 mt-2 space-y-2">
                            <Button variant="ghost" size="sm" class="w-full justify-start">
                                <UserIcon class="mr-2 h-4 w-4" />
                                Artists
                            </Button>
                            <Button variant="ghost" size="sm" class="w-full justify-start">
                                <TicketIcon class="mr-2 h-4 w-4" />
                                Ticketing
                            </Button>
                            <Button variant="ghost" size="sm" class="w-full justify-start">
                                <CalendarIcon class="mr-2 h-4 w-4" />
                                Events
                            </Button>
                            <Button variant="ghost" size="sm" class="w-full justify-start">
                                <FileTextIcon class="mr-2 h-4 w-4" />
                                Pages
                                <ChevronDownIcon class="ml-auto h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div class="mb-4">
                        <Button variant="ghost" class="w-full justify-start">
                            <MapIcon class="mr-2 h-4 w-4" />
                            The Duke of Norfolk
                            <ChevronDownIcon class="ml-auto h-4 w-4" />
                        </Button>
                    </div>
                </nav>
            </ScrollArea>
        </aside>

        <!-- Main content -->
        <main class="flex-1 overflow-y-auto">
            <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
                <div class="flex space-x-4">
                    <Button variant="ghost">Sites</Button>
                    <Button variant="ghost">Logout</Button>
                </div>
                <Button variant="ghost" size="icon">
                    <SunIcon class="h-5 w-5" />
                </Button>
            </header>
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
        </main>
    </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapIcon, UserIcon, SettingsIcon, FileTextIcon, CalendarIcon, TicketIcon, ChevronDownIcon, SunIcon } from "lucide-vue-next"

const cardItems = [
    {
        icon: MapIcon,
        title: "Disco Ordination",
        description: "Review or edit the Disco Ordination site."
    },
    {
        icon: MapIcon,
        title: "The Duke of Norfolk",
        description: "Review or edit the The Duke of Norfolk site."
    },
    {
        icon: UserIcon,
        title: "Account",
        description: "Edit your account information."
    },
    {
        icon: SettingsIcon,
        title: "Settings",
        description: "Edit your account settings."
    }
]

definePageMeta({
  layout: 'empty'
})

</script>

<style scoped>

</style>