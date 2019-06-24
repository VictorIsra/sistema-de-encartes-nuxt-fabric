import axios from 'axios'

export default {
  auth: {
    me: () => axios.get('users/me'),
    login: (data) => axios.post('users/login', data),
    logout: (data) => axios.post('users/logout',data)
  },
  campanha: {
    me: () => axios.get('campanhas/me'),
    criar:(data) => axios.post('campanhas/criar',data)
  }
}