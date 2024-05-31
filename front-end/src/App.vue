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
                    <v-btn  v-bind="activatorProps" color="surface-variant" text="Say hello" variant="flat"
                      @click="getUserById(item.id)"></v-btn>
                  </template>

                  <template v-if="error" v-slot:default="{ isActive }">
                    <v-container>
                    <v-card>
                      <v-card-title>Response</v-card-title>
                      <v-card-text>
                        {{ info }}
                      </v-card-text>
                      <v-card-actions @complete="isActive.value = false">
                        <v-spacer></v-spacer>
                        <v-btn text @click="isActive.value = false">Close</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-container>
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

  <!-- Centered Snackbar -->
  <v-container fluid class="d-flex align-center justify-center custom-container">
    <v-snackbar v-model="snackbar.show" :timeout="snackbar.timeout" color="error" class="custom-snackbar">
      <h2 class="h2">{{ error_axios }}</h2>
    </v-snackbar>
  </v-container>
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
      info: {},
      error: true,
      snackbar: {
        show: false,
        timeout: 3000
      },
      error_axios: 'Something went wrong! Please try again'
    };
  },
  methods: {
    async getUserById(id) {
      try {
        this.error = true;
        this.snackbar.show = false
        const { data } = await axios.get("http://localhost:8080/api/v1/users/" + id);
        var crated = new Date(data.created)
        var updated = new Date(data.updated)
        crated = crated.getDate() + '/' + crated.getMonth() + '/' + crated.getFullYear() + ' ' + crated.getHours() + ':' + crated.getMinutes() + ':' + crated.getSeconds()
        updated = updated.getDate() + '/' + updated.getMonth() + '/' + updated.getFullYear() + ' ' + updated.getHours() + ':' + updated.getMinutes() + ':' + updated.getSeconds()
        data.created = crated
        data.updated = updated
        this.info = "Hello " + data.name
      } catch (error) {
        this.error = false
        this.handleError(error);
      }
    },
    async getUser() {
      try {
        const { data } = await axios.get("http://localhost:8080/api/v1/users");
        for (let i = 0; i < data.length; i++) {
          var crated = new Date(data[i].created)
          var updated = new Date(data[i].updated)
          crated = crated.getDate() + '/' + crated.getMonth() + '/' + crated.getFullYear() + ' ' + crated.getHours() + ':' + crated.getMinutes() + ':' + crated.getSeconds()
          updated = updated.getDate() + '/' + updated.getMonth() + '/' + updated.getFullYear() + ' ' + updated.getHours() + ':' + updated.getMinutes() + ':' + updated.getSeconds()
          data[i].created = crated
          data[i].updated = updated
          data[i].hello = null
        }
        this.answer = data;
        this.loading = false;
      } catch (error) {
        this.handleError(error);
      }
    },
    handleError(error) {
      this.snackbar.message = "Error: " + (error.response ? error.response.statusText : "Unknown Error");
      this.snackbar.show = true;
    }
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

.custom-container {
  height: 100vh;
}

.custom-snackbar {
  max-width: 300px;
  text-align: center;
  position: absolute;
  /* Ensures proper centering */
  top: 50%;
  /* Centers vertically */
  right: 100%;
  /* Centers horizontally */
  transform: translate(0%, -80%);
  /* Corrects position offset */
}

.h2 {
  margin-top: 600px;
}
</style>
