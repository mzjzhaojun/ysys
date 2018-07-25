<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar :menu="menus"></v-sidebar>
        <div class="content">
            <transition name="move" mode="out-in"><router-view></router-view></transition>
        </div>
    </div>
</template>

<script>
    import vHead from './Header.vue';
    import vSidebar from './menu.vue';
    export default {
        components:{
            vHead, vSidebar
        },
        data() {
            return {
              menus: []
            }
        },
      created:function(){
        const self = this;
        self.menus = JSON.parse(window.sessionStorage.getItem('ms_menus'));
      },
      methods: {

      }
    }
</script>
