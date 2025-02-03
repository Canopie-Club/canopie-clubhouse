<template>
  <div class="bg-textured">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style lang="scss">

@font-face {
  font-family: 'Calvin & Hobbes';
  src: url('/fonts/Ch-Regular.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
}


.textured,
.bg-textured {
  // @apply bg-linen-100;
  /* @apply text-linen-700; */
  background-image: url("/texture/asfalt-dark.png");
  /* background-image: url("/texture/asfalt-light.png"); */
  background-repeat: repeat;
  /* background-size: auto; */
  background-size: 233px 147px;
  background-position: center;
}

</style>
