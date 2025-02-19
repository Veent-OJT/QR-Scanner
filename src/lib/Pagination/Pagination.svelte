<script lang="ts">
    export let currentPage: number;
    export let totalPages: number;
    export let onPageChange: (page: number) => void;
  
    function goToPage(page: number) {
      if (page >= 1 && page <= totalPages) {
        onPageChange(page);
      }
    }
  
    function nextPage() {
      if (currentPage < totalPages) {
        onPageChange(currentPage + 1);
      }
    }
  
    function previousPage() {
      if (currentPage > 1) {
        onPageChange(currentPage - 1);
      }
    }
  </script>
  
  <div class="hidden md:flex items-center justify-center space-x-2 mt-4">
    <!-- Previous button -->
    <button 
      class="h-8 w-8 flex items-center justify-center rounded-md hover:bg-gray-100 disabled:opacity-50"
      on:click={previousPage}
      disabled={currentPage === 1}
    >
      <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    
    <!-- First page -->
    <button 
      class="h-8 w-8 flex items-center justify-center rounded-md {currentPage === 1 ? 'bg-red-500 text-white' : 'hover:bg-gray-100 text-gray-600'}"
      on:click={() => goToPage(1)}
    >
      1
    </button>
  
    <!-- Ellipsis if needed -->
    {#if currentPage > 3}
      <span class="h-8 w-8 flex items-center justify-center text-gray-600">...</span>
    {/if}
  
    <!-- Pages around current page -->
    {#each Array(3) as _, i}
      {#if currentPage - 1 + i > 1 && currentPage - 1 + i < totalPages}
        <button 
          class="h-8 w-8 flex items-center justify-center rounded-md {currentPage === currentPage - 1 + i ? 'bg-red-500 text-white' : 'hover:bg-gray-100 text-gray-600'}"
          on:click={() => goToPage(currentPage - 1 + i)}
        >
          {currentPage - 1 + i}
        </button>
      {/if}
    {/each}
  
    <!-- Ellipsis if needed -->
    {#if currentPage < totalPages - 2}
      <span class="h-8 w-8 flex items-center justify-center text-gray-600">...</span>
    {/if}
  
    <!-- Last page -->
    {#if totalPages > 1}
      <button 
        class="h-8 w-8 flex items-center justify-center rounded-md {currentPage === totalPages ? 'bg-red-500 text-white' : 'hover:bg-gray-100 text-gray-600'}"
        on:click={() => goToPage(totalPages)}
      >
        {totalPages}
      </button>
    {/if}
  
    <!-- Next button -->
    <button 
      class="h-8 w-8 flex items-center justify-center rounded-md hover:bg-gray-100 disabled:opacity-50"
      on:click={nextPage}
      disabled={currentPage === totalPages}
    >
      <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>