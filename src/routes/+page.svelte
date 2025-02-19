<script lang="ts">
	import QRScanner from './templates/qrscanner.svelte';
  </script>
  
  <main class="min-h-screen bg-gray-100">
	<nav class="bg-white shadow-md">
	  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between h-16">
		  <div class="flex items-center space-x-8">
			<h1 class="text-xl font-bold text-gray-800">RUNFUN</h1>
			<div class="hidden md:flex space-x-4">
			  <button class="text-gray-600">All Events</button>
			  <button class="text-gray-600">Set</button>
			</div>
		  </div>
		  <div class="flex items-center space-x-4">
			<button class="text-gray-600">
			  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
			  </svg>
			</button>
			<button class="text-gray-600">
			  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
			  </svg>
			</button>
		  </div>
		</div>
	  </div>
	</nav>
  
	<div class="py-6">
	  <QRScanner />
	</div>
  </main>
  
  <style>
	:global(body) {
	  background-color: #f3f4f6;
	}
  </style>