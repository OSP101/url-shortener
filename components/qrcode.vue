<template>
    <div>
      <canvas ref="canvas"></canvas>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, defineProps } from 'vue';
  import QRCode from 'qrcode';
  
  const props = defineProps({
    content: String 
  });
  
  const canvas = ref(null);
  
  onMounted(() => {
    QRCode.toCanvas(canvas.value, props.content, (error) => {
      if (error) console.error(error);
      console.log('QR code generated!');
      console.log(canvas.value);
      console.log(props.content);
    });
  });
  </script>
  
  <style scoped>
  canvas {
    width: 300px;
    height: 300px;
  }
  </style>
  