<template>
  <div class="container">
    <span class="typed-text text-primary text-center">
      <span v-if="typeValue">"</span>{{ typeValue
      }}<span v-if="typeValue">"</span></span
    >
    <!-- <span class="blinking-cursor">|</span>
    <span class="cursor" :class="{ typing: typeStatus }">&nbsp;</span> -->
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const typeValue = ref("");
const typeStatus = ref(false);
const displayTextArray = [
  "Bukannya jadi pelajaran..",
  "Eh.. Malah dianggap pelanggaran",
  "Bukannya jadi Evaluasi..",
  "Eh.. Malah dikasih sanksi",
  "Susah sih kalo apa - apa pake emosi...",
  "Minim Solusi.. hihi",
];
const typingSpeed = 50;
const erasingSpeed = 10;
const newTextDelay = 1000;
const indexText = ref(0);
const charIndex = ref(0);

const typeText = () => {
  if (charIndex.value < displayTextArray[indexText.value].length) {
    if (!typeStatus.value) typeStatus.value = true;
    typeValue.value += displayTextArray[indexText.value].charAt(
      charIndex.value
    );
    charIndex.value += 1;
    setTimeout(typeText, typingSpeed);
  } else {
    typeStatus.value = false;
    setTimeout(eraseText, newTextDelay);
  }
};
const eraseText = () => {
  if (charIndex.value > 0) {
    if (!typeStatus.value) typeStatus.value = true;
    typeValue.value = displayTextArray[indexText.value].substring(
      0,
      charIndex.value - 1
    );
    charIndex.value -= 1;
    setTimeout(eraseText, erasingSpeed);
  } else {
    typeStatus.value = false;
    indexText.value += 1;
    if (indexText.value >= displayTextArray.length) indexText.value = 0;
    setTimeout(typeText, typingSpeed + 1000);
  }
};

onMounted(() => {
  setTimeout(typeText(), newTextDelay + 200);
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.container {
  width: 30vw;
  height: 10vh;
  display: flex;
  justify-content: center;
  flex: start;
}

// h1 {

span.typed-text {
  font-size: 2rem;
  font-weight: normal;
  color: #d59e46;
  overflow-wrap: normal;
  word-wrap: break-word;
}
// }

// Cursor blinking CSS Starts...
.blinking-cursor {
  font-size: 2rem;
  color: #2c3e50;
  -webkit-animation: 1s blink step-end infinite;
  -moz-animation: 1s blink step-end infinite;
  -ms-animation: 1s blink step-end infinite;
  -o-animation: 1s blink step-end infinite;
  animation: 1s blink step-end infinite;
  white-space: pre-wrap;
  overflow-wrap: normal;
  word-wrap: break-word;
}

@keyframes blink {
  from,
  to {
    color: transparent;
  }

  50% {
    color: #2c3e50;
  }
}

@-moz-keyframes blink {
  from,
  to {
    color: transparent;
  }

  50% {
    color: #2c3e50;
  }
}

@-webkit-keyframes blink {
  from,
  to {
    color: transparent;
  }

  50% {
    color: #2c3e50;
  }
}

@-ms-keyframes blink {
  from,
  to {
    color: transparent;
  }

  50% {
    color: #2c3e50;
  }
}

@-o-keyframes blink {
  from,
  to {
    color: transparent;
  }

  50% {
    color: #2c3e50;
  }
}

// Cursor blinking CSS Ends...
</style>
