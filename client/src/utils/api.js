import axios from "axios";

const api = axios.create({
   // baseURL: "https://ec2-3-144-72-62.us-east-2.compute.amazonaws.com",
   baseURL: "https://www.albortest.com",
   //baseURL: "http://localhost:5000",
});

export { api };
