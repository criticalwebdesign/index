
<script>
// @ts-nocheck

import { writable } from 'svelte/store';

export const user = writable({
  username: 'jdoe',
  name: 'John Doe',
  email: 'jdoe@email.com'
});
</script>


<p>{$user.username}</p>