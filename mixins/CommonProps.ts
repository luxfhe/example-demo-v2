import { defineComponent } from 'vue';
import type { Permit } from "@luxfhe/sdk/web";
import { ethers } from "ethers";


export default defineComponent({
  computed: {
  },
  data() {
    return {
      fhePermit: null as Permit | null,
      fheInitialized: false,
      activeContract: null as ethers.Contract | null,

    }
  }
});