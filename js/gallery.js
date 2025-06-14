const images = [
    {
        preview:
            'https://cdn.pixabay.com/photo/2019/05/14/16/43/rchids-4202820__480.jpg',
        original:
            'https://cdn.pixabay.com/photo/2019/05/14/16/43/rchids-4202820_1280.jpg',
        description: 'Hokkaido Flower',
    },
    {
        preview:
            'https://cdn.pixabay.com/photo/2019/05/14/22/05/container-4203677__340.jpg',
        original:
            'https://cdn.pixabay.com/photo/2019/05/14/22/05/container-4203677_1280.jpg',
        description: 'Container Haulage Freight',
    },
    {
        preview:
            'https://cdn.pixabay.com/photo/2019/05/16/09/47/beach-4206785__340.jpg',
        original:
            'https://cdn.pixabay.com/photo/2019/05/16/09/47/beach-4206785_1280.jpg',
        description: 'Aerial Beach View',
    },
    {
        preview:
            'https://cdn.pixabay.com/photo/2016/11/18/16/19/flowers-1835619__340.jpg',
        original:
            'https://cdn.pixabay.com/photo/2016/11/18/16/19/flowers-1835619_1280.jpg',
        description: 'Flower Blooms',
    },
    {
        preview:
            'https://cdn.pixabay.com/photo/2018/09/13/10/36/mountains-3674334__340.jpg',
        original:
            'https://cdn.pixabay.com/photo/2018/09/13/10/36/mountains-3674334_1280.jpg',
        description: 'Alpine Mountains',
    },
    {
        preview:
            'https://cdn.pixabay.com/photo/2019/05/16/23/04/landscape-4208571__340.jpg',
        original:
            'https://cdn.pixabay.com/photo/2019/05/16/23/04/landscape-4208571_1280.jpg',
        description: 'Mountain Lake Sailing',
    },
    {
        preview:
            'https://cdn.pixabay.com/photo/2019/05/17/09/27/the-alps-4209272__340.jpg',
        original:
            'https://cdn.pixabay.com/photo/2019/05/17/09/27/the-alps-4209272_1280.jpg',
        description: 'Alpine Spring Meadows',
    },
    {
        preview:
            'https://cdn.pixabay.com/photo/2019/05/16/21/10/landscape-4208255__340.jpg',
        original:
            'https://cdn.pixabay.com/photo/2019/05/16/21/10/landscape-4208255_1280.jpg',
        description: 'Nature Landscape',
    },
    {
        preview:
            'https://cdn.pixabay.com/photo/2019/05/17/04/35/lighthouse-4208843__340.jpg',
        original:
            'https://cdn.pixabay.com/photo/2019/05/17/04/35/lighthouse-4208843_1280.jpg',
        description: 'Lighthouse Coast Sea',
    },
];

let currentIndex = 0;
let modalInstance = null;

const galleryContainer = document.querySelector('.gallery');
galleryContainer.innerHTML = images
    .map(
        ({ preview, original, description }) => `
<li class="gallery-item">
  <a class="gallery-link" href="${original}">
    <img
      class="gallery-image"
      src="${preview}"
      data-source="${original}"
      alt="${description}"
    />
  </a>
</li>`
    )
    .join('');


function openModal(index) {
    currentIndex = index;
    const { original, description } = images[currentIndex];

    modalInstance = basicLightbox.create(
        `
          <div class="modal-wrapper">
            <button class="modal-close" title="Закрити">×</button>
            <div class="modal-count">${currentIndex + 1}/${images.length}</div>
            <button class="modal-nav modal-prev" title="Попереднє">‹</button>
            <img class="modal-image" src="${original}" alt="${description}" />
            <button class="modal-nav modal-next" title="Наступне">›</button>
            <div class="modal-caption">${description}</div>
          </div>
          `,
        {
            onShow: (inst) => {
                const el = inst.element();
                el.querySelector('.modal-close').onclick = () => inst.close();
                el.querySelector('.modal-prev').onclick = () => switchImage(-1);
                el.querySelector('.modal-next').onclick = () => switchImage(1);
                document.addEventListener('keydown', onKeyDown);
            },
            onClose: (inst) => {
                document.removeEventListener('keydown', onKeyDown);
            }
        }
    );

    modalInstance.show();
}

function onKeyDown(e) {
    if (e.code === 'ArrowLeft') switchImage(-1);
    if (e.code === 'ArrowRight') switchImage(1);
    if (e.code === 'Escape') modalInstance.close();
}

function switchImage(direction) {
    const el = modalInstance.element();
    const img = el.querySelector('.modal-image');

    img.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    img.style.transform = `translateX(${-direction * 50}px)`;
    img.style.opacity = '0';

    img.addEventListener('transitionend', function handler() {
        img.removeEventListener('transitionend', handler);

        currentIndex = (currentIndex + direction + images.length) % images.length;
        const { original, description } = images[currentIndex];

        img.src = original;
        img.alt = description;
        el.querySelector('.modal-caption').textContent = description;
        el.querySelector('.modal-count').textContent =
            `${currentIndex + 1}/${images.length}`;

        img.style.transition = 'none';
        img.style.transform = `translateX(${direction * 50}px)`;
        img.style.opacity = '0';

        void img.offsetWidth;

        img.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        img.style.transform = 'translateX(0)';
        img.style.opacity = '1';
    });
}

galleryContainer.addEventListener('click', (e) => {
    e.preventDefault();
    if (e.target.nodeName !== 'IMG') return;
    const index = images.findIndex(i => i.original === e.target.dataset.source);
    openModal(index);
});