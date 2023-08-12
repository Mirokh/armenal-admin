<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md">
      <q-tabs
          v-model="lang"
          inline-label
          align="left"
          class="description-grey"
      >
        <q-tab name="arm">
          <q-icon size="sm">
            <img :src="armFlag" alt="">
          </q-icon>
        </q-tab>
        <q-tab name="rus">
          <q-icon size="sm">
            <img :src="rusFlag" alt="">
          </q-icon>
        </q-tab>
        <q-tab name="eng">
          <q-icon size="sm">
            <img :src="ukFlag" alt="">
          </q-icon>
        </q-tab>
      </q-tabs>
    </div>
  </div>
  <div class="q-pa-md">
    <q-form
        class="q-gutter-md"
        @submit="saveForm"
        @reset="resetForm"
    >
      <div>
        <div v-if="lang === 'arm'" class="row">
          <div class="col-3 col-sm-4 col-xs-3 q-pa-sm">
            <q-input
                v-model="form.title.am"
                stack-label
                filled
                label="Title"
            />
          </div>
          <div class="col-12 q-pa-sm">
            <q-editor
                v-model="form.description.am"
            />
          </div>
        </div>
        <div v-if="lang === 'rus'" class="row">
          <div class="col-3 col-sm-4 col-xs-3 q-pa-sm">
            <q-input
                v-model="form.title.ru"
                stack-label
                filled
                label="Title"
            />
          </div>
          <div class="col-12 q-pa-sm">
            <q-editor
                v-model="form.description.ru"
            />
          </div>
        </div>
        <div v-if="lang === 'eng'" class="row">
          <div class="col-3 col-sm-4 col-xs-3 q-pa-sm">
            <q-input
                v-model="form.title.en"
                stack-label
                filled
                label="Title"
            />
          </div>
          <div class="col-12 q-pa-sm">
            <q-editor
                v-model="form.description.en"
            />
          </div>
        </div>
      </div>
      <div class="q-pa-sm">
        <q-btn label="Save" type="submit" color="primary"/>
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm"/>
      </div>
    </q-form>
  </div>
</template>

<script>
import armFlag from '../../assets/armenia.png'
import rusFlag from '../../assets/russia.png'
import ukFlag from '../../assets/united-kingdom.png'

export default {
  name: 'CareerForm',
  data() {
    return {
      form: {
        title: {
          am: '',
          ru: '',
          en: ''
        },
        description: {
          am: '',
          ru: '',
          en: ''
        },
      },
      draft: {
        id: this.$route.params?.id
      },
      lang: 'arm',
      armFlag,
      rusFlag,
      ukFlag,
    }
  },
  async created() {
    if (this.draft.id) {
      const result = (await this.$http.get(`http://localhost:3000/career/${this.draft.id}`)).data

      if (result) {
        this.form = result
      }

      console.log(this.form)

    }
  },
  methods: {
    async saveForm() {
      const token = localStorage.getItem('auth')

      if (!token) {
        console.error('unauthorized')
        return
      }

      const headers = {
        'Authorization': `Bearer ${token}`
      };

      if (this.draft.id) {
        this.$http.patch(`http://localhost:3000/career/${this.draft.id}`, this.form, {headers}).then(() => {
          this.$q.notify({
            position: 'top-right',
            type: 'positive',
            message: 'Career successfully updated'
          })
        }).catch((err) => {
          this.$q.notify({
            position: 'top-right',
            type: 'negative',
            message: err.response.data.message[0],
          })
        })
      } else {
        this.$http.post('http://localhost:3000/career', this.form, {headers}).then(() => {
          this.$q.notify({
            position: 'top-right',
            type: 'positive',
            message: 'Career successfully created'
          })
        }).catch((err) => {
          this.$q.notify({
            position: 'top-right',
            type: 'negative',
            message: err.response.data.message[0],
          })
        })
      }
    },
  }
}

</script>