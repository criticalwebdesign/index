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

import { cleanHash } from '$lib/functions';

import { writable, get, derived } from 'svelte/store';
import json from '$lib/stores/data.json';
let projects = json.projects;
// console.log(projects);

// writable stores

export const mediaVisible = writable(false);
export const descriptionsVisible = writable(false);

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
export const p2Sorted = derived(p2, ($p2) => $p2.sort(sortProjects('title', get(sortOrder))));

let projectsByKey = {};
json.projects.forEach((item, i) => {
    projectsByKey[item.slug] = item;
});
export const pByKey = writable(projectsByKey);
// console.log(projectsByKey);


// custom store for the project list
function createProjectList() {
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
            projects = projects.sort(sortProjects(_sortField));
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
export const projectList = createProjectList();
// sorting function for projects
function sortProjects(sortField, sortOrder = 1) {
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




function createTagControl() {
    const { subscribe, set, update } = writable('#all');
    return {
        set,
        update,
        subscribe,
        clickTag(_hash = '') {
            _hash = cleanHash(_hash);
            console.log('tagControl.clickTag()', _hash);

            currentProject.remove();
            hashStore.pushHash(_hash);
        },
        removeTag() {
            set('')
        }
    };
}
export const tagControl = createTagControl();


export const createCurrentProject = () => {
    const { subscribe, set, update } = writable({});
    return {
        set,
        update,
        subscribe,
        click(_hash = '') { // user clicks project
            _hash = cleanHash(_hash);
            // console.log(`currentProject.click(${_hash}) $hashStore=${get(hashStore)}`);

            if (_hash !== get(hashStore)) {
                // set current
                this.setCurrent(_hash);
                // push hash to url 
                hashStore.pushHash(_hash);
            } else {
                this.remove();
            }
        },
        setCurrent: (_hash) => {
            if (projectsByKey[_hash])
                currentProject.set(projectsByKey[_hash]);
        },
        remove() {
            this.set({});
            hashStore.removeHash();
        }
    };
}
// custom store + object containing the current project displayed on the page
export const currentProject = createCurrentProject();




// since about isn't technically a project
function createPageControl() {
    return {
        clickHome() {
            hashStore.saveHash('');
            currentProject.remove();
            projectList.updateFilters('all');
        },
        clickAbout() {
            if (!get(about)) {
                pageControl.set('#about');
                about.set(true);
            } else {
                pageControl.set('');
                about.set(false);
            }
            console.log("about =",about)
        },
        set(_hash = '') {
            _hash = cleanHash(_hash);
            console.log('pageControl.set()', _hash);

            currentProject.remove();
            hashStore.pushHash(_hash);
        },
        removePage() {
            pageControl.set('');
        }
    };
}
export const pageControl = createPageControl();







function createHashStore() {
    const { subscribe, set, update } = writable('#all');
    return {
        set,
        update,
        subscribe,



        saveHash(_hash = '') {
            _hash = cleanHash(_hash);
            // console.log('hashStore.saveHash()', _hash);
            hashStore.set(_hash);
            return _hash;
        },
        pushHash(_hash = '') {
            _hash = cleanHash(_hash);
            console.log('hashStore.pushHash() [1] _hash =', _hash, ", window.location.hash =", window.location.hash);

            if (_hash && cleanHash(window.location.hash) != _hash) {
                // https://github.com/sveltejs/kit/issues/11956#issuecomment-2083469945
                // push hash to url bar
                pushState("#" + _hash, { hash: _hash }, { hydrate: true });
                hashStore.set(_hash);
            } else {
                pushState(``, {}, { hydrate: true });
                hashStore.set('');
            }


            console.log("hashStore.pushHash() [2] window.location.hash =", window.location.hash);

            return _hash;
        },
        removeHash() {
            pushState(``, {}, { hydrate: true });
            hashStore.set('');
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
