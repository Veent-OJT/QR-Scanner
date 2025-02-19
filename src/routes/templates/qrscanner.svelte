<script lang="ts">
  import { goto } from '$app/navigation'; 
  import { Html5QrcodeScanner } from "html5-qrcode";
  import { onMount, onDestroy } from "svelte";
  import { format } from 'date-fns';
  import '@fontsource/poppins';

  function goToAttendees() {
    goto('../attendees');  // Using relative path
  }


  interface Attendee {
        id: string;
        name: string;
        time: string;
        date: string;
        status: "IN" | "OUT" ;
    }

  let currentPage = 10;
  let itemsPerPage = 5;
  let searchQuery = "";


  let isCheckingIn = true; 
  let scanner: Html5QrcodeScanner;
  let lastResult = "";
  let scanCount = 356;
  let isScanning = false;
  let selectedFilter = "ALL";
  let attendees = [
    { id: "1", name: "John Doe", date: "Feb 17, 2024", time: "1:23 PM", status: "IN" },
    { id: "2", name: "Jane Smith", date: "Feb 17, 2024", time: "1:24 PM", status: "IN" },
    { id: "1", name: "John Doe", date: "Feb 17, 2024", time: "1:23 PM", status: "IN" },

  ];

  onMount(() => {
        scanner = new Html5QrcodeScanner(
            "reader",
            { 
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            },
            false
        );

        startScanning();
    });

    onDestroy(() => {
        stopScanning();
    });

    async function startScanning() {
        if (!isScanning) {
            isScanning = true;
            try {
                await scanner.render(onScanSuccess, onScanFailure);
            } catch (err) {
                console.error("Failed to start scanner:", err);
            }
        }
    }

    async function stopScanning() {
        if (isScanning && scanner) {
            isScanning = false;
            try {
                await scanner.clear();
            } catch (err) {
                console.error("Failed to stop scanner:", err);
            }
        }
    }

    function onScanSuccess(decodedText: string) {
        try {
            if (lastResult === decodedText) {
                return;
            }

            const qrData = JSON.parse(decodedText);
            const existingIndex = attendees.findIndex(a => a.name === qrData.name);
            const currentDate = format(new Date(), "MMM dd, yyyy");
            const currentTime = format(new Date(), "h:mm a");
      
      if (existingIndex !== -1) {
        const updatedAttendees = [...attendees];
        updatedAttendees[existingIndex] = {
          ...updatedAttendees[existingIndex],
          date: currentDate,
          time: currentTime,
          status: isCheckingIn ? "IN" : "OUT"
        };
        attendees = updatedAttendees;
      } else {
        const newAttendee: Attendee = {
          id: qrData.id,
          name: qrData.name || "Unknown",
          date: currentDate,
          time: currentTime,
          status: isCheckingIn ? "IN" : "OUT"
        };
        attendees = [newAttendee, ...attendees];
      }
            lastResult = decodedText;
            playSuccessSound();
            
            setTimeout(() => {
                lastResult = "";
            }, 2000);

        } catch (error) {
            console.error("Error processing QR code:", error);
            playErrorSound();
        }
    }

    function onScanFailure(error: string) {
        if (error !== "No QR code found") {
            console.warn(`Code scan error = ${error}`);
        }
    }

    function toggleMode() {
        isCheckingIn = !isCheckingIn;
    }

    function playSuccessSound() {
        const audio = new Audio('/success.mp3');
        audio.play().catch(() => {});
    }

    function playErrorSound() {
        const audio = new Audio('/error.mp3');
        audio.play().catch(() => {});
    }

     $: filteredAttendees = attendees.filter(attendee => {
    const matchesFilter = selectedFilter === 'ALL' ? true : attendee.status === selectedFilter;
    const matchesSearch = attendee.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  $: paginatedAttendees = filteredAttendees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  $: totalPages = Math.ceil(filteredAttendees.length / itemsPerPage);

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
    }
  }

  function nextPage() {
    if (currentPage < totalPages) {
      currentPage++;
    }
  }

  function previousPage() {
    if (currentPage > 1) {
      currentPage--;
    }
  }

  $: {
    if (searchQuery || selectedFilter) {
      currentPage = 1;
    }
  }


    
