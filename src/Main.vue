<template>
  <div class="container">
    <Toggler />
    <router-link to="/saharok-store">
      <h3 style="margin-top: 30vh">Saharok Store</h3>
    </router-link>
  </div>
</template>

<script>
import Toggler from '@/Toggler'

export default {
  name: 'Main',
  components: {
    Toggler
  }
}
</script>
