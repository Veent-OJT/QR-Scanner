<script lang="ts">
  import { currentPage, totalPages, filteredAttendees } from '../stores/attendees';

  function goToPage(page: number) {
    if (page >= 1 && page <= $totalPages) {
      currentPage.set(page);
    }
  }
</script>

{#if $filteredAttendees.length > 0}
<div class="flex justify-end mt-6 pb-4">
  <div class="flex items-center gap-2">
    {#if $totalPages > 1}
      <button 
        class="h-8 w-8 flex items-center justify-center rounded-md hover:bg-gray-100 disabled:opacity-50"
        on:click={() => goToPage($currentPage - 1)}
        disabled={$currentPage === 1}
      >
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    {/if}

    <!-- First page always shows -->
    <button 
      class="h-8 w-8 flex items-center justify-center rounded-md {$currentPage === 1 ? 'bg-red-500 text-white' : 'hover:bg-gray-100 text-gray-600'}"
      on:click={() => goToPage(1)}
    >
      1
    </button>

    <!-- Middle pages only show if total pages > 2 -->
    {#if $totalPages > 2}
      {#if $currentPage > 3}
        <span class="h-8 w-8 flex items-center justify-center text-gray-600">...</span>
      {/if}

      {#each Array(3) as _, index}
        {#if $currentPage - 1 + index > 1 && $currentPage - 1 + index < $totalPages}
          <button 
            class="h-8 w-8 flex items-center justify-center rounded-md {$currentPage === $currentPage - 1 + index ? 'bg-red-500 text-white' : 'hover:bg-gray-100 text-gray-600'}"
            on:click={() => goToPage($currentPage - 1 + index)}
          >
            {$currentPage - 1 + index}
          </button>
        {/if}
      {/each}

      {#if $currentPage < $totalPages - 2}
        <span class="h-8 w-8 flex items-center justify-center text-gray-600">...</span>
      {/if}
    {/if}

    <!-- Last page only shows if more than one page -->
    {#if $totalPages > 1}
      <button 
        class="h-8 w-8 flex items-center justify-center rounded-md {$currentPage === $totalPages ? 'bg-red-500 text-white' : 'hover:bg-gray-100 text-gray-600'}"
        on:click={() => goToPage($totalPages)}
      >
        {$totalPages}
      </button>

      <button 
        class="h-8 w-8 flex items-center justify-center rounded-md hover:bg-gray-100 disabled:opacity-50"
        on:click={() => goToPage($currentPage + 1)}
        disabled={$currentPage === $totalPages}
      >
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    {/if}
  </div>
</div>
{/if}