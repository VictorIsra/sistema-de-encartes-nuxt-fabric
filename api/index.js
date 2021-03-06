import axios from 'axios'

export default {
  auth: {
    me: () => axios.get('users/me'),
    login: (data) => axios.post('users/login', data),
    logout: (data) => axios.post('users/logout',data),
    signin: (data) => axios.post('/users/signin',data),
    fetch: () => axios.get('/users/all'),
    remove: (data) => axios.put('/users/remove',data),
    checkRoot: (data) => axios.get('users/checkRoot')
  },
  produto: {
    getProdutos: (data) => axios.get('/produtos/getProdutos',data),
    addProduto: (data) => axios.post('/produtos/addProduto',data),
    updateProduto: (data) => axios.patch('/produtos/updateProduto',data),
    removeProduto: (data) => axios.put('/produtos/removeProduto',data)
  },
  background: {
    getBackgrounds: (data) => axios.get('/backgrounds/getBackgrounds',data),
    addBackground: (data) => axios.post('/backgrounds/addBackground',data),
    removeBackground: (data) => axios.put('/backgrounds/removeBackground',data)
  },
  complementar: {
    getComplementar: (data) => axios.get('/complementares/getComplementar',data),
    addComplementar: (data) => axios.post('/complementares/addComplementar',data),
    removeComplementar: (data) => axios.put('/complementares/removeComplementar',data)
  },
  campanha: {
    getProdutos: (data) => axios.get('/campanhas/produtos',data),//pega vetor de produtos de uma campanha particular
    getGeneralInfo: (data) => axios.get('/campanhas/generalInfo',data),//pega as tds as info das  campanhas ( com excecao dos produtos)
    createCampanha:(data) => axios.post('/campanhas/createCampanha',data),//cria CAMPANHA
    removeCampanha:(data) => axios.put('/campanhas/removeCampanha',data),
    saveTabloide: (data) => axios.post('/campanhas/saveTabloide',data),
    loadTabloide: (data) => axios.get('/campanhas/loadTabloide',data),
    updateStatus: (data) => axios.patch('/campanhas/changeStatus',data),
    dropImg:(data) => axios.post('/campanhas/removeImg',data),
    updateRow: (data) => axios.patch('campanhas/updateRow',data),//faz update de uma row de produtos de uma campanha
    addRow: (data) => axios.post('campanhas/addRow',data),//adiciona uma row de produtos em uma campanha
    removeRow: (data) => axios.put('/campanhas/removeRow',data),//remove uma row de produtos de uma campanha
    uploadImg: (data) => axios.post('/campanhas/uploadImg',data),
    removeImg: (data) => axios.post('/campanhas/removeImg',data)
  },
}