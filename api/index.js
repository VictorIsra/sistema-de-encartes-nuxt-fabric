import axios from 'axios'

export default {
  auth: {
    me: () => axios.get('users/me'),
    login: (data) => axios.post('users/login', data),
    logout: (data) => axios.post('users/logout',data)
  },
  campanha: {
    me: (campanha_id) => axios.get('/campanhas/produtos',campanha_id),
    create:(data) => axios.post('campanhas/criar',data),//cria CAMPANHA
    update: (data) => axios.patch('campanhas/updateRow',data),//faz update de uma row de produtos de uma campanha
    addRow: (data) => axios.post('campanhas/addRow',data),//adiciona uma row de produtos em uma campanha
    removeRow: (data) => axios.delete('/campanhas/removeRow',data)//remove uma row de produtos de uma campanha
  }
}