<template>
    <div>
        <a v-for="(item,i) in data" :key="i" @click="downLoad(item.id)" style='display:block;color:#409EFF'>{{item.name}}</a>
    </div>
</template>
<script>
import enumPublic from "@/api/enumPublic.js";
export default {
    props:["id","bussType"],
    data () {
        return {
            data:[]
        }
    },
    created(){
        //   console.log("子组件创建")
        // console.log(this.id)
        //  this.formatter(this.id);
    },
    mounted(){
        // console.log("子组件")
         this.formatter();
    },
    methods:{
    formatter(){
        var params ={
          id:this.id,
          bussType:this.bussType
        }
        var that = this
       enumPublic.getFile(params).then((response) => {
               if(response.data.length>0){
                   response.data.forEach(function(item,i){
                    that.data.push({name:item.name,id:item.id})
                   })
               }
          })
    },
    downLoad(id){
         this.$emit('downLoad', id)
    }
    }
}
</script>