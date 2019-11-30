<template>
  <div>
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-right="40"
      transition="scale-transition"
      offset-y
      min-width="290px"
    >
      <template v-slot:activator="{ on: { click } }">
        <!-- append-outer-icon without null -->
        <v-text-field
          v-model="date"
          v-mask="'####-##-##'"
          :label="labelWithPattern"
          :placeholder="placeholder"
          :append-outer-icon="$vuetify.icons.values.custom.close"
          @click:append-outer="$emit('change', undefined)"
          :append-icon="$vuetify.icons.values.custom.inputDate"
          @click:append="click"
          :disabled="disabled"
          :rules="[...rules, dateRule]"
          mask="####-##-##"
          return-masked-value
        ></v-text-field>
      </template>
      <v-date-picker v-model="wrapDate" @input="menu = false"></v-date-picker>
    </v-menu>
  </div>
</template>

<script>
import { mask } from 'vue-the-mask';

export default {
  name: 'DatePicker',
  directives: {
    mask,
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    label: {
      type: String,
      default: 'DatePicker',
    },
    placeholder: {
      type: String,
      default: undefined,
    },
    value: {
      type: String,
      default: '',
    },
    appendIcon: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      menu: false,
    };
  },
  computed: {
    date: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('change', val);
      },
    },
    wrapDate: {
      get() {
        if (/^(\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01]))$/.test(this.value)) return this.value;
        return '';
      },
      set(val) {
        this.$emit('change', val);
      },
    },
    labelWithPattern() {
      return `${this.label} (yyyy-MM-dd)`;
    },
  },
  methods: {
    dateRule(value) {
      if (!value || value.length === 0) return true;
      if (!/^(\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01]))$/.test(value)) return this.$t('validation.date.format');
      const date = new Date(value);
      const dateValue = value.split('-').map(Number);
      if (date.getFullYear() !== dateValue[0]
        || date.getMonth() !== dateValue[1] - 1
        || date.getDate() !== dateValue[2]
      ) {
        return this.$t('validation.date.invalid');
      }

      return true;
    },
  },
};
</script>

<style scoped lang="scss">

</style>
