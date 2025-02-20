<script lang="ts">
	import '@fontsource/poppins';
	import { goto } from '$app/navigation';
  
	function goToQRScanner() {
	  goto('/templates/qrscanner');
	}
  </script>
  
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
	<div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
	  <h1 class="text-2xl font-bold text-center mb-6">Welcome to RUNFUN</h1>
	  <button 
		class="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
		on:click={goToQRScanner}
	  >
		Go to QR Scanner
	  </button>
	</div>
  </div>
  
  <style>
	:global(body) {
	  font-family: 'Poppins', sans-serif;
	}
  </style>