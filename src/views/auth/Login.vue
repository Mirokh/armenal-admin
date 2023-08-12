<template>
  <div id="q-app">
    <q-layout view="lHh Lpr fff">
      <q-page
          class="window-height window-width row justify-center items-center"
          style="background: linear-gradient(#8274C5, #5A4A9F);"
      >
        <div class="column q-pa-lg">
          <div class="row">
            <q-card square class="shadow-24 q-pb-xl" style="width:400px">
              <q-card-section class="bg-deep-purple-7">
                <h4 class="text-h5 text-white q-my-md">{{ title }}</h4>
              </q-card-section>
              <q-card-section>
                <q-form class="q-px-sm q-pt-xl">
                  <q-input
                      ref="email"
                      square
                      v-model="email"
                      type="email"
                      lazy-rules
                      :rules="[this.required,this.isEmail,this.short]"
                      label="Email">
                    <template v-slot:prepend>
                      <q-icon name="email"/>
                    </template>
                  </q-input>
                  <q-input
                      ref="password"
                      square
                      v-model="password" :type="passwordFieldType"
                      lazy-rules
                      :rules="[this.required,this.short]"
                      label="Password">

                    <template v-slot:prepend>
                      <q-icon name="lock"/>
                    </template>
                    <template v-slot:append>
                      <q-icon
                          :name="visibilityIcon" @click="switchVisibility" class="cursor-pointer"/>
                    </template>
                  </q-input>
                </q-form>
              </q-card-section>

              <q-card-actions class="q-px-lg">
                <q-btn
                    unelevated
                    size="md"
                    color="secondary"
                    @click="submit"
                    class="text-white" label="Login"/>
              </q-card-actions>
            </q-card>
          </div>
        </div>

      </q-page>
    </q-layout>
  </div>
</template>

<script>
export default {
  el: '#q-app',
  name: 'AuthLogin',
  data: () => ({
    title: 'Login',
    email: '',
    password: '',
    passwordFieldType: 'password',
    visibility: false,
    visibilityIcon: 'visibility'
  }),
  methods: {
    required(val) {
      return (val && val.length > 0 || 'This field is required')
    },
    short(val) {
      return (val && val.length >= 6 || 'This field should be longer')
    },
    isEmail(val) {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
      return (emailPattern.test(val) || 'Not valid email address')
    },
    submit() {
      this.$refs.email.validate()
      this.$refs.password.validate()
      const credentials = {
        email: this.email,
        password: this.password,
      }

      this.$http.post('auth/login', credentials).then((response) => {
        localStorage.setItem("auth", response.data.access_token);
        this.$router.push('/')
      }).catch((error) => {
        if (error.response.data.message.length) {
          this.$q.notify({
            position: 'top-right',
            icon: 'done',
            color: 'negative',
            message: error.response.data.message[0]
          })
        }
      })
    },
    switchVisibility() {
      this.visibility = !this.visibility
      this.passwordFieldType = this.visibility ? 'text' : 'password'
      this.visibilityIcon = this.visibility ? 'visibility_off' : 'visibility'
    }
  }
}
</script>