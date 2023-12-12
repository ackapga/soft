 import { data5 } from '../../js/modules/dataProducts.js';
// import { data5 } from './array-other.js';
// Функция фильтрации
function filterByKeyValue(array, key, value) {
    return array.filter(item => item[key] === value);
  }
  
  // Вызываем функцию фильтрации
  let filteredArray = filterByKeyValue(data5, 'category', 'askar');
  
  // Вывод отфильтрованного массива
 console.log('array 2')
  console.log('11', filteredArray);