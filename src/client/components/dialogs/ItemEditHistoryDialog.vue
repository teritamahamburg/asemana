<template>
  <v-dialog :value="value" persistent max-width="600"
            :fullscreen="$vuetify.breakpoint.xsOnly">
    <v-card>
      <v-card-title>
        <span class="headline">{{ $t('general.editHistory') }}</span>
        <v-spacer/>
        <v-btn depressed dark color="black" @click="$emit('change', false)">
          {{ $t('general.close') }}
        </v-btn>
      </v-card-title>
      <v-data-table
        hide-default-footer
        :mobile-breakpoint="-1"
        :headers="headers"
        :items="id && id.includes(',') ? childHistories : histories"
        item-key="createdAt">
        <template v-slot:item="{ item }">
          <tr v-if="!item.event">
            <td v-for="h in headers" :key="h.value">
              {{ item[h.value] }}
            </td>
          </tr>
          <tr v-else style="background: rgba(0, 0, 0, 0.1)">
            <td :colspan="headers.length - 1" style="text-align: center">
              {{ $t(`event.${item.event}`) }}
            </td>
            <td>{{ item.createdAt }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </v-dialog>
</template>

<script>
import itemHistoriesQuery from '@/apollo/queries/itemHistories.gql';
import childHistoriesQuery from '@/apollo/queries/childHistories.gql';

import { dateStr } from '@/util';

export default {
  name: 'ItemEditHistoryDialog',
  apollo: {
    histories: {
      skip() {
        if (!this.$store.state.online) return true;
        if (!this.value) return true;
        return !this.id || this.id.includes(',');
      },
      query: itemHistoriesQuery,
      fetchPolicy: 'no-cache',
      variables() {
        return {
          id: this.id,
        };
      },
      update({ item }) {
        if (!item) return [];
        return [
          ...item.histories.map((it) => {
            const i = {
              ...it,
              room: it.room.number,
            };
            // eslint-disable-next-line no-underscore-dangle
            delete i.__typename;
            return i;
          }),
          ...item.events.map((event) => {
            // eslint-disable-next-line
            delete event.__typename;
            return event;
          }),
        ].map((a) => ({ ...a, createdAt: new Date(a.createdAt) }))
          .sort((a, b) => b.createdAt - a.createdAt)
          .map((a) => ({ ...a, createdAt: dateStr(a.createdAt) }));
      },
    },
    childHistories: {
      skip() {
        if (!this.$store.state.online) return true;
        if (!this.value) return true;
        return !this.id || !this.id.includes(',');
      },
      query: childHistoriesQuery,
      fetchPolicy: 'no-cache',
      variables() {
        return {
          childId: this.id,
        };
      },
      update({ child }) {
        if (!child) return [];
        return [
          ...child.histories.map((item) => {
            const i = {
              ...item,
              room: item.room ? item.room.number : null,
            };
            // eslint-disable-next-line no-underscore-dangle
            delete i.__typename;
            return i;
          }),
          ...child.events.map((event) => {
            // eslint-disable-next-line
            delete event.__typename;
            return event;
          }),
        ].map((a) => ({ ...a, createdAt: new Date(a.createdAt) }))
          .sort((a, b) => b.createdAt - a.createdAt)
          .map((a) => ({ ...a, createdAt: dateStr(a.createdAt) }));
      },
    },
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
    id: {
      type: [Number, String],
      default: undefined,
    },
  },
  data() {
    return {
      histories: [],
      childHistories: [],
    };
  },
  watch: {
    value() {
      this.$nextTick(() => {
        if (this.$store.state.online) {
          this.$apollo.queries.histories.refetch();
        }
      });
    },
  },
  computed: {
    headers() {
      const headers = {
        item: ['id', 'room', 'checkedAt', 'disposalAt', 'depreciationAt', 'createdAt'],
        child: ['id', 'name', 'room', 'checkedAt', 'createdAt'],
      };
      return (this.id && this.id.includes(',') ? headers.child : headers.item)
        .map((k) => ({ value: k, text: this.$t(`item.${k}`) }));
    },
  },
};
</script>

<style scoped lang="scss">

</style>
