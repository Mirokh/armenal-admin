<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md">
      <q-tabs
          v-model="lang"
          inline-label
          align="left"
          class="text-grey"
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
                v-model="form.text.am"
                :definitions="{
        bold: {label: 'Bold', icon: null, tip: 'My bold tooltip'}
      }"
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
                v-model="form.text.ru"
                :definitions="{
        bold: {label: 'Bold', icon: null, tip: 'My bold tooltip'}
      }"
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
                v-model="form.text.en"
                :definitions="{
        bold: {label: 'Bold', icon: null, tip: 'My bold tooltip'}
      }"
            />
          </div>
        </div>
      </div>
      <div class="image-upload-wrapper">
        <label for="upload_image">
          <div v-if="!imagePreview" class="image-frame q-mx-sm q-pa-lg">
            <span><q-icon size="xl" color="grey" name="upload_file"></q-icon></span>
          </div>
        </label>
        <input type="file" ref="file" @change="previewFile" id="upload_image" class="file_input" name="blogImage">
        <div>
          <div v-if="imagePreview" class="image-previewer q-mx-sm">
            <img :src="imagePreview" alt="">
            <span @click="removeImage" style="text-decoration: underline; cursor: pointer">Remove image</span>
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
import {useQuasar} from "quasar";

export default {
  name: "BlogForm",
  data() {
    return {
      draft: {
        id: this.$route.params?.id
      },
      armFlag,
      rusFlag,
      ukFlag,
      lang: 'arm',
      imagePreview: null,
      form: {
        title: {
          am: '',
          ru: '',
          en: ''
        },
        text: {
          am: '',
          ru: '',
          en: ''
        },
        image: null,
      }
    }
  },
  computed: {},
  async created() {
    if (this.draft.id) {
      const article = await this.$http.get(`http://localhost:3000/blog/${this.draft.id}`)
      this.mapResponse(article.data)
    }
  },
  methods: {
    async saveForm() {
      const formData = this.getFormData(this.form)
      const headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZW1haWwuY29tIiwiaWQiOjIsImlhdCI6MTY4OTQ0NDk5NCwiZXhwIjoxNjg5NDUyMTk0fQ.HRxQjWpzhuYxP-wJxv5n-C9op1kiioWxZATLWcAPKw0'
      };

      if (this.draft.id) {
        this.$http.patch(`http://localhost:3000/blog/${this.draft.id}`, formData, {headers}).then(() => {
          this.$q.notify({
            position: 'top-right',
            type: 'positive',
            message: 'Article successfully updated'
          })
        }).catch((err) => {
          this.$q.notify({
            position: 'top-right',
            type: 'negative',
            message: err.response.data.message[0],
          })
        })
      } else {
        this.$http.post('http://localhost:3000/blog', formData, {headers}).then(() => {
          this.$q.notify({
            position: 'top-right',
            type: 'positive',
            message: 'Article successfully created'
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
    previewFile(e) {
      const file = e.target.files[0];
      this.form.image = file;
      if (file) {
        this.imagePreview = URL.createObjectURL(file);
      }
    },
    mapResponse(response) {
      this.form.text = response.text
      this.form.title = response.title
      this.imagePreview = response.imagePath ? process.env.VUE_APP_API_URL + '/' + response.imagePath : null
    },
    removeImage() {
      document.getElementById('upload_image').value = ''
      this.imagePreview = null
    },
    getFormData(data) {
      let formData = new FormData()
      formData.append('title[am]', data.title.am)
      formData.append('title[ru]', data.title.ru)
      formData.append('title[en]', data.title.en)
      formData.append('text[am]', data.text.am)
      formData.append('text[ru]', data.text.ru)
      formData.append('text[en]', data.text.en)
      formData.append('image', data.image)
      return formData;
    },
    resetForm() {
      this.form = {
        title: {
          am: '',
          ru: '',
          en: ''
        },
        text: {
          am: '',
          ru: '',
          en: ''
        },
        image: null,
      }
      this.imagePreview = null
    }
  },
  setup() {
    const $q = useQuasar();

    return {
      $q
    }
  }
}
</script>

<style lang="scss" scoped>
.image-frame {
  border: 1px solid grey;
  height: 200px;
  border-radius: 4px;
  display: flex;
  position: relative;

  &:hover {
    opacity: 0.8;
    cursor: pointer;
  }
}

.image-previewer {
  position: relative;
  border-radius: 4px;

  img {
    width: 100%;
  }
}

.remove_image {
  cursor: pointer;
  position: absolute;
  right: 20px;
  top: 20px
}

.file_input {
  display: none;
}

.image-upload-wrapper {
  position: relative;
}

.image-frame span {
  display: block;
  margin: auto;
}
</style>
