import { writable, derived } from 'svelte/store';
import type { Attendee, FilterType } from '../types/index';



const initialAttendees: Attendee[] = [
    { id: "1", name: "John Doe", date: "Feb 17, 2024", time: "1:23 PM", status: "IN" },
    { id: "2", name: "Jane Smith", date: "Feb 17, 2024", time: "1:24 PM", status: "IN" },
    { id: "1", name: "John Doe", date: "Feb 17, 2024", time: "1:23 PM", status: "IN" },
    { id: "1", name: "John Doe", date: "Feb 17, 2024", time: "1:23 PM", status: "IN" },
    { id: "1", name: "John Doe", date: "Feb 17, 2024", time: "1:23 PM", status: "IN" },
    { id: "1", name: "John Doe", date: "Feb 17, 2024", time: "1:23 PM", status: "IN" },
    { id: "1", name: "John Doe", date: "Feb 17, 2024", time: "1:23 PM", status: "IN" },
    { id: "1", name: "John Doe", date: "Feb 17, 2024", time: "1:23 PM", status: "IN" },
    { id: "1", name: "John Doe", date: "Feb 17, 2024", time: "1:23 PM", status: "OUT" },
    { id: "1", name: "John Doe", date: "Feb 17, 2024", time: "1:23 PM", status: "OUT" },
    { id: "2", name: "Jane Smith", date: "Feb 17, 2024", time: "1:24 PM", status: "IN" },
    { id: "3", name: "John Doe", date: "Feb 17, 2024", time: "1:23 PM", status: "IN" },
    { id: "4", name: "Alice Johnson", date: "Feb 17, 2024", time: "1:25 PM", status: "IN" },
    { id: "5", name: "Bob Wilson", date: "Feb 17, 2024", time: "1:26 PM", status: "IN" },
    { id: "6", name: "Carol Brown", date: "Feb 17, 2024", time: "1:27 PM", status: "IN" },
    { id: "7", name: "David Miller", date: "Feb 17, 2024", time: "1:28 PM", status: "IN" }
    
];


export const attendees = writable<Attendee[]>(initialAttendees);
export const currentPage = writable(1);
export const selectedFilter = writable<'ALL' | 'IN' | 'OUT'>('ALL');
export const searchQuery = writable('');
export const isCheckingIn = writable(true);  


export const itemsPerPage = derived(
    selectedFilter,
    $selectedFilter => $selectedFilter === 'ALL' ? 8 : 5
);

export const filteredAttendees = derived(
    [attendees, selectedFilter, searchQuery],
    ([$attendees, $filter, $search]) => {
        return $attendees.filter(attendee => {
            const matchesFilter = $filter === 'ALL' ? true : attendee.status === $filter;
            const matchesSearch = attendee.name.toLowerCase().includes($search.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }
);

// Calculate total pages based on filtered results
export const totalPages = derived(
    [filteredAttendees, itemsPerPage],
    ([$filtered, $perPage]) => Math.max(1, Math.ceil($filtered.length / $perPage))
);