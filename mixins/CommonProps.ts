import { defineComponent } from 'vue';
import { LuxFHEClient } from "luxfhejs";
import { ethers } from "ethers";


export default defineComponent({
  computed: {
  },
  data() {
    return {
      fheClient: null as LuxFHEClient | null,
      activeContract: null as ethers.Contract | null,

    }
  }
});