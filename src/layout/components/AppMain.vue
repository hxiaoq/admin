<template>
  <section class="app-main">
    <div ref="appBasicContainer" class="app-basic-container">
      <transition name="fade-transform" mode="out-in">
        <router-view :key="key" :apprefs="$refs" />
      </transition>
    </div>
  </section>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  },
  mounted() {
    const $appBasicContainer = document.getElementsByClassName('app-basic-container')[0]
    const appContainerHeight = parseInt(window.getComputedStyle($appBasicContainer).getPropertyValue('height')) - 20
    Cookies.set('appContainerHeight', appContainerHeight)
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /*50 = navbar 34=tagsView   topbar =56*/
  /*140 = tagsView34 + navbar 50 + topbar 56  */
  min-height: calc(100vh - 140px);
  width: 100%;
  position: relative;
  overflow: hidden;
  .app-basic-container {
    margin: 5px;
    padding: 10px;
    border-radius: 5px;
    background: #ffffff;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    height: calc(100vh - 150px);
    overflow: hidden;
    overflow-y: auto;
  }
}
.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 140 = navbar + tags-view+ topbar = 50 + 34 + 56 */
    min-height: calc(100vh - 140px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
.noTagsView.noNavBar {
  .app-main {
    /* 140 = navbar + tags-view+ topbar = 50 + 34 + 56 */
    min-height: calc(100vh - 56px);
    .app-basic-container {
      height: calc(100vh - 66px);
    }
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
