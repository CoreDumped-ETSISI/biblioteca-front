<template>
    <div>
        <h1>{{username}}</h1>
        <h1>{{firstname}}</h1>
        <h1>{{lastname}}</h1>
        <h1>{{creation}}</h1>
    </div>
</template>

<script>
import axios from "axios";
import book from "~/components/media/Book2.vue";
import bookSummary from "~/components/media/BookSummary.vue";

export default {
    data() {
        return {
            username: "",
            firstname: "",
            lastname: "",
            creation: undefined,
            books: []
        };
    },
  mounted() {
    let config = {
      headers: { Authorization: "Bearer " + localStorage.getItem("user-token") }
    };
    axios
      .get(`http://localhost:3003/user/getByName/`+localStorage.getItem("user-name"), config)
      .then(response => {
          console.log(response.data)
          this.username = response.data.user[0].userName;
          this.firstname = response.data.user[0].firstName;
          this.lastname = response.data.user[0].lastName;
          this.creation = response.data.user[0].creation;
          axios
            .get(`http://localhost:3003/download/getUserDownloads/`+response.data.user[0]._id, config)
            .then(response2 => {
                console.log(response2.data)
            })
      .catch(e => {
        this.errors.push(e);
      });
      })
      .catch(e => {
        this.errors.push(e);
      });
  }
}
</script>