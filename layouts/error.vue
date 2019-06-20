<template>
  <div class="nuxt-error">
    <component :is="errorPage" :error="error" />
  </div>
</template>

<script>
import error404 from '~/components/error/404.vue';
//import error500 from '~/components/error/500.vue';

export default {
  name: 'nuxt-error',
  layout: 'default', // optional
  props: {
    error: {
      type: Object,
      default: () => {},
    },
  },
    computed: {
        errorPage() {
            return error404
    }   
  }
}
</script>