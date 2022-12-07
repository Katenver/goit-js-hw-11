// const loadBtn = document.querySelector('.load-more');
 // loadBtn.classList.add('is-hidden');
 // loadBtn.addEventListener('click', onLoad);





// function onLoad() {
//   pageCounter += 1;
//   fetchImages(searchFormEl.elements.searchQuery.value.trim())
//     .then(
//       ({
//         data: { totalHits, hits, total },
//         config: {
//           params: { page },
//         },
//       }) => {
//         if (!total) {
//           throw new Error();
//         } else {
//           pageCounter += 1;
//           return hits;
//         }
//       }
//     )
//     .then(hits => {
//       console.dir(hits);
//       if (hits.length < 40) {
//         createMarkup(hits);
//         loadBtn.classList.add('is-hidden');
//         return Notify.info(
//           'We`re sorry, but you`ve reached the end of search results'
//         );
//       } else {
//         createMarkup(hits);
//         loadBtn.classList.remove('is-hidden');
//       }
//     })
//     .catch(error => {
//       Notify.failure(
//         'Sorry, there are no images matching your search query. Please try again.'
//       );
//     });
// }
