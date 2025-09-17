<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

interface Note {
  id: number
  title: string
  content: string
  created_at?: string
  updated_at?: string
}


const router = useRouter()
const route = useRoute()


const id = Number(route.params.id)
const note = ref<Note | null>(null)
const editMode = ref<boolean>(false)
const title = ref<string>("")
const content = ref<string>("")
const loading = ref<boolean>(false)
const error = ref<string>("")


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'


async function getNoteById(id: number): Promise<void> {
  try {
    loading.value = true
    error.value = ""
    
    const res = await fetch(`${API_BASE_URL}/api/notes/${id}`)
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    
    const data: Note = await res.json()
    note.value = data
    
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
    error.value = `Error fetching note: ${errorMessage}`
    console.error('getNoteById error:', err)
  } finally {
    loading.value = false
  }
}

async function handleDelete(): Promise<void> {
  try {
    loading.value = true
    
    const res = await fetch(`${API_BASE_URL}/api/notes/${id}`, {
      method: "DELETE"
    })
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    

    await router.push("/")
    
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
    error.value = `Error deleting note: ${errorMessage}`
    console.error('handleDelete error:', err)
  } finally {
    loading.value = false
  }
}

function toggleEditMode(): void {
  editMode.value = !editMode.value
  
  if (editMode.value && note.value) {
    title.value = note.value.title
    content.value = note.value.content
  }
}

async function saveEdit(): Promise<void> {
  try {
    loading.value = true
    error.value = ""
    

    if (!title.value.trim() || !content.value.trim()) {
      error.value = "Title and content are required"
      return
    }
    
    const res = await fetch(`${API_BASE_URL}/api/notes/${id}`, {
      method: "PUT",
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
    
    const updatedNote: Note = await res.json()
    note.value = updatedNote
    editMode.value = false
    
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
    error.value = `Error updating note: ${errorMessage}`
    console.error('saveEdit error:', err)
  } finally {
    loading.value = false
  }
}


onMounted((): void => {
  if (id && !isNaN(id)) {
    getNoteById(id)
  } else {
    error.value = "Invalid note ID"
  }
})
</script>

<template>
    <nav>
        <RouterLink to="/">Go Home</RouterLink>
    </nav>

    <div v-if="editMode === true">
        <form @submit.prevent="saveEdit">
            <div class="label">
                <label for="title">Change Title</label>
                <input v-model="title" id="title" type="text">
            </div>
            <div class="label">
                <label for="content">Change Content</label>
                <input v-model="content" id="content" type="text">
            </div>
            <button :disabled="loading" type="submit">Save</button>
        </form>
        <button @click="toggleEditMode">Cancel</button>
    </div>
    <div v-else>
        <div class="info">
            <h2>{{ note?.title }}</h2>
            <div class="note">{{ note?.content }}</div>
        </div>
        <button @click="handleDelete">Delete</button>
        <button @click="toggleEditMode">Edit</button>
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
