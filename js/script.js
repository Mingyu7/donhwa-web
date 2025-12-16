document.addEventListener('DOMContentLoaded', function() {

    const header = document.getElementById('header');
    
    // --- 1. Scroll-based Header Style Change ---
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- 2. Active Navigation Link Styling ---
    const navLinks = document.querySelectorAll('#header nav ul li a');
    const currentPage = window.location.pathname.split('/').pop();

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });

    // --- 3. Mobile Navigation ---
    const navToggle = document.querySelector('.nav-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    if (navToggle && navLinksContainer) {
        navToggle.addEventListener('click', () => {
            document.body.classList.toggle('nav-open');
            navLinksContainer.classList.toggle('nav-open');
        });
    }

    // --- 4. Dynamic Kakao Map Loading (only on location.html) ---
    if (document.getElementById('map')) {
        loadMapScript();
    }
    /* map 위치 표시 (위,경도)*/
    function initMap() {
        try {
            const mapContainer = document.getElementById('map');
            const mapOption = { 
                center: new kakao.maps.LatLng(36.7568659565163, 127.017555435462),
                level: 3 
            };
            const map = new kakao.maps.Map(mapContainer, mapOption);
            const markerPosition  = new kakao.maps.LatLng(36.7568659565163, 127.017555435462);
            const marker = new kakao.maps.Marker({ position: markerPosition });
            marker.setMap(map);
        } catch (e) {
            console.error("Kakao Map 초기화 실패:", e);
            displayMapError();
        }
    }

    function displayMapError() {
        const mapContainer = document.getElementById('map');
        if(mapContainer) {
            mapContainer.innerHTML = "<p style='text-align:center; padding: 2rem;'>지도를 불러오는 데 실패했습니다. API 키 설정을 확인해주세요.</p>";
        }
    }

    function loadMapScript() {
        if (window.KAKAO_MAP_API_KEY) {
            const script = document.createElement('script');
            script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${window.KAKAO_MAP_API_KEY}&libraries=services&autoload=false`;
            script.onload = () => kakao.maps.load(initMap);
            script.onerror = () => {
                console.error("Kakao Map 스크립트 로드 실패.");
                displayMapError();
            };
            document.head.appendChild(script);
        } else {
            console.error("Kakao Map API 키가 js/config.js에 설정되지 않았습니다.");
            displayMapError();
        }
    }

    // --- 5. Portfolio Pagination ---
    const galleryGrid = document.querySelector('.gallery-grid');
    if (galleryGrid) {
        const paginationContainer = document.querySelector('.pagination');
        const items = Array.from(galleryGrid.children);
        const itemsPerPage = 6;
        const totalPages = Math.ceil(items.length / itemsPerPage);
        let currentPage = 1;

        function showPage(page) {
            currentPage = page;
            items.forEach((item, index) => {
                item.classList.remove('active');
                const startIndex = (page - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                if (index >= startIndex && index < endIndex) {
                    item.classList.add('active');
                }
            });
            updatePaginationButtons();
        }

        function setupPagination() {
            if (!paginationContainer) return;
            paginationContainer.innerHTML = '';
            
            // Prev button
            const prevButton = document.createElement('button');
            prevButton.innerHTML = '&laquo;';
            prevButton.classList.add('page-link');
            prevButton.addEventListener('click', () => {
                if (currentPage > 1) {
                    showPage(currentPage - 1);
                }
            });
            paginationContainer.appendChild(prevButton);

            // Page number buttons
            for (let i = 1; i <= totalPages; i++) {
                const button = document.createElement('button');
                button.innerText = i;
                button.classList.add('page-link');
                button.addEventListener('click', () => showPage(i));
                paginationContainer.appendChild(button);
            }
            
            // Next button
            const nextButton = document.createElement('button');
            nextButton.innerHTML = '&raquo;';
            nextButton.classList.add('page-link');
            nextButton.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    showPage(currentPage + 1);
                }
            });
            paginationContainer.appendChild(nextButton);

            showPage(1);
        }

        function updatePaginationButtons() {
            const pageLinks = paginationContainer.querySelectorAll('.page-link');
            pageLinks.forEach(link => {
                link.classList.remove('active', 'disabled');
                const pageNum = parseInt(link.innerText);
                if (pageNum === currentPage) {
                    link.classList.add('active');
                }
                if (link.innerHTML.includes('&laquo;') && currentPage === 1) {
                    link.classList.add('disabled');
                }
                if (link.innerHTML.includes('&raquo;') && currentPage === totalPages) {
                    link.classList.add('disabled');
                }
            });
        }
        
        setupPagination();
    }


    // --- 6. Scroll-in Animations ---
    const animatedElements = document.querySelectorAll('.fade-in-section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });

    animatedElements.forEach(el => {
        el.classList.add('fade-in-section');
        observer.observe(el);
    });

    // --- 7. Footer Loader ---
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        fetch('footer.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = data;
                const newFooter = tempDiv.firstElementChild; // Get the actual footer element

                if (newFooter) {
                    footerPlaceholder.replaceWith(newFooter); // Replace the placeholder with the actual footer
                    // Since the footer is loaded dynamically and replaced, re-run the animation observer for it
                    if (newFooter.classList.contains('fade-in-section')) {
                        observer.observe(newFooter);
                    }
                }
            })
            .catch(error => {
                console.error('Error loading footer:', error);
                if(footerPlaceholder) {
                    footerPlaceholder.innerHTML = '<p style="text-align: center; color: red;">푸터를 불러오지 못했습니다.</p>';
                }
            });
    }

});