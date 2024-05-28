<template>
  <v-app>
    <v-container>
      <atom-spinner v-if="loading" :animation-duration="1000" :size="200" :color="'#ff1d5e'" />
      <template v-else>
        <v-data-table :items="answer"></v-data-table>
      </template>
    </v-container>
  </v-app>
</template>
<script>
import axios from "axios";
import { AtomSpinner } from 'epic-spinners'

axios.interceptors.request.use(
  (config) => {
    config.headers = {
      ...config.headers,
      "content-type": "text/json",
    };
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    console.log(response);
    response.data.foo = "bar";
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default {
  components: {
    AtomSpinner
  },
  name: "App",
  data() {
    return {
      answer: [],
      loading: true
    };
  },
  methods: {
    async getAnswer() {
      const { data } = await axios.get("http://localhost:8080/api/v1/users");
      for (let i = 0; i < data.length; i++) {
        var crated = new Date(data[i].created)
        var updated = new Date(data[i].updated)
        crated = crated.getDate() + '/' + crated.getMonth() + '/' + crated.getFullYear() + ' ' + crated.getHours() + ':' + crated.getMinutes() + ':' + crated.getSeconds()
        updated = updated.getDate() + '/' + updated.getMonth() + '/' + updated.getFullYear() + ' ' + updated.getHours() + ':' + updated.getMinutes() + ':' + updated.getSeconds()
        data[i].created = crated
        data[i].updated = updated
      }
      this.answer = data;
      this.loading = false;
    },
  },
  beforeMount() {
    this.getAnswer();
  },
};
</script>

<style>
.container {
  justify-content: center;
}
</style>
