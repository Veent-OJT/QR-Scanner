<script lang="ts">
    import '@fontsource/poppins';
    import { goto } from '$app/navigation';
    import SearchBar from '$lib/components/Attendees/SearchBar.svelte';
    import FilterTabs from '$lib/components/Attendees/FilterTabs.svelte';
    import AttendeeList from '$lib/components/Attendees/AttendeeList.svelte';
    import ScanButton from '$lib/components/QRScanner/ScanButton.svelte';
    import Header from '$lib/components/QRScanner/Header.svelte';



    function gotoScan() {
      goto('/templates/qrscanner');
  }


  </script>
  
  <div class="flex items-center justify-between py-2 ">
    <div class=" ">
      <Header />
    </div>
    
    <div class="flex justify-end mb-4">
      <ScanButton onClick={gotoScan} /> 
    </div>
  </div>

  <div class="max-w-md mx-auto p-4">
    <SearchBar />
    <FilterTabs />
    <AttendeeList />
    
  </div>  
  

  
  <style>
    :global(body) {
      font-family: 'Poppins', sans-serif;
    }
  </style>