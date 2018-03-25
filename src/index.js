import {flattenDeep, chunk} from 'lodash';

// import flattenDeep from 'lodash/flattenDepp'
// import chunk from 'lodash/chunk'

let arr = [1, [2, 3, [5]]];
console.log(flattenDeep(arr, 2));
console.log(chunk(['a', 'b', 'c'], 2));