</script>

<div class="max-w-7xl mx-auto p-4 md:p-6 lg:p-4">
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
    <!-- Left Column -->
    <div>
      <!-- QR Scanner Section -->
      <div class="bg-white rounded-lg shadow-lg p-4 md:p-6">
        <div class="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-6 space-y-4 md:space-y-0">
          <h2 class="text-lg md:text-xl font-semibold text-gray-800">QR Scanner</h2>
          <!-- Toggle Switch -->
          <div class="flex items-center bg-gray-200 rounded-full p-1 w-32 md:w-32">
            <button
              class="flex-1 py-1 px-3 rounded-full text-sm font-medium transition-all duration-200 text-center"
              class:bg-green-500={isCheckingIn}
              class:text-white={isCheckingIn}
              class:text-gray-600={!isCheckingIn}
              on:click={() => (isCheckingIn = true)}
            >
              IN
            </button>
            <button
              class="flex-1 py-1 px-3 rounded-full text-sm font-medium transition-all duration-200 text-center"
              class:bg-red-500={!isCheckingIn}
              class:text-white={!isCheckingIn}
              class:text-gray-600={isCheckingIn}
              on:click={() => (isCheckingIn = false)}
            >
              OUT
            </button>
          </div>
        </div>
        <!-- QR Scanner -->
        <div id="reader" class="mt-4 w-full max-w-[300px] mx-auto"></div>
      </div>

      <!-- Status Cards -->
      <div class="grid grid-cols-1 gap-4 mt-4">
        <!-- Total Registered Card -->
        <div class="bg-white rounded-lg shadow-lg p-4 md:p-6">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-black text-sm font-medium">Total Registered</h3>
              <div class="flex items-baseline mt-1">
                <span class="text-5xl md:text-5xl font-bold text-gray-800">{attendees.length}</span>
                <span class="ml-2 text-xs md:text-sm text-gray-600">Attendees</span>
              </div>
            </div>
            <button 
            class="block md:hidden text-gray-600 text-sm"
           
          >
            View all attendees
          </button>          </div>
        </div>
      
        <!-- Event Status Card -->
        <div class="bg-white rounded-lg shadow-lg p-4 md:p-6">
          <div class="flex justify-between items-center">
            <h3 class="text-gray-600 text-sm font-medium">Event Status</h3>
            <span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Live</span>
          </div>
          <button 
            class="mt-3 w-full flex items-center justify-center text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md p-2"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            Manage Event
          </button>
        </div>
      </div>
    </div>


    <div class="hidden md:block bg-white rounded-lg shadow-lg p-6">
      <div class="flex flex-col space-y-4">

       
          <div class="bg-gray-50 rounded-md px-4 py-2 flex items-center space-x-2">
            <svg
              class="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              bind:value={searchQuery}
              placeholder="Search guest"
              class="bg-transparent w-full outline-none text-sm text-gray-600 placeholder-gray-400"
            />
          </div>

        <!-- Filter Tabs -->
        <div class="flex border-b border-gray-200 ">
          <button 
            class="px-4 py-2 text-sm font-medium relative {selectedFilter === 'ALL' ? 'text-red-500' : 'text-gray-600'}"
            on:click={() => selectedFilter = 'ALL'}
          >
            ALL Guests
            {#if selectedFilter === 'ALL'}
              <div class="absolute bottom-0 left-0 w-full h-0.5 bg-red-500"></div>
            {/if}
          </button>
          <button 
            class="px-4 py-2 text-sm font-medium relative {selectedFilter === 'IN' ? 'text-red-500' : 'text-gray-600'}"
            on:click={() => selectedFilter = 'IN'}
          >
            IN
            {#if selectedFilter === 'IN'}
              <div class="absolute bottom-0 left-0 w-full h-0.5 bg-red-500"></div>
            {/if}
          </button>
          <button 
            class="px-4 py-2 text-sm font-medium relative {selectedFilter === 'OUT' ? 'text-red-500' : 'text-gray-600'}"
            on:click={() => selectedFilter = 'OUT'}
          >
            OUT
            {#if selectedFilter === 'OUT'}
              <div class="absolute bottom-0 left-0 w-full h-0.5 bg-red-500"></div>
            {/if}
          </button>
        </div>

        <!-- Attendee List -->
        <div class="space-y-3 mt-2">
          {#each paginatedAttendees as attendee}
            <div class="flex items-center justify-between py-3 border-b border-gray-200">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span class="text-gray-600 text-sm font-medium">
                    {attendee.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p class="font-medium text-gray-800">{attendee.name}</p>
                </div>
              </div>
              {#if selectedFilter !== 'ALL'}
                <div class="flex flex-col items-end">
                  <span 
                    class={`px-3 py-1 rounded-full text-sm font-medium mb-1
                      ${attendee.status === 'IN' ? 'bg-green-100 text-green-800' : 
                        attendee.status === 'OUT' ? 'bg-red-100 text-red-800' : 
                        'bg-gray-100 text-gray-800'}`}
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
    </div>
  </div>
</div>

   <!-- Pagination ml-[650px] -->
<div class="hidden md:flex items-center justify-center space-x-2 mt-4 ml-[650px]">
<!-- Previous button -->
  <button 
    class="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
    on:click={previousPage}
    disabled={currentPage === 1}
  >
    <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
  </button>
  
  <!-- First page -->
  <button 
    class="px-3 py-1 rounded-md {currentPage === 1 ? 'bg-red-500 text-white' : 'hover:bg-gray-100 text-gray-600'}"
    on:click={() => goToPage(1)}
  >
    1
  </button>

  <!-- Ellipsis if needed -->
  {#if currentPage > 3}
    <span class="text-gray-600">...</span>
  {/if}

  <!-- Pages around current page -->
  {#each Array(3) as _, i}
    {#if currentPage - 1 + i > 1 && currentPage - 1 + i < totalPages}
      <button 
        class="px-3 py-1 rounded-md {currentPage === currentPage - 1 + i ? 'bg-red-500 text-white' : 'hover:bg-gray-100 text-gray-600'}"
        on:click={() => goToPage(currentPage - 1 + i)}
      >
        {currentPage - 1 + i}
      </button>
    {/if}
  {/each}

  <!-- Ellipsis if needed -->
  {#if currentPage < totalPages - 2}
    <span class="text-gray-600">...</span>
  {/if}

  <!-- Last page -->
  {#if totalPages > 1}
    <button 
      class="px-3 py-1 rounded-md {currentPage === totalPages ? 'bg-red-500 text-white' : 'hover:bg-gray-100 text-gray-600'}"
      on:click={() => goToPage(totalPages)}
    >
      {totalPages}
    </button>
  {/if}

  <!-- Next button -->
  <button 
    class="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
    on:click={nextPage}
    disabled={currentPage === totalPages}
  >
    <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
    </svg>
  </button>
</div>

<style>
  :global(#reader) {
    border: none !important;
    box-shadow: none !important;
    width: 100% !important;
    max-width: 300px !important;
    margin: 0 auto !important;
  }

  :global(#reader video) {
    width: 100% !important;
    height: auto !important;
  }

  @media (max-width: 768px) {
    :global(#reader) {
      max-width: 100% !important;
    }
  }

  :global(#reader button) {
    border-radius: 0.375rem !important;
    padding: 0.5rem 1rem !important;
    background-color: #3B82F6 !important;
    color: white !important;
    font-size: 0.875rem !important;
    line-height: 1.25rem !important;
  }

  :global(#reader select) {
    border-radius: 0.375rem !important;
    padding: 0.5rem !important;
    border-color: #D1D5DB !important;
  }

  :global(#reader span), 
  :global(#reader div > div) {
    color: #4B5563 !important; 
  }

  :global(body) {
    font-family: 'Poppins';
  }
</style>