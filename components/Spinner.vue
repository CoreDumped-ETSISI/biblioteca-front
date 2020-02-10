<template>
  <div class="spinner-container">
    <div class="book">
      <div class="book-cover">
        <div class="book-pages l"></div>
        <div class="book-pages r"></div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.spinner-container {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;
  color: #ddd;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.5));
  .book-cover {
    width: 150px;
    height: 100px;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    & .book-pages {
      background: #eaeaea;
      width: 50%;
      height: 100%;
      border-radius: 5px;
      &.r {
        position: relative;
        box-shadow: 5px 5px 8px #21212170, -2px -2px 2px #f3f3f350,
          inset 2px 2px 2px #f3f3f350, inset -5px -5px 5px #21212150;
      }
      &.r::after {
        content: "";
        display: flex;
        width: 100%;
        height: 100%;
        border-radius: 5px;
        position: absolute;
        left: 0;
        top: 0;
        animation: flip-page 0.75s ease-in-out infinite;
        background: #eaeaea;
        box-shadow: 10px 10px 10px #21212110, inset 2px 2px 2px #f3f3f350,
          inset -1px -1px 3px #21212150;
      }
      &.l {
        box-shadow: 5px 5px 8px #21212170, -2px -2px 2px #f3f3f350,
          inset 5px 5px 5px #21212110, inset -2px -2px 2px #21212150;
      }
    }
  }
}

@keyframes flip-page {
  0% {
    width: calc(100% - 5px);
    transform: skewy(0);
    height: calc(100% - 5px);
  }
  50% {
    width: 0;
    left: 0;
    transform: skewy(30deg) rotateY(0);
    height: calc(110% - 5px);
  }
  100% {
    left: -100%;
    width: 100%;
    transform: skewy(0deg);
  }
}
</style>
