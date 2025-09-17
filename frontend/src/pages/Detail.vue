<script setup lang="ts">

import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

interface Note {
    id: number,
    title: string,
    content: string
}

const router = useRouter()
const route = useRoute()
const id = Number(route.params.id)
const note = ref<Note | null>(null)
const editMode = ref<Boolean>(false)
const title = ref<string>("")
const content = ref<string>("")

async function getNoteById(id: number) {
    try{
        const res = await fetch(`http://localhost:3000/api/notes/${id}`)
        if (!res.ok) throw new Error("Error of fetching note")
        note.value = await res.json()
    }catch(err){
        console.error(err)
    }
}

async function handleDelete() {
    try{
        const res = await fetch(`http://localhost:3000/api/notes/${id}`, {
            method: "DELETE"
        })
        if (!res.ok) throw new Error("Error of deleting")
        note.value = await res.json()
        router.push("/")
    }catch(err){
        console.error(err)
    }
}

function changeEditMode() {
    editMode.value = !editMode.value
    title.value = note.value?.title ?? ""
    content.value = note.value?.content ?? ""
}

async function finishEdit() {
    try{
        const res = await fetch(`http://localhost:3000/api/notes/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title.value,
                content: content.value
            })
        })

        if (!res.ok) throw new Error("Error of deleting")
        note.value = await res.json()
        changeEditMode()
    }catch(err){
        console.error(err)
    }
}


onMounted(() => {
    getNoteById(id)
})
</script>

<template>
    <nav>
        <RouterLink to="/">Go Home</RouterLink>
    </nav>

    <div v-if="editMode === true">
        <form @submit.prevent="finishEdit">
            <div class="label">
                <label for="title">Change Title</label>
                <input v-model="title" id="title" type="text">
            </div>
            <div class="label">
                <label for="content">Change Content</label>
                <input v-model="content" id="content" type="text">
            </div>
            <button type="submit">Save</button>
        </form>
        <button @click="changeEditMode">Cancel</button>
    </div>
    <div v-else>
        <div class="info">
            <h2>{{ note?.title }}</h2>
            <div class="note">{{ note?.content }}</div>
        </div>
        <button @click="handleDelete">Delete</button>
        <button @click="changeEditMode">Edit</button>
    </div>

</template>

<style scoped>
button{
    margin: 1em;
}

.info {
    background-color: rgb(222, 162, 21);
    padding: 1em;
    border-radius: 2em;
    margin-top: 2em;
    margin-bottom: 2em;
    min-height: 10em;
    min-width: 20em;
    max-width: 40em;
    word-break: normal;
    overflow-wrap: anywhere;
}

</style>
