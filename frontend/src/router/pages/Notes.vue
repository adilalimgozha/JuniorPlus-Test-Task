<script setup lang="ts">
import {ref, onMounted} from "vue"
import SingleNote from "../../components/SingleNote.vue";
import { useRouter } from 'vue-router';

const router = useRouter()

interface Note {
  id: number
  title: string
  content: string
}

const notes = ref<Note[]>([])

const title = ref<string>("")
const content = ref<string>("")

function goToDetails(ID: number) {
  router.push(`/${ID}`)
}


async function getNotes() {
  try{
    const res = await fetch("http://localhost:3000/api/notes")
    if (!res.ok) throw new Error("Error of fetching data")
    return res.json()
  }catch(err){
    console.error(err)
  }
}

async function addNote() {
  try {
    const res = await fetch("http://localhost:3000/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: title.value,
        content: content.value
      })
    })

    if (!res.ok) {
      throw new Error("Error of adding Note")
    }

    const data = await res.json()
    notes.value = await getNotes()
    title.value = ""
    content.value = ""
    console.log("Server response:", data)
  } catch (err) {
    console.error(err)
  }
}


onMounted(async () => {
  notes.value = await getNotes()
})


</script>

<template>

    <h2>Notes Platform</h2>

  <form @submit.prevent="addNote">
    <div class="label">
    <label for="title">Enter Title</label>
    <input v-model="title" id="title" type="text">
    </div>
    <div class="label">
    <label for="content">Enter Content</label>
    <input v-model="content" id="content" type="text">
    </div>
    <button type="submit">Add</button>
  </form>

  <div class="app">
    <h4>Click on Card to see Details</h4>
    <ul class="list">
      <li v-for="note in notes" :key="note.id">
        <SingleNote @click="() => goToDetails(note.id)" :id="note.id" :title="note.title" :content="note.content"></SingleNote>
      </li>
    </ul>
  </div>

</template>

<style>
html, body, #app {
  min-height: 100vh;
  background-color: rgb(236, 195, 98);
  color: black;
}

.list{
  list-style-type: none;
}

.app{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.label{
    display: flex;
    justify-content: space-between;
    margin: 1em;
}

</style>