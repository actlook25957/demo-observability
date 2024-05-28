<template>
  <!-- <div class="text-center"> -->
  <v-app>
    <v-container >
      <v-data-table :items="answer">
        <template v-slot:body="{ items }">
      <tr v-for="item in items" :key="item">
        <td>{{ item.id }}</td>
        <td>{{ item.orgId }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.created }}</td>
        <td>{{ item.updated }}</td>
        <td><v-icon large @click="deleteFob(item)"> mdi-access-point-remove </v-icon></td>
      </tr>
    </template>
      </v-data-table>
      <!-- <tr v-for="item in answer" :key="item.scannedDeviceId">
        <td>{{ item.id }}</td>
        <td>{{ item.org_id }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.created }}</td>
        <td>{{ item.updated }}</td>
        <td><v-icon large @click="deleteFob(item)"> mdi-access-point-remove </v-icon></td>
      </tr> -->
    </v-container>
  </v-app>
  <div>
    <v-overlay v-model="loading">
      <div class="d-flex justify-center">
        <v-progress-circular color="primary" indeterminate />
      </div>
    </v-overlay>
  </div>
  <!-- </div> -->
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
      loading: true,
      error_res: {}
    };
  },
  methods: {
    async getUser() {
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
    async getError() {
      const { data } = await axios.get("http://localhost:8080");
      this.error_res = data;
    },
  },
  beforeMount() {
    this.getUser();
  },
};
</script>

<style>
.container {
  justify-content: center;
}
</style>
