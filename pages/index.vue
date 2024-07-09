<template>

    <div class="hero bg-base-200 min-h-screen ">
        <div class="hero-content text-center">
            <div class="max-w-2xl container mx-auto">
                <h1 class="text-3xl font-medium mb-4">Welcome to URL shortener</h1>
                <div class="card bg-base-100 shadow-xl">
                    <div class="card-body w-full">
                        <h2 class="card-title text-center">Paste the URL to be shortened</h2>
                        <form @submit.prevent="shortenURL">
                            <div class="md:flex md:w-full ">

                                <label class="form-control md:w-2/3">
                                    <div class="label">
                                        <span class="label-text">Enter the URL</span>
                                    </div>
                                    <input id="originalURL" v-model="originalURL" required type="text"
                                        placeholder="https://" class="input input-bordered w-full" />
                                </label>

                                <label class="form-control md:w-1/3 md:ml-3">
                                    <div class="label">
                                        <span class="label-text">Custom short URL</span>
                                    </div>
                                    <input id="customSlug" v-model="customSlug" type="text" placeholder="(Optional)"
                                        class="input input-bordered w-full" />
                                </label>

                                <label class="form-control md:ml-3">
                                    <div class="label">
                                        <span class="label-text">.</span>
                                    </div>
                                    <button type="submit" class="btn btn-outline btn-secondary">SHORTEN</button>
                                </label>

                                
                            </div>
                        </form>

                        <div v-if="number == 2">
                            <h2 class="card-title text-center mt-10">Your short link</h2>
                            <div role="alert" class="alert alert-success" v-if="isCopied">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current"
                                    fill="none" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Successfully copied URL!</span>
                            </div>
                            <label class="form-control">
                                <button class="btn" @click="copyToClipboard">
                                    {{ shortenedURL }}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                        viewBox="0 0 256 256">
                                        <path fill="currentColor"
                                            d="M216 32H88a8 8 0 0 0-8 8v40H40a8 8 0 0 0-8 8v128a8 8 0 0 0 8 8h128a8 8 0 0 0 8-8v-40h40a8 8 0 0 0 8-8V40a8 8 0 0 0-8-8m-8 128h-32V88a8 8 0 0 0-8-8H96V48h112Z" />
                                    </svg>
                                </button>
                                <!-- <div class="label">
                                    <span class="label-text truncate text-clip">Long link: {{ original }}</span>
                                </div> -->
                            </label>
                            <qrcode :content="originalURL" class="flex justify-center mt-4"/>
                        </div>

                        <div v-else-if="number == 1">
                            <div role="alert" class="alert alert-error mt-3">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current"
                                    fill="none" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{{ status }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>


const originalURL = ref('')
const customSlug = ref('')
const shortenedURL = ref('')
const original = ref('')
const status = ref('')
const number = ref(0)

import { ref } from 'vue'

// const props = defineProps({
//     shortenedURL: String
// })


const isCopied = ref(false)


const copyToClipboard = async () => {
    try {
        await navigator.clipboard.writeText(shortenedURL.value)
        isCopied.value = true
        console.log(shortenedURL.value)
        setTimeout(() => {
            isCopied.value = false
        }, 2000)
    } catch (err) {
        console.error('ไม่สามารถคัดลอก URL ได้:', err)
    }
}

async function shortenURL() {
    const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            originalURL: originalURL.value,
            customSlug: customSlug.value,
        }),
    })
    const data = await response.json()
    shortenedURL.value = data.shortenedURL
    original.value = data.originalURL
    status.value = data.error
    number.value = data.number
}



</script>