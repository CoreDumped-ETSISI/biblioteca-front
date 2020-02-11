import axios from "axios";

export default function ({ store, redirect }) {
    // If the user is not authenticated
    let config = { headers: { Authorization: 'Bearer '+localStorage.getItem("user-token") } }
    axios.get(`http://localhost:3003/user/isAdmin`, config)
    .catch(e => {
      console.log(e)
			return redirect('/login')
    })
  }