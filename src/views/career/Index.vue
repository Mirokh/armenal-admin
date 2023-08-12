<template>
  <div>
    <div class="row q-py-md q-px-md justify-between">
      <h5 class="q-ma-xs">
        Careers
      </h5>
      <q-btn color="primary" size="md" label="Add new" icon="add" @click="create"/>
    </div>
    <q-separator inset class="q-my-sm"/>
    <template v-if="loading">
      <TableSkeleton></TableSkeleton>
    </template>
    <template v-else>
      <div class="q-pa-md">
        <q-table
            title="Careers"
            :rows="rows"
            :columns="columns"
            row-key="name"
        >
          <template v-slot:body-cell-description="props">
            <q-td :props="props" auto-width>
              <p class="q-ma-none" v-html="truncate(props.row.description.am, 50)"></p>
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props" auto-width>
              <q-btn flat round color="grey" :icon="icons.edit" @click="edit(props.row.id)"/>
              <q-btn flat round color="grey" :icon="icons.delete" @click="askForDelete(props.row.id)"/>
              <q-toggle :model-value="props.row.enable" @update:model-value="toggleStatus(props.row)"/>
            </q-td>
          </template>
        </q-table>

        <q-dialog v-model="confirm" persistent transition-show="scale" transition-hide="scale">
          <q-card class="bg-teal text-white" style="width: 300px">

            <q-card-section>
              <div class="text-h6">Confirm to delete</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              Are you sure to delete this Vacancy.
            </q-card-section>

            <q-card-actions align="right" class="bg-white text-teal">
              <q-btn flat label="Cancel" color="primary" v-close-popup/>
              <q-btn flat label="Accept" @click="deleteCareer" color="primary" v-close-popup/>
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </template>
  </div>
</template>
<script>
import TableSkeleton from "@/components/utils/TableSkeleton.vue";
import {fasPenToSquare, fasTrash} from "@quasar/extras/fontawesome-v6";

export default {
  name: 'CareerIndex',
  components: {TableSkeleton},
  data: () => ({
    loading: false,
    tempDeletingCareerId: null,
    confirm: false,
    columns: [
      {
        name: 'title', align: 'left', label: 'Title', field: row => {
          return row.title.am
        }
      },
      {name: 'description', label: 'Description', align: 'left', field: 'description'},
      {
        name: 'actions', align: 'left', label: 'Actions', field: 'actions', sortable: false
      },
    ],
    rows: [],
    icons: {
      edit: fasPenToSquare,
      delete: fasTrash,
    },
  }),
  created() {
    this.loading = true
    this.$http.get('http://localhost:3000/career').then((response) => {
      this.rows = response.data
      this.loading = false
    }).catch(error => {
      console.log(error)
    })

  },
  methods: {
    askForDelete(id) {
      this.tempDeletingCareerId = id;
      this.confirm = true;
    },
    create() {
      this.$router.push({name: 'career_form'})
    },
    edit(id) {
      this.$router.push({name: 'career_form', params: {id: id}})
    },
    toggleStatus(row) {
      const token = localStorage.getItem('auth')

      if (!token) {
        console.error('unauthorized')
        return
      }

      const headers = {
        'Authorization': `Bearer ${token}`
      };

      this.$http.patch(`career/switch/${row.id}`, {}, {headers}).then(() => {
        row.enable = !row.enable
      }).catch((error) => {
        console.log(error);
      })
    },
    truncate(source, size) {
      return source?.length > size ? source.slice(0, size - 1) + "…" : source;
    },
    deleteCareer() {
      const token = localStorage.getItem('auth')

      if (!token) {
        console.error('unauthorized')
        return
      }

      const headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      };

      this.$http.delete(`http://localhost:3000/career/${this.tempDeletingCareerId}`, {headers}).then(() => {
        this.$q.notify({
          position: 'top-right',
          type: 'positive',
          message: 'Vacancy deleted successfully'
        })
        this.loading = false
      })
      this.rows = this.rows.filter(obj => obj.id !== this.tempDeletingCareerId);
    },
  }
}
</script>