import axios from 'axios';

// 基础配置
if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = 'http://localhost:8000';
} else {
  axios.defaults.baseURL = 'http://localhost:8000';
}

axios.defaults.timeout = 5000;

export default axios;