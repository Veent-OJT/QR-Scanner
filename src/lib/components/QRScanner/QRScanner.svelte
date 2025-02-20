<script lang="ts">
    import { Html5QrcodeScanner } from 'html5-qrcode';
    import { onMount, onDestroy } from 'svelte';
    import { format } from 'date-fns';
    import { attendees, isCheckingIn } from '../stores/attendees';
    import type { Attendee } from '../types/index';
    import ToggleButtons from '../toggle/ToggleButtons.svelte';
    import Header from '../QRScanner/Header.svelte';
  
    let scanner: Html5QrcodeScanner;
    let lastResult = "";
    let isScanning = false;
  
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
        if (lastResult === decodedText) return;
  
        const qrData = JSON.parse(decodedText);
        const currentDate = format(new Date(), "MMM dd, yyyy");
        const currentTime = format(new Date(), "h:mm a");
  
        attendees.update(currentAttendees => {
          const existingIndex = currentAttendees.findIndex(a => a.name === qrData.name);
          
          if (existingIndex !== -1) {
            const updatedAttendees = [...currentAttendees];
            updatedAttendees[existingIndex] = {
              ...updatedAttendees[existingIndex],
              date: currentDate,
              time: currentTime,
              status: $isCheckingIn ? "IN" : "OUT"
            };
            return updatedAttendees;
          } else {
            const newAttendee: Attendee = {
              id: qrData.id,
              name: qrData.name || "Unknown",
              date: currentDate,
              time: currentTime,
              status: $isCheckingIn ? "IN" : "OUT"
            };
            return [newAttendee, ...currentAttendees];
          }
        });
  
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
  
    function playSuccessSound() {
      const audio = new Audio('/success.mp3');
      audio.play().catch(() => {});
    }
  
    function playErrorSound() {
      const audio = new Audio('/error.mp3');
      audio.play().catch(() => {});
    }
  </script>

    <div class="md:hidden">
      <Header />
    </div>
  
  <div class="bg-white rounded-lg p-4 md:p-6 border border-black-900">
    <div class="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-6 space-y-4 md:space-y-0">
      <h2 class="hidden md:block text-lg md:text-xl font-semibold text-gray-800">FunRun</h2>
      <!-- w-32 -->
      <div class="flex items-center bg-gray-200 rounded-full p-1 hidden md:block">
        <ToggleButtons />
      </div>
    </div>
    <div id="reader" class="mt-4 w-full max-w-[300px] mx-auto"></div>
  </div>
  
  <style>
    :global(#reader) {
      border: none !important;
      box-shadow: none !important;
      width: 100% !important;
      max-width: 300px !important;
      margin: 0 auto !important;
    }
  
    /* Hide file selection button and related elements */
    :global(#reader__file_selection) {
      display: none !important;
    }
    
    :global(#reader__filescan_input) {
      display: none !important;
    }
    
    :global(#reader__filescan) {
      display: none !important;
    }
    
    :global(#reader__dashboard_section_swaplink) {
      display: none !important;
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
  </style>