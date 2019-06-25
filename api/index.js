import axios from 'axios'

export default {
  auth: {
    me: () => axios.get('users/me'),
    login: (data) => axios.post('users/login', data),
    logout: (data) => axios.post('users/logout',data)
  },
  campanha: {
    me: () => axios.get('campanhas/me'),
    create:(data) => axios.post('campanhas/criar',data),//cria CAMPANHA
    update: (data) => axios.patch('campanhas/updateRow',data),//faz update de uma row de uma campanha
    addRow: (data) => axios.post('campanhas/addRow',data)
  }
}