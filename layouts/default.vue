<template>
  <div class="flex flex-col min-h-screen ">
    <div class="flex-grow">
      <Header />
      <nuxt class="bodymain container mx-auto px-6 pt-20 " />
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from '~/components/Header'
import Footer from '~/components/Footer'

export default {
  components: {
    Header,
    Footer
  }
}
</script>

<style lang="postcss">
@tailwind preflight;
@tailwind utilities;

/* #__layout, */

html,
body,
p,
span {
  @apply m-0 p-0 font-serif;
}

a,
button {
  @apply no-underline text-black font-bold;
}

section img {
  @apply w-full;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  @apply my-6;
}
.body-main {
  @apply leading-normal text-lg;
}
.body-text {
  @apply mb-4 font-serif;
}
.body-text p {
  @apply my-6;
}

.bodymain a,
.link-style {
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-color: #509eff;
  text-decoration-thickness: 3px;
  text-decoration-skip-ink: none;
}
code[class*='language-'],
code span {
  @apply font-mono  !important;
}
img {
  @apply my-4;
}
.search-input {
  transition: all 0.5s;
  @apply w-full flex border-b border-b-4 border-grey-light py-2;
}

.search-input:focus-within {
  @apply border-highlight border-b border-b-8 text-black;
}
.search-input input {
  transition: all 0.5s;
}
.search-input input:focus {
  @apply text-black;
}
</style>
