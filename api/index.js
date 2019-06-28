import axios from 'axios'

export default {
  auth: {
    me: () => axios.get('users/me'),
    login: (data) => axios.post('users/login', data),
    logout: (data) => axios.post('users/logout',data)
  },
  campanha: {
    getProdutos: (data) => axios.get('/campanhas/produtos',data),//pega vetor de produtos de uma campanha particular
    createCampanha:(data) => axios.post('/campanhas/createCampanha',data),//cria CAMPANHA
    removeCampanha:(data) => axios.post('/campanhas/removeCampanha',data),
    updateRow: (data) => axios.patch('campanhas/updateRow',data),//faz update de uma row de produtos de uma campanha
    addRow: (data) => axios.post('campanhas/addRow',data),//adiciona uma row de produtos em uma campanha
    removeRow: (data) => axios.put('/campanhas/removeRow',data),//remove uma row de produtos de uma campanha
    uploadImg: (data) => axios.post('/campanhas/uploadImg',data),
    removeImg: (data) => axios.post('/campanhas/removeImg',data)
  }
}