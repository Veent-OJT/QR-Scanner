<script lang="ts">
  import '@fontsource/poppins';
  import QRScanner from '$lib/components/QRScanner/QRScanner.svelte';
  import StatusCards from '$lib/components/QRScanner/StatusCards.svelte';
  import AttendeeList from '$lib/components/Attendees/AttendeeList.svelte';
  import SearchBar from '$lib/components/Attendees/SearchBar.svelte';
  import FilterTabs from '$lib/components/Attendees/FilterTabs.svelte';
  import Pagination from '$lib/components/Pagination/Pagination.svelte';
  import { attendees, currentPage, itemsPerPage } from '$lib/components/stores/attendees';
  import ToggleButtons from '$lib/components/toggle/ToggleButtons.svelte';

  
  $: totalPages = Math.ceil($attendees.length / $itemsPerPage);

  function handlePageChange(page: number) {
    currentPage.set(page);
  }
</script>

<div class="max-w-7xl mx-auto p-4 md:p-6 lg:p-8  h-auto">
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 ">
    <div class="">
      <QRScanner />
      <div class="flex items-center bg-gray-200 rounded-full  p-1 md:hidden mr-[256px] mt-[15px] ">
        <ToggleButtons />
      </div>
      <StatusCards />
    </div>

    <div class="hidden md:block">
      <div class="bg-white rounded-lg border border-black-900 p-6 h-[555px] ">
        <SearchBar />
        <FilterTabs />
        <AttendeeList />
      </div>
      
      <div class="flex justify-center items-end  ">
        <Pagination 
          currentPage={$currentPage}
          {totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  </div>
</div>

<style>
  :global(body) {
    font-family: 'Poppins', sans-serif;
  }
</style>