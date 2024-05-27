<template>
  <v-app>
    <v-container>
      <v-data-table :items="answer"></v-data-table>
    </v-container>
  </v-app>
</template>
<script>
import axios from "axios";

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
    // console.log(response);
    response.data.foo = "bar";
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default {
  name: "App",
  data() {
    return {
      answer: [],
    };
  },
  methods: {
    async getAnswer() {
      const { data } = await axios.get("http://localhost:8080/api/v1/users");
      for (let i = 0; i < data.length; i++) {
        var crated = new Date(data[i].created)
        var updated = new Date(data[i].updated)
        crated = crated.getDate() + '/' +  crated.getMonth() + '/' + crated.getFullYear() + ' ' + crated.getHours() + ':' + crated.getMinutes() + ':' + crated.getSeconds()
        updated = updated.getDate() + '/' +  updated.getMonth() + '/' + updated.getFullYear() + ' ' + updated.getHours() + ':' + updated.getMinutes() + ':' + updated.getSeconds()
        data[i].created = crated
        data[i].updated = updated
      }
      this.answer = data;
    },
  },
  beforeMount() {
    this.getAnswer();
  },
};
</script>
