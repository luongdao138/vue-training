<template id="loading">
  <div class="reverse-spinner"></div>
</template>

<script setup></script>

<style lang="scss" scoped>
.reverse-spinner {
  position: relative;
  height: 100px;
  width: 100px;
  border: 4px solid transparent;
  border-top-color: #1976d2;
  border-left-color: #1976d2;
  border-radius: 50%;
  -webkit-animation: spin 1.5s linear infinite;
  animation: spin 1.5s linear infinite;
}

.reverse-spinner::before {
  position: absolute;
  top: 15px;
  left: 15px;
  right: 15px;
  bottom: 15px;
  content: '';
  border: 4px solid transparent;
  border-top-color: #03a9f4;
  border-left-color: #03a9f4;
  border-radius: 50%;
  -webkit-animation: spinBack 1s linear infinite;
  animation: spinBack 1s linear infinite;
}

@keyframes rotate {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes spin {
  from {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes spinBack {
  from {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(-720deg);
    transform: rotate(-720deg);
  }
}

@keyframes spinBorder {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
    border-width: 15px;
  }
  50% {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
    border-width: 3px;
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
    border-width: 15px;
  }
}

@keyframes grow {
  0%,
  40%,
  100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  40% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
</style>
