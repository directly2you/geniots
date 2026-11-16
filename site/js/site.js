/* Small lightbox for the gallery pages (replaces jQuery + jquery.lightbox). */
'use strict';
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.gallery a'));
  if (!links.length) return;

  var box = document.createElement('div');
  box.id = 'lightbox';
  box.innerHTML = '<button class="close" aria-label="Close">×</button>' +
    '<button class="prev" aria-label="Previous">‹</button>' +
    '<img alt="">' +
    '<button class="next" aria-label="Next">›</button>';
  document.body.appendChild(box);
  var image = box.querySelector('img'), index = 0;

  function show(i) {
    index = (i + links.length) % links.length;
    image.src = links[index].getAttribute('href');
    image.alt = links[index].querySelector('img').alt;
    box.classList.add('open');
  }
  function close() { box.classList.remove('open'); image.removeAttribute('src'); }

  links.forEach(function (a, i) {
    a.addEventListener('click', function (e) { e.preventDefault(); show(i); });
  });
  box.addEventListener('click', function (e) {
    if (e.target.classList.contains('prev')) show(index - 1);
    else if (e.target.classList.contains('next')) show(index + 1);
    else if (e.target !== image) close();
  });
  document.addEventListener('keydown', function (e) {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(index - 1);
    else if (e.key === 'ArrowRight') show(index + 1);
  });
})();
