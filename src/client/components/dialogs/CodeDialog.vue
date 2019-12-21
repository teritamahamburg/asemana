<template>
  <v-dialog :value="value" persistent max-width="300">
    <v-card>
      <v-tabs grow v-model="type">
        <v-tab :disabled="transferring">Barcode</v-tab>
        <v-tab :disabled="transferring">Machine</v-tab>
      </v-tabs>
      <template v-if="type === 0">
        <div style="display: flex; justify-content: center;margin-top: 32px">
          <barcode v-if="text" :value="text" />
        </div>
      </template>
      <template v-else>
        <div class="print--card">
          <canvas width="250" height="250" ref="transferCanvas"/>
          <v-text-field class="timimg" type="number" label="Timing" v-model="time"/>
        </div>
      </template>
      <v-card-actions>
        <v-btn
          v-if="type === 1"
          outlined
          v-show="text"
          @click="clickTransfer"
          :disabled="transferring"
        >
          Transfer
        </v-btn>
        <v-spacer/>
        <v-btn outlined :disabled="transferring" @click="() => $emit('change', false)">
          close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Barcode from '@/components/Barcode.vue';

export default {
  name: 'CodeDialog',
  components: {
    Barcode,
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: undefined,
    },
  },
  watch: {
    value() {
      this.type = 0;
    },
    type(val) {
      if (val === 1) {
        this.clickPrintMachine();
      }
    },
  },
  data() {
    return {
      type: 0,
      transferring: false,
      time: 35,
    };
  },
  methods: {
    clickPrintMachine() {
      this.type = 1;
      this.$nextTick(() => {
        const canvas = this.$refs.transferCanvas;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#F00';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });
    },
    clickTransfer() {
      requestAnimationFrame((startTime) => {
        let start = startTime;
        const bin = `32${this.text
          .split('')
          .map((c) => (c === ','
            ? '10'
            : Number(c).toString(2).padStart(4, '0')
              .split('')
              .join('2')
          ))
          .join('2')
        }23`;
        const canvas = this.$refs.transferCanvas;
        const ctx = canvas.getContext('2d');

        let i = 0;
        let b = 0;
        const render = (timestamp) => {
          if (timestamp - start >= this.time) {
            start = timestamp;
            if (bin.length === i) {
              this.transferring = false;
              return;
            }
            if (b % 5 === 0) {
              ctx.fillStyle = ['#00F', '#0F0', '#000', '#F00'][bin[i]];
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              i += 1;
            }
            b += 1;
          }
          requestAnimationFrame(render);
        };
        this.transferring = true;
        render();
      });
    },
  },
  created() {
    window.onafterprint = () => {
      this.$store.commit('setPrintQR', false);
    };
  },
};
</script>

<style scoped lang="scss">
  .print--card {
    display: flex;
    flex-direction: column;
    padding: 8px;
    justify-content: center;
    align-items: center;

    & .timimg {
      align-self: flex-end;
      margin-right: 24px;
      width: 60px;
    }
  }
</style>
