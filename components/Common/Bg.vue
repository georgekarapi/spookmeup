<template>
    <div id="bg" />
</template>
<style lang="scss" scoped>
#bg {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    height: 100vh;
    width: 100vw;
    background-image: url('assets/images/bg.webp');
    height: 100vh;
    background-size: cover;
    background-position: center;
}

#bg::after {
    content: '';
    position: fixed;
    background-color: black;
    opacity: 0.45;
    width: 100%;
    height: 100%;
}
</style>
