<template>
  <div>
    <Dialog :open="isLinkDialogOpen" @update:open="isLinkDialogOpen = $event">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Link</DialogTitle>
          <DialogDescription> Enter the URL for the link you want to add. </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="url" class="text-right">URL</Label>
            <Input
              id="url"
              v-model="linkUrl"
              placeholder="https://example.com"
              class="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button @click="closeLinkDialog">Cancel</Button>
          <Button @click="addLink" variant="default">Add Link</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";

const isLinkDialogOpen = ref(false);
const linkUrl = ref("");
const linkDialogPromiseResolve = ref<((value: string | null) => void) | null>(null);

const openLinkDialog = (startingUrl?: string) => {
  linkUrl.value = startingUrl || "";
  isLinkDialogOpen.value = true;
};

const closeLinkDialog = (clearUrl: boolean = true) => {
  isLinkDialogOpen.value = false;
  if (clearUrl) {
    linkUrl.value = "";
  }
  linkDialogPromiseResolve.value?.(null);
  linkDialogPromiseResolve.value = null;
};

const addLink = () => {
  linkDialogPromiseResolve.value?.(linkUrl.value);
  linkDialogPromiseResolve.value = null;
  closeLinkDialog(false);
};

const getLinkUrl = async () => {
  openLinkDialog();
  return new Promise<string | null>((resolve) => {
    linkDialogPromiseResolve.value = resolve;
  });
};

defineExpose({
  getLinkUrl,
});
</script>

<style scoped></style>
