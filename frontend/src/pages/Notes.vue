<script setup lang="ts">
import { ref, onMounted } from "vue"
import SingleNote from "../components/SingleNote.vue"
import { useRouter } from 'vue-router'

const router = useRouter()


interface Note {
  id: number
  title: string
  content: string
  created_at?: string
  updated_at?: string
}


const notes = ref<Note[]>([])
const title = ref<string>("")
const content = ref<string>("")
const loading = ref<boolean>(false)
const error = ref<string>("")


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'


function goToDetails(id: number): void {
  router.push(`/${id}`)
}


async function getNotes(): Promise<Note[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/notes`)
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    
    const data: Note[] = await res.json()
    return data
    
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
    console.error('getNotes error:', err)
    error.value = `Error fetching notes: ${errorMessage}`
    return [] 
  }
}


async function addNote(): Promise<void> {
  try {

    if (!title.value.trim() || !content.value.trim()) {
      error.value = "Title and content are required"
      return
    }

    loading.value = true
    error.value = ""

    const res = await fetch(`${API_BASE_URL}/api/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: title.value.trim(),
        content: content.value.trim()
      })
    })

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const newNote: Note = await res.json()
    
    notes.value.unshift(newNote)  //note on top
    
    title.value = ""
    content.value = ""
    
    console.log("Note added successfully:", newNote)
    
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
    error.value = `Error adding note: ${errorMessage}`
    console.error('addNote error:', err)
  } finally {
    loading.value = false
  }
}


async function refreshNotes(): Promise<void> {
  loading.value = true
  error.value = ""
  
  const fetchedNotes = await getNotes()
  notes.value = fetchedNotes
  
  loading.value = false
}


onMounted(async (): Promise<void> => {
  await refreshNotes()
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
    <button :disabled="loading" type="submit">Add</button>
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

form{
  background-color: rgb(222, 162, 21);
  padding: 1em;
  border-radius: 2em;
}

input {
  display: block;
  padding: 0.375rem 0.75rem;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #bdbdbd;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  margin-left: 2em;
}

</style>