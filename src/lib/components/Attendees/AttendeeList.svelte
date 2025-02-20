<!-- <script lang="ts">
    import { attendees, searchQuery, selectedFilter, currentPage, itemsPerPage } from '../stores/attendees';
    import Pagination from '../Pagination/Pagination.svelte';
  
    $: filteredAttendees = $attendees.filter(attendee => {
      const matchesFilter = $selectedFilter === 'ALL' ? true : attendee.status === $selectedFilter;
      const matchesSearch = attendee.name.toLowerCase().includes($searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  
    $: totalPages = Math.ceil(filteredAttendees.length / $itemsPerPage);
  
    $: paginatedAttendees = filteredAttendees.slice(
      ($currentPage - 1) * $itemsPerPage,
      $currentPage * $itemsPerPage
    );
  
    function handlePageChange(newPage: number) {
      currentPage.set(newPage);
    }
  </script>
  
  <div class="space-y-4">
    {#each paginatedAttendees as attendee}
      <div class="flex items-center justify-between py-2">
        <span class="text-sm text-gray-800">{attendee.name}</span>
        {#if $selectedFilter !== 'ALL'}
          <div class="flex flex-col items-end">
            <span 
              class={`px-3 py-1 rounded-full text-sm font-medium 
                ${attendee.status === 'IN' ? 'bg-green-100 text-green-800' : 
                  'bg-red-100 text-red-800'}`}
            >
              {attendee.status}
            </span>
            
            <p class="text-sm text-gray-500">
              {attendee.date} at {attendee.time}
            </p>
          </div>
        {/if}
      </div>
    {/each}
  </div>
 -->


 <script lang="ts">
  import { attendees, currentPage, itemsPerPage, selectedFilter } from '../stores/attendees';

  // Filter attendees
  $: filteredAttendees = $attendees.filter(attendee => {
    return $selectedFilter === 'ALL' ? true : attendee.status === $selectedFilter;
  });

  // Pagination for desktop only
  $: totalPages = Math.ceil(filteredAttendees.length / $itemsPerPage);
  $: paginatedAttendees = filteredAttendees.slice(
    ($currentPage - 1) * $itemsPerPage,
    $currentPage * $itemsPerPage
  );

  $: {
    if ($selectedFilter) {
      currentPage.set(1);
    }
  }
</script>

<!-- Desktop View -->
<div class="hidden md:block">
  <div class="space-y-4">
    {#each paginatedAttendees as attendee}
      <div class="flex items-center justify-between py-2">
        <span class="text-sm text-gray-800">{attendee.name}</span>
        {#if $selectedFilter !== 'ALL'}
          <div class="flex flex-col items-end">
            <span 
              class={`px-3 py-1 rounded-full text-sm font-medium 
                ${attendee.status === 'IN' ? 'bg-green-100 text-green-800' : 
                  'bg-red-100 text-red-800'}`}
            >
              {attendee.status}
            </span>
            
            <p class="text-sm text-gray-500">
              {attendee.date} at {attendee.time}
            </p>
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<!-- Mobile View with Scrollable -->
<div class="md:hidden h-[calc(100vh-180px)] overflow-y-auto px-4">
  <div class="space-y-4">
    {#each filteredAttendees as attendee}
      <div class="flex items-center justify-between py-3 border-b border-gray-100">
        <div class="flex flex-col">
          <span class="text-sm font-medium text-gray-800">{attendee.name}</span>
          <span class="text-xs text-gray-500">{attendee.date} at {attendee.time}</span>
        </div>
        
        {#if $selectedFilter !== 'ALL'}
          <span 
            class={`px-3 py-1 rounded-full text-xs font-medium
              ${attendee.status === 'IN' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'}`}
          >
            {attendee.status}
          </span>
        {/if}
      </div>
    {/each}

    {#if filteredAttendees.length === 0}
      <div class="flex flex-col items-center justify-center py-8 text-gray-500">
        <span class="text-sm">No attendees found</span>
      </div>
    {/if}
  </div>
</div>

<style>
  /* Mobile-only scrollbar styles */
  @media (max-width: 768px) {
    :global(.overflow-y-auto) {
      scrollbar-width: thin;
      scrollbar-color: #CBD5E0 #EDF2F7;
    }

    :global(.overflow-y-auto::-webkit-scrollbar) {
      width: 4px;
    }

    :global(.overflow-y-auto::-webkit-scrollbar-track) {
      background: #EDF2F7;
    }

    :global(.overflow-y-auto::-webkit-scrollbar-thumb) {
      background-color: #CBD5E0;
      border-radius: 2px;
    }
  }
</style>

