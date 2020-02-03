<template>
  <div>
    <b-card class="col-md-6 mx-auto card">
      <img class="card-img-top" src="~/assets/logo.png" />
      <b-form @submit="onSubmit" v-if="show">
        <b-form-group id="input-group-1" label="Username:" label-for="input-1">
          <b-form-input id="input-1" v-model="form.username" required placeholder="Enter username"></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2" label="Your password:" label-for="input-2">
          <b-form-input
            id="input-2"
            v-model="form.password"
            required
            type="password"
            placeholder="Enter password"
          ></b-form-input>
        </b-form-group>
        <b-button type="submit" block variant="success">Submit</b-button>
      </b-form>
      <p class="font-small grey-text d-flex justify-content-end">
        Not a member?
        <a href="register" class="blue-text ml-1">Sign Up</a>
      </p>
    </b-card>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      show: true
    };
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      this.login();
    },
    login() {
      let localThis = this;
      axios
        .post("http://192.168.0.104:3003/user/log", {
          userName: localThis.form.username,
          password: localThis.form.password
        })
        .then(function(response) {
          console.log(response.data.token);
		      localStorage.setItem("user-token", response.data.token);
			    localThis.changePage()
        })
        .catch(function(err) {
		      localStorage.removeItem("user-token");
          alert(err);
        });
    },
    changePage() {
      this.$router.push({
        path: "/search"
      });
    }
  }
};
</script>

<style scoped>
.card-img-top {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 60%;
}
.card {
  margin-top: 20px;
}
.grey-text {
  margin-top: 10px;
}
</style>