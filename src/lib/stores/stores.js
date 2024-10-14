// @ts-nocheck

/**
 * Import JSON data and make it accessible everywhere
 * See
 * - https://dev.to/jdgamble555/the-unwritten-svelte-stores-guide-47la
 * - https://learn.svelte.dev/tutorial/writable-stores
 * - https://learn.svelte.dev/tutorial/custom-stores
 * - https://betterprogramming.pub/what-are-svelte-stores-and-how-to-use-them-a4963968ee89
 * - https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Svelte_stores
 */

import { writable, get, derived } from 'svelte/store';
import json from '$lib/stores/data.json';
let projects = json.projects;
// console.log(projects);







// writable stores
export const tag = writable('all');
export const sortField = writable('title');
export const sortOrder = writable(1);
export const notesStore = writable(json.notes);
export const urlStore = writable("");

// derived stores
export const p2 = writable(json.projects);
export const p2Sorted = derived(p2, ($p2) => $p2.sort(dynamicSort('title', get(sortOrder))));


// console.log(json.projects[0])
let current = json.projects[0];
function createCurrentProjectStore() {
	const { subscribe, set, update } = writable(current);
	return {
		subscribe,
		set,
		update
	};
}
export const currentProject = createCurrentProjectStore();



// custom store
function createProjectsStore() {
	const { subscribe, set, update } = writable(projects);
	return {
		subscribe,
		set,
		update,
		updateFilters: (_tag, _sortField, _sortOrder) => {
			// set params
			tag.set(_tag);
			sortField.set(_sortField);
			sortOrder.set(_sortOrder);
			// filter by tag
			projects = filterProjects(_tag);
			p2.set(filterProjects(_tag));
			// sort
			projects = projects.sort(dynamicSort(_sortField));
			console.log(
				'✅ t:',
				get(tag),
				'sortField:',
				get(sortField),
				'sortOrder:',
				get(sortOrder),
				'length',
				projects.length
			);
			return projects;
		}
		// filter: filterProjects
	};
}
// export let p = writable(json.projects);
export const projectStore = createProjectsStore();

function dynamicSort(sortField, sortOrder = 1) {
	return function (a, b) {
		// var result = a[sortField] < b[sortField] ? -1 : a[sortField] > b[sortField] ? 1 : 0;
		var result = a[sortField].toLowerCase().localeCompare(b[sortField].toLowerCase())
		// var result =  a[sortField].localeCompare(b[sortField])
		return result * sortOrder;
	};
}

function filterProjects(tag = '') {
	// console.log('filterProjects()', tag);
	return json.projects.filter((item) => {
		return item[tag] == 'x';
	});
}



////////////////////////////////////////////////////
///////////////////// EXAMPLES /////////////////////
////////////////////////////////////////////////////

// https://svelte.dev/tutorial/custom-stores
function createCount() {
	const { subscribe, set, update } = writable(0);
	return {
		subscribe,
		increment: () => update((n) => n + 1),
		decrement: () => update((n) => n - 1),
		reset: () => set(0)
	};
}
export const count = createCount();
