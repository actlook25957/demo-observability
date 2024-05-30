<template>
  <v-app>

    <!-- Header -->
    <v-app-bar app color="primary" dark>
      <v-toolbar-title class="text-h6">User Management</v-toolbar-title>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <v-container fluid>
        <!-- Title -->
        <h1 class="text-center my-4">Users</h1>

        <!-- Data Table -->
        <v-data-table :items="answer" class="elevation-1" :headers="headers">
          <template v-slot:body="{ items }">
            <tr v-for="item in items" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.orgId }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.created }}</td>
              <td>{{ item.updated }}</td>
              <td>
                <v-dialog max-width="500">
                  <template v-slot:activator="{ props: activatorProps }">
                    <v-btn v-bind="activatorProps" color="surface-variant" text="More info" variant="flat"></v-btn>
                  </template>

                  <template v-slot:default="{ isActive }">
                    <v-card title="Dialog">
                      <v-card-text>
                        {{  getUserById(item.id) }}
                      </v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn text="Close Dialog" @click="isActive.value = false"></v-btn>
                      </v-card-actions>
                    </v-card>
                  </template>
                </v-dialog>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-container>
    </v-main>
  </v-app>

  <!-- Loading Overlay -->
  <div>
    <v-overlay v-model="loading">
      <v-container fluid class="d-flex align-center justify-center" style="height: 100vh;">
        <v-progress-circular color="primary" indeterminate />
      </v-container>
    </v-overlay>
  </div>
</template>

<script>
import axios from "axios";
import { ref, computed } from 'vue'

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
    alert(error)
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
  name: "App",
  data() {
    return {
      answer: [],
      loading: true,
      error_res: {},
      data: {},

    };
  },
  methods: {
    async getUserById(id) {
      const { data } = await axios.get("http://localhost:8080/api/v1/users/" + id);
      for (let i = 0; i < data.length; i++) {
        var crated = new Date(data[i].created)
        var updated = new Date(data[i].updated)
        crated = crated.getDate() + '/' + crated.getMonth() + '/' + crated.getFullYear() + ' ' + crated.getHours() + ':' + crated.getMinutes() + ':' + crated.getSeconds()
        updated = updated.getDate() + '/' + updated.getMonth() + '/' + updated.getFullYear() + ' ' + updated.getHours() + ':' + updated.getMinutes() + ':' + updated.getSeconds()
        data[i].created = crated
        data[i].updated = updated
      }
      if (data.id) {
        alert("Hello " + data.name)
      } else alert("error")

    },
    async getUser() {
      const { data } = await axios.get("http://localhost:8080/api/v1/users");
      for (let i = 0; i < data.length; i++) {
        var crated = new Date(data[i].created)
        var updated = new Date(data[i].updated)
        crated = crated.getDate() + '/' + crated.getMonth() + '/' + crated.getFullYear() + ' ' + crated.getHours() + ':' + crated.getMinutes() + ':' + crated.getSeconds()
        updated = updated.getDate() + '/' + updated.getMonth() + '/' + updated.getFullYear() + ' ' + updated.getHours() + ':' + updated.getMinutes() + ':' + updated.getSeconds()
        data[i].created = crated
        data[i].updated = updated
        data[i].info = null
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
.v-overlay__content {
  width: 100%;
  height: 100%;
}

.v-container {
  padding-top: 32px;
}

.v-data-table {
  background-color: white;
  border-radius: 8px;
}

.v-btn {
  min-width: 120px;
}
</style>
