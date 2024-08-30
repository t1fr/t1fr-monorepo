<script setup lang="ts">

const iframeSrc = "https://docs.google.com/spreadsheets/d/1mYKiN-Nt9OLBZBwkkGZzL108hAVWPYkAhuHsrUNKQGA/preview";
const metalistLink = "https://docs.google.com/spreadsheets/d/1mYKiN-Nt9OLBZBwkkGZzL108hAVWPYkAhuHsrUNKQGA/edit?usp=sharing";
</script>

<template>
    <div class="flex flex-col">
        <div class="text-center p-2 font-bold">
            <span class="mr-2">Credits to BofSs for the Metalist.</span>
            <a :href="metalistLink" target="_blank" rel="noopener noreferrer">Source</a>
        </div>
        <iframe :src="iframeSrc" class="flex-1" />
    </div>
</template>