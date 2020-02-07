<template>
  <div>
    <nuxt />
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");
@import url("https://fonts.googleapis.com/css?family=Roboto:400,500,700,900&display=swap");
:root {
  /**
  --foreground-color-main: #212529;
  --foreground-color-main-transparent: #212529cc;
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
 */

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
  --bg-color-2: #000;
  --bg-color-input: #1a1a1a;
  --bg-color-input-search: #222;
  --bg-color-input-alt: #0d0d0d;
  --bg-color-tag: #0d0d0d;
  --bg-color-tag-alt: #000;
  --bg-color-tag-empty: #0c0c0c;
  --color-border: #333;
}

/**

    --foreground-color-main: #eaeaea;
    --foreground-color-alt: #fff;
    --foreground-color-alt-transparent: rgba(255,255,255,0.25098);
    --foreground-color-alt-transparent-low: rgba(255,255,255,0.86667);
    --main-color: white;
    --main-color--transparent: rgba(255, 255, 255, 0.70196);
    --bg-color-1: #1c1c1c;
    --bg-color-2: #000;
    --bg-color-input: #f3f3f3;
    --bg-color-input-alt: #f5f5f5;
    --bg-color-tag: #f5f5f5;
    --bg-color-tag-alt: #fcfcfc;
    --bg-color-tag-empty: rgba(245,245,245,0.8);

 */
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
