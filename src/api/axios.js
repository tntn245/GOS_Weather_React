import axios from "axios";

export default axios.create({
    baseURL: "https://weatherweb-1s99.onrender.com",
    withCredentials: true
});