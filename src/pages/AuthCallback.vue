<script setup>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

console.log("실행되니?? auth")
store.dispatch('saveToken')
  .then(() => store.dispatch('getMemberInfo'))
  .then(() => router.push('/main'))
  .catch(error => console.error(error))
</script>
