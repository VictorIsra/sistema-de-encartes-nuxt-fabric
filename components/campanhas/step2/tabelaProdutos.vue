<template>
  <v-card>
    <v-card-title>
       <v-text-area>
            Você pode remover um item,
     editá-lo,excluí-lo da tabela, bem como
     listá-los por ordem crescente ou decrescente.
       </v-text-area>
   
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Buscar produto"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="linhas"
      :search="search"
    >
      <template v-slot:items="props">
       
        <td class="text-xs-center">{{ props.item.img }}</td>
        <td class="text-xs-center">{{ props.item.nome }}</td>
        <td class="text-xs-center">{{ props.item.qtdade }}</td>
        <td class="text-xs-center">{{ props.item.unidade }}</td>
        <td class="text-xs-center">{{ props.item.obs }}</td>
        <td class="text-xs-center">{{ props.item.data_i }}</td>
        <td class="text-xs-center">{{ props.item.data_f }}</td>
        <td class="text-xs-center">{{ props.item.preco_c }}</td>
        <td class="text-xs-center">{{ props.item.preco_v }}</td>
        <td class="text-xs-center">{{ props.item.selout }}</td>
        <td class="text-xs-center">{{ props.item.marluc}}</td>
      </template>
      <template v-slot:no-results>
        <v-alert :value="true" color="error" icon="warning">
          O produto "{{ search }}" não foi encontrado.
        </v-alert>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  export default {
    data () {
      return {
        search: '',
        headers: [
            
          { text: 'IMAGEM', value: 'img' },
          { text: 'PRODUTO', value: 'nome' },
          { text: 'ESTOQUE', value: 'qtdade' },
          { text: 'UNIDADE', value: 'unidade' },
          { text: 'OBSERVAÇÃO', value: 'obs' },
          { text: 'DATA DE INÍCIO', value: 'data_i' },
          { text: 'DATA DE TÉRMINO', value: 'data_f' },
          { text: 'PREÇO DE COMPRA', value: 'preco_c' },
          { text: 'PREÇO DE VENDA', value: 'preco_v' },
          { text: 'SELL OUT', value: 'selout' },
          { text: 'MARGEM DE LUCRO', value: 'marluc' }        

        ],
        //vira do bd, mas hardodearei por hora:
        linhas: [
        {
            img:  'xd.png',
            nome: 'ALCATRA',
            qtdade: 159,
            unidade: 'kg',
            obs: 'nada a declarar',
            data_i: '10/05/2019',
            data_f: '22/06/2019',
            preco_c: '10$',
            preco_v: '30$',
            selout: '',
            marluc: '50%'
        }, 
        {
            img:  'pqp.png',
            nome: 'Arroz',
            qtdade: 409,
            unidade: 'kg',
            obs: 'nada a declarar',
            data_i: '11/05/2019',
            data_f: '23/06/2019',
            preco_c: '130$',
            preco_v: '303$',
            selout: '--',
            marluc: '10%'
        }
          
        ]
      }
    }
  }
</script>