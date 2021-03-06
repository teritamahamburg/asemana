<template>
  <v-dialog :value="value" persistent max-width="600"
            :fullscreen="$vuetify.breakpoint.xsOnly">
    <v-card class="item-edit--dialog">
      <template v-if="hasItem">
        <v-card-title>
          <span class="headline">{{$t('general.editItem')}}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" class="input-form">
            <file-input v-if="itemList.length === 1" style="grid-column: 1 / span 2"
                        v-model="editItem.seal"/>
            <v-text-field
              :label="$t('item.room')"
              :placeholder="item('room')"
              type="number"
              class="room-input"
              v-model="editItem.room"
              :append-icon="$vuetify.icons.values.custom.close"
              @click:append="editItem.room = undefined"
              :rules="`${editItem.room||''}`.length === 0 ? [] :
               [rules.number($t('validation.number')),
                rules.min(1, $tc('validation.above', editItem.room, {n:1}))]"
            />
            <template v-for="k in ['checkedAt', 'disposalAt', 'depreciationAt']">
              <date-picker
                :key="k"
                :label="$t(`item.${k}`)"
                :placeholder="item(k)"
                v-model="editItem[k]"
              />
            </template>
          </v-form>
        </v-card-text>
      </template>
      <template v-if="hasChildItem">
        <v-card-title>
          <span class="headline">{{$t(`general.editChild`)}}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="childForm" class="input-form">
            <v-text-field :label="$t('item.name')" v-model="editChildItem.name"
                          :placeholder="child('name')"
                          style="grid-column: 1 / span 2"
                          :prepend-icon="$vuetify.icons.values.custom.name"/>
            <v-text-field :label="$t('item.room')"
                          :placeholder="child('room')"
                          type="number" class="room-input" v-model="editChildItem.room"
                          :prepend-icon="$vuetify.icons.values.custom.room"
                          :append-icon="this.$vuetify.icons.values.custom.close"
                          @click:append="editChildItem.room = undefined"
                          :rules="`${editChildItem.room||''}`.length === 0 ? [] :
                        [rules.number($t('validation.number')),
                          rules.min(1, $tc('validation.above', editChildItem.room, {n:1}))]"/>
            <date-picker :label="$t('item.checkedAt')"
                         :placeholder="child('checkedAt')"
                         v-model="editChildItem.checkedAt"/>
          </v-form>
        </v-card-text>
      </template>

      <v-card-actions>
        <v-btn outlined color="error" v-show="canRemove" @click="clickRemove">
          {{ $t('general.remove') }}
        </v-btn>
        <v-spacer/>
        <v-btn outlined @click="clickCancel">
          {{ $t('general.cancel') }}
        </v-btn>
        <v-btn depressed dark color="black" @click="clickEditInDialog">
          {{ $t(`general.edit`) }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import DatePicker from '@/components/DatePicker.vue';
import FileInput from '@/components/FileInput.vue';
import validationRules from '@/ValidationRules';

const todayStr = () => {
  const date = new Date();
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString(10).padStart(2, '0')}-${(date.getDate()).toString(10).padStart(2, '0')}`;
};

export default {
  name: 'ItemEditDialog',
  components: { FileInput, DatePicker },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Boolean,
      default: false,
    },
    canRemove: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      editItem: {
        seal: undefined,
        room: undefined,
        checkedAt: todayStr(),
        disposalAt: undefined,
        depreciationAt: undefined,
      },
      editChildItem: {
        name: undefined,
        room: undefined,
        checkedAt: todayStr(),
      },
    };
  },
  watch: {
    value() {
      Object.keys(this.editItem).forEach((k) => {
        this.editItem[k] = undefined;
      });
      Object.keys(this.editChildItem).forEach((k) => {
        this.editChildItem[k] = undefined;
      });
      const today = todayStr();
      this.editItem.checkedAt = today;
      this.editChildItem.checkedAt = today;
    },
  },
  computed: {
    rules: () => validationRules,
    itemList() {
      return this.items.filter(({ id }) => !id.includes(','));
    },
    hasItem() {
      return this.items.some((item) => !item.id.includes(','));
    },
    childList() {
      return this.items.filter(({ id }) => id.includes(','));
    },
    hasChildItem() {
      return this.items.some((item) => item.id.includes(','));
    },
  },
  methods: {
    closeDialog() {
      this.$emit('change', false);
    },
    clickRemove() {
      this.closeDialog();
      this.$store.commit('showRemoveDialog', this.items);
    },
    clickCancel() {
      this.$emit('click:cancel');
      this.closeDialog();
    },
    clickEditInDialog() {
      let mutate;
      if (this.$refs.form && this.$refs.form.validate() && this.hasItem) {
        const data = { ...this.editItem };
        if (data.room) data.room = Number(data.room);
        mutate = this.$mutate('editItems', {
          variables: {
            ids: this.itemList.map(({ id }) => id),
            data,
          },
        }).then(({ data: { editItems } }) => Promise.resolve(editItems));
      } else if (this.$refs.childForm && this.$refs.childForm.validate() && this.hasChildItem) {
        const data = { ...this.editChildItem };
        if (data.room) data.room = Number(data.room);
        mutate = this.$mutate('editChildren', {
          variables: {
            ids: this.childList.map(({ id }) => id),
            data,
          },
        }).then(({ data: { editChildren } }) => Promise.resolve(editChildren));
      }

      if (mutate) {
        mutate.then((results) => {
          let hasError = false;
          results.forEach(({ success, message }) => {
            if (success) {
              this.$emit('edited', { success, message });
            } else {
              hasError = true;
              if (window.gqlError) {
                window.gqlError({ message });
              }
            }
          });
          if (!hasError) this.closeDialog();
        }).catch((error) => {
          if (window.gqlError) window.gqlError(error);
        });
      }
    },
    item(key) {
      return this.itemList.length === 1 && this.itemList[0][key] ? this.itemList[0][key].toString() : '';
    },
    child(key) {
      return this.childList.length === 1 && this.childList[0][key] ? this.childList[0][key].toString() : '';
    },
  },
};
</script>

<style scoped lang="scss">
  .input-form {
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 1fr;
    row-gap: 8px;
    column-gap: 8px;
  }
</style>
