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

export const mediaVisible = writable(false);
export const descriptionsVisible = writable(false);

// store the project to show
export const projectToShow = writable({});
// store the tag to show
export const tag = writable('all');
// about page visible
export const about = writable(false);
// current field to sort by
export const sortField = writable('title');
// current order (1 or -1)
export const sortOrder = writable(1);
export const notesStore = writable(json.notes);
// derived stores
export const p2 = writable(json.projects);
export const p2Sorted = derived(p2, ($p2) => $p2.sort(dynamicSort('title', get(sortOrder))));

let projectsByKey = {};
json.projects.forEach((item, i) => {
	projectsByKey[item.slug] = item;
});
export const pByKey = writable(projectsByKey);
// console.log(projectsByKey)

// custom store
function createProjectsStore() {
	const { subscribe, set, update } = writable(projects);
	return {
		subscribe,
		set,
		update,
		updateFilters: (_tag, _sortField = 'title', _sortOrder = 1) => {
			// set params
			tag.set(_tag);
			sortField.set(_sortField);
			sortOrder.set(_sortOrder);
			// filter by tag
			projects = filterProjects(_tag);
			p2.set(filterProjects(_tag));
			// sort
			projects = projects.sort(dynamicSort(_sortField));
			// console.log(
			// 	'✅ t:',
			// 	get(tag),
			// 	'sortField:',
			// 	get(sortField),
			// 	'sortOrder:',
			// 	get(sortOrder),
			// 	'length',
			// 	projects.length
			// );
			return projects;
		}
		// filter: filterProjects
	};
}
// export let p = writable(json.projects);
export const projectStore = createProjectsStore();
function dynamicSort(sortField, sortOrder = 1) {
	// console.log('sortField:', sortField);
	return function (a, b) {
		// var result = a[sortField] < b[sortField] ? -1 : a[sortField] > b[sortField] ? 1 : 0;
		var result = a[sortField].toLowerCase().localeCompare(b[sortField].toLowerCase());
		// var result =  a[sortField].localeCompare(b[sortField])
		return result * sortOrder;
	};
}
function filterProjects(tag = '') {
	// console.log('filterProjects()', tag);
	return json.projects.filter((item) => {
		return item.tags.includes(tag);
	});
}

/////////////////////////////////////////////////
///////////// HASH-BASED ROUTING ////////////////
/////////////////////////////////////////////////

import { pushState } from '$app/navigation';
function createHashStore() {
	const { subscribe, set, update } = writable('#all');
	return {
		set,
		update,
		subscribe,
		// Store and update the hash in the URL
		updateHash(_hash = '#all') {
			_hash = _hash.replace('##', '#');
			console.log('hashStore.updateHash()', _hash);
			if (window.location.hash != _hash) {
				pushState(_hash, { hash: _hash });
				hashStore.set(_hash);
			} else {
				pushState(``, {});
				hashStore.set('');
			}
			return _hash;
		}
	};
}
export const hashStore = createHashStore();

////////////////////////////////////////////////////
///////////////////// EXAMPLES /////////////////////
////////////////////////////////////////////////////

// unused
// function createNotesStore() {
// 	const { subscribe, set, update } = writable(json.notes);
// 	return {
// 		subscribe
// 	};
// }
// export const notesStore = createNotesStore();

// // https://svelte.dev/tutorial/custom-stores
// function createCount() {
// 	const { subscribe, set, update } = writable(0);
// 	return {
// 		subscribe,
// 		increment: () => update((n) => n + 1),
// 		decrement: () => update((n) => n - 1),
// 		reset: () => set(0)
// 	};
// }
// export const count = createCount();
