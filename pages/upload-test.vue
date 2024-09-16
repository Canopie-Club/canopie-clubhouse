<template>
  <UPageBody>
    <UContainer>
      <form @submit.prevent="uploadImage">
        <label>Upload an image: <input type="file" name="image" /></label>
        <button type="submit">Upload</button>
      </form>
    </UContainer>
  </UPageBody>
</template>

<script setup lang="ts">
async function uploadImage(e: Event) {
  const form = e.target as HTMLFormElement;

  const body = new FormData(form);
  // Log file
  // console.log(body.get("image"));

  const result = await $fetch("/api/upload", {
    method: "POST",
    body,
  }).catch((err) => alert("Failed to upload image:\n" + err.data?.message));

  console.log(result);

  form.reset();
}
</script>
