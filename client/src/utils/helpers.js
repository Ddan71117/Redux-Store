/* eslint-disable no-case-declarations */
export function pluralize(name, count) {
  if (count === 1) {
    return name;
  }
  return name + 's';
}

export function idbPromise(storeName, method, object) {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('shop-shop', 1);
    let db, tx, store;
    request.onupgradeneeded = function() {
      const db = request.result;
      db.createObjectStore('products', { keyPath: '_id' });
      db.createObjectStore('categories', { keyPath: '_id' });
      db.createObjectStore('cart', { keyPath: '_id' });
    };

    request.onerror = function() {
      console.log('There was an error');
      reject('Error');
    };

    request.onsuccess = function() {
      db = request.result;
      tx = db.transaction(storeName, 'readwrite');
      store = tx.objectStore(storeName);

      db.onerror = function(e) {
        console.log('error', e);
        reject('Error');
      };

      switch (method) {
        case 'put':
          if (object) {
            store.put(object);
            resolve(object);
          } else {
            reject('Object is null or undefined');
          }
          break;
        case 'get':
          const all = store.getAll();
          all.onsuccess = function() {
            resolve(all.result);
          };
          all.onerror = function() {
            reject('Error');
          };
          break;
        case 'delete':
          if (object && object._id) {
            store.delete(object._id);
            resolve();
          } else {
            reject('Object is null or undefined');
          }
          break;
        default:
          console.log('No valid method');
          reject('No valid method');
          break;
      }

      tx.oncomplete = function() {
        db.close();
      };
    };
  });
}
