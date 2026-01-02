import appConfig from "../config/appConfig.json";
import { fhe } from "@luxfhe/sdk/web";
import { defineComponent } from 'vue';
import CommonProps from '@/mixins/CommonProps'
import { ethers } from "ethers";


const fromHexString = (hexString: string): Uint8Array => {
  const arr = hexString.replace(/^(0x)/, '').match(/.{1,2}/g);
  if (!arr) return new Uint8Array();
  return Uint8Array.from(arr.map((byte) => parseInt(byte, 16)));
};

export default defineComponent({
  mixins: [ CommonProps ],
  created() {

  },
  data() {
    return {
      usingFaucet: false,
    };
  },
  methods: {
    async getFHETokenBalance(provider: ethers.BrowserProvider, address: string) : Promise<number> {
      try {
        if (this.fheInitialized && this.activeContract !== null) {
          // Get permit using new SDK API
          const permitResult = fhe.getPermit(appConfig.ENC_ERC20_CONTRACT);
          if (!permitResult.success || !permitResult.data) {
            console.log("No permit found");
            return 0;
          }
          const permit = permitResult.data;

          // Get permission from permit
          const permissionResult = fhe.getPermission(permit.getHash());
          if (!permissionResult.success || !permissionResult.data) {
            console.log("No permission found");
            return 0;
          }

          const encryptedBalance = await this.activeContract.balanceOfEncrypted(permissionResult.data);

          // Unseal using new SDK API
          const unsealResult = await fhe.unseal(appConfig.ENC_ERC20_CONTRACT, encryptedBalance);
          if (!unsealResult.success) {
            console.log("Unseal failed");
            return 0;
          }
          const balance = unsealResult.data.toString();
          return Number(balance);

        }
      } catch (err) {
        console.log(err);
      }
      return 0;
    },

    async getCoins(address: string): Promise<any> {
      try {
        const result = await this.$axios.get(`${appConfig.FAUCET_ENDPOINT}?address=${address}`);
        console.log(result);

        if (result.status !== 200) {
          throw new Error(`Failed to get coins from faucet`);
        }
        return result;
      } catch (err) {
        console.log(err);
      }
      return "";
    },
  },
});
