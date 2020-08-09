<template>
<div>
  <b-card class="col-md-6 mx-auto card">
		<img class="card-img-top" src="~/assets/logo.png">
    <b-form  @submit="onSubmit" @reset="onReset" v-if="show">
      <b-form-group id="input-group-1" label="Username:" label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="form.username"
          required
          placeholder="Enter username"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Your Name:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.name"
          required
          placeholder="Enter name"
        ></b-form-input>
      </b-form-group>

			<b-form-group id="input-group-3" label="Your Last Name:" label-for="input-3">
        <b-form-input
          id="input-3"
          v-model="form.lastName"
          required
          placeholder="Enter last name"
        ></b-form-input>
      </b-form-group>

			<b-form-group id="input-group-4" label="Your password:" label-for="input-4">
        <b-form-input
          id="input-4"
          v-model="form.password"
          required
					type="password"
          placeholder="Enter password"
        ></b-form-input>
      </b-form-group>

			<b-form-group id="input-group-5" label="Repeat password:" label-for="input-5">
        <b-form-input
          id="input-5"
          v-model="form.passwordRepeat"
          required
					type="password"
          placeholder="Enter password"
        ></b-form-input>
      </b-form-group>
			 <b-button type="submit" block variant="success">Submit</b-button>
    </b-form>
		<p class="font-small grey-text d-flex justify-content-end">
		Already a member? <a href="login" class="blue-text ml-1"> Log In</a></p>
  </b-card>
</div>
</template>

<script>
	import axios from 'axios';
  export default {
    data() {
      return {
        form: {
          username: '',
					name: '',
					lastName: '',
					password: '',
					passwordRepeat: ''
        },
        show: true
      }
    },
    methods: {
      onSubmit(evt) {
				evt.preventDefault()
				if(this.form.password === this.form.passwordRepeat)
					this.register()
				else
					alert("Passwords do not match")
      },
      onReset(evt) {
        evt.preventDefault()
        // Reset our form values
        this.form.email = ''
        this.form.name = ''
        this.form.food = null
        // Trick to reset/clear native browser form validation state
        this.show = false
        this.$nextTick(() => {
          this.show = true
        })
			},
			register(){
				let localThis = this
				axios.post( 'http://localhost:3003/user',
						{
							'userName':localThis.form.username,
							'firstName':localThis.form.name,
							'lastName':localThis.form.lastName,
							'password':localThis.form.password
						}
					).then(function(response){
						localThis.changePage()
					})
					.catch(function(err){
						console.log(err)
					});
			},
			changePage(){
        this.$router.push({
            path: '/login'
        })
      }
    }
	}
	
</script>

<style scoped>
	.card-img-top {
			display: block;
			margin-left: auto;
			margin-right: auto;
			width: 60%;
	}
	.card {
		margin-top: 50px;
	}
	.grey-text {
		margin-top: 10px;
	}
</style>