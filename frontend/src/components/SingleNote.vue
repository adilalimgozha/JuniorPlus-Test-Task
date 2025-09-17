<script setup lang="ts">


const props = defineProps<{
    id: number,
    title: string,
    content: string
}>()

</script>

<template>

    <div class="card">
        <h2>{{ props.title }}</h2>
    </div>
 
</template>

<style scoped>
    .card{
        width: 15em;
        border: grey solid;
        border-radius: 2em;
        margin-top: 1em;
        cursor: pointer;
        background-color: rgb(195, 180, 133);
        word-break: normal;
        overflow-wrap: anywhere;
    }
</style>
