import axios from "axios";

export default function ({ store, redirect }) {
    // If the user is not authenticated
    if(localStorage.getItem("user-token")!=null) {
        let config = { headers: { Authorization: 'Bearer '+localStorage.getItem("user-token") } }
        axios.get(`http://192.168.0.104:3003/user/private`, config)
        .then((response) => {
            return redirect('/bookcatalogue')
        })
    }
}