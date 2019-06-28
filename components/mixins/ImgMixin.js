export default {
    methods: {
        createImage(file, item) {
            let image = new Image();
            var reader = new FileReader(); 
            reader.onload = (e) => {
            //    item.img.src = e.target.result
            //    console.log(" e.target.result ", e.target.result)
            }
            reader.readAsDataURL(file);// console.log("crie img")
        }
    }
}