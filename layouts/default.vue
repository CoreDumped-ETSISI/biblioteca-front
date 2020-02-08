<script>
import { themeService } from "@/services/themeService";

export default {
  mounted() {
    const theme = localStorage.getItem("theme") || "light";
    if (theme === "null") {
      themeService.setTheme("light");
    } else {
      themeService.setTheme(theme);
    }
  },
  created() {
    this.subscription = themeService.getTheme().subscribe(theme => {
      localStorage.setItem("theme", theme);
      this.theme = theme;
      document.getElementsByTagName("body")[0].classList = theme;
    });
  },
  beforeDestroy() {
    this.subscription.unsubscribe();
  }
};
</script>

<template>
  <div>
    <nuxt />
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");
@import url("https://fonts.googleapis.com/css?family=Roboto:400,500,700,900&display=swap");

@keyframes clip-fade {
  0% {
    clip-path: circle(100% at 50% 50%);
  }

  100% {
    clip-path: circle(0% at calc(100% - calc(2.5vw + 20px)) 34px);
  }
}

body.tmp {
  position: absolute;
  top: 0;
}

body.tmp:not(.copy) {
  z-index: 10;
}

body.tmp.copy {
  z-index: 999999999;
  animation: clip-fade 0.5s ease-in-out;
}

body.dark {
  --foreground-color-main: #eaeaea;
  --foreground-color-main-transparent: #eaeaeacc;
  --foreground-color-alt: #fff;
  --foreground-color-alt-transparent: #ffffff40;
  --foreground-color-alt-transparent-low: #ffffffdd;
  --main-color: white;
  --main-color-alt: var(--bg-color-input-search);
  --main-color-alt-fg: var(--foreground-color-main);
  --main-color--transparent: #ffffffb3;
  --bg-color-1: #1b1b1b;
  --bg-color-2: #111111;
  --bg-color-input: #1a1a1a;
  --bg-color-input-search: #222;
  --bg-color-input-alt: #0d0d0d;
  --bg-color-tag: #0d0d0d;
  --bg-color-tag-alt: #111;
  --bg-color-tag-empty: #0c0c0c;
  --color-border: #333;
  --shadow-btn-main: 5px 5px 5px #00000047, -5px -5px 5px #ffffff20,
    inset 5px 5px 5px #00000045, inset -5px -5px 5px #ffffff11;
  --shadow-btn-main--hover: 5px 5px 5px rgba(0, 0, 0, 0.17843),
    -5px -5px 5px rgba(255, 255, 255, 0.05549),
    inset 5px 5px 5px rgba(0, 0, 0, 0.27059),
    inset -5px -5px 5px rgba(255, 255, 255, 0.04667);
  --shadow-book: 9px 9px 12px #00000087, -6px -6px 13px #1b1b1be8;
  --shadow-tag: 3px 3px 5px #00000050, -3px -3px 5px #161616be;
}

body.light {
  --foreground-color-main: #333;
  --foreground-color-main-transparent: #333333cc;
  --foreground-color-alt: #000;
  --foreground-color-alt-transparent: #00000040;
  --foreground-color-alt-transparent-low: #000000dd;
  --main-color: #0d860f;
  --main-color--transparent: #0d860fb3;
  --main-color-alt: var(--main-color);
  --main-color-alt-fg: var(--bg-color-1);
  --bg-color-1: white;
  --bg-color-2: #fafafa;
  --bg-color-input: #f3f3f3;
  --bg-color-input-search: #f3f3f3;
  --bg-color-input-alt: #f5f5f5;
  --bg-color-tag: #f5f5f5;
  --bg-color-tag-alt: #fcfcfc;
  --bg-color-tag-empty: #f5f5f5cc;
  --color-border: #d9d9d9;
  --shadow-btn-main: 5px 5px 5px #00000027, -5px -5px 5px #08af0b20,
    inset 3px 3px 5px #00000035, inset -5px -5px 5px #0d860f21;
  --shadow-btn-main--hover: 5px 5px 5px #00000020, -5px -5px 5px #0d860f0e,
    inset 3px 3px 5px #00000025, inset -5px -5px 5px #0d860f0c;
  --shadow-book: 9px 9px 12px #00000087, -6px -6px 13px #ffffffe8;
  --shadow-tag: 3px 3px 5px hsla(0, 0%, 0%, 0.219), -5px -5px 5px #ffffffb4;
}

html {
  font-family: "Roboto", sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

body {
  margin: 0;
  max-width: -webkit-fill-available;
  overflow-x: hidden;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:ho er {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
