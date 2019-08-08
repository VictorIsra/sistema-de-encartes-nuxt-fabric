<template>
    <div>
        <v-layout>
          <div>
                            <v-tooltip bottom>
                            <template v-slot:activator="{ on }" v-on="on">
                            <v-btn color="primary" fab small dark @click="addPolygon" v-on="on">
                                <v-icon size=30>crop_square</v-icon>
                            </v-btn>
                            </template>
                            <span class="subheading">Adicionar quadrado ao canvas</span>
                            </v-tooltip>
                        </div>
                         <div>
                            <v-tooltip bottom>
                            <template v-slot:activator="{ on }" v-on="on">
                            <v-btn color="primary" fab small dark @click="addElipse" v-on="on">
                                <v-icon size=30>vignette</v-icon>
                            </v-btn>
                            </template>
                            <span class="subheading">Adicionar elipse ao canvas</span>
                            </v-tooltip>
                        </div>
                         <div>
                            <v-tooltip bottom>
                            <template v-slot:activator="{ on }" v-on="on">
                            <v-btn color="primary" fab small dark @click="addCircle" v-on="on">
                                <v-icon size=30>lens</v-icon>
                            </v-btn>
                            </template>
                            <span class="subheading">Adicionar círculo ao canvas</span>
                            </v-tooltip>
                        </div>
                     
        </v-layout>
    </div>
</template>
<script>
export default {
    props:['canvas','colors'],
    data:()=>({

    }),
    methods:{
        addPolygon(){
            if(this.canvas !== undefined){
                var rect = new fabric.Rect({
                
                width: 350,
                height: 350,
                fill: 'yellow',
                stroke: 'red',
                strokeWidth: 5
                });
                this.canvas.add(rect)
            }
        },
        addCircle(){
                if(this.canvas !== undefined){
                    var object = new fabric.Circle({
                        radius: 150,
                        fill: 'yellow',
                        left: 0,
                        top: 100,
                        strokeWidth: 5,
                        stroke: 'red'
                    });
                    this.canvas.add(object)
                }
        },
        addElipse(){
            let ellip = new fabric.Ellipse({
               fill:'yellow',
                strokeWidth: 5,
                stroke: 'red',
                rx: 250,
                ry: 100
            });
        this.canvas.add(ellip)
        },
        addRectangle(){

        },
        addTriangle(){

        },
        strokeColor(){
            let cor = this.colors
            if( this.canvas.getActiveObject() === null)
                return
            console.log("ccAc ", typeof(this.colors))
            if(typeof(this.colors) === 'object'){
                cor = this.colors.hex8
            }
           if(this.canvas && this.canvas.getActiveObject()){

            if(this.canvas.getActiveObject() !== undefined && this.canvas.getActiveObject() !== null){
               let doomedObj = this.canvas.getActiveObject()
                if (doomedObj.type === 'activeSelection') {
                        doomedObj.forEachObject((obj) => {
                          // obj.set('strokeWidth', 5)
                           obj.set('stroke',cor)
                        })
                    
                }
                else{
                //um unico objeto selecionado
                    var activeObject = this.canvas.getActiveObject();
                    if(activeObject !== null ) {
                     //   this.canvas.getActiveObject().set('strokeWidth', 5)
                        this.canvas.getActiveObject().set('stroke',cor)
                    }
                }      
              this.canvas.renderAll()

           }
        }
    }}
}
</script>