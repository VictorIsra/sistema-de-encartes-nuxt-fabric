import axios from 'axios'

export default {
  auth: {
    me: () => axios.get('users/me'),
    login: (data) => axios.post('users/login', data),
    logout: (data) => axios.post('users/logout',data)
  },
  campanha: {
    getProdutos: (campanha_id) => axios.get('/campanhas/produtos',campanha_id),//pega vetor de produtos de uma campanha particular
    createCampanha:(data) => axios.post('/campanhas/createCampanha',data),//cria CAMPANHA
    removeCampanha:(campanha_id) => axios.post('/campanhas/removeCampanha',campanha_id),
    updateRow: (data) => axios.patch('campanhas/updateRow',data),//faz update de uma row de produtos de uma campanha
    addRow: (data) => axios.post('campanhas/addRow',data),//adiciona uma row de produtos em uma campanha
    removeRow: (data) => axios.delete('/campanhas/removeRow',data)//remove uma row de produtos de uma campanha
  }
}