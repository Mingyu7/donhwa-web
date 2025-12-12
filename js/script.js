document.addEventListener('DOMContentLoaded', function() {

    const header = document.getElementById('header');
    
    // --- 1. Scroll-based Header Style Change ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- 2. Active Navigation Link Styling ---
    const navLinks = document.querySelectorAll('#header nav ul li a');
    const currentPage = window.location.pathname.split('/').pop();

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });

    // --- 3. Dynamic Kakao Map Loading (only on location.html) ---
    if (document.getElementById('map')) {
        loadMapScript();
    }
    
    function initMap() {
        try {
            const mapContainer = document.getElementById('map');
            const mapOption = { 
                center: new kakao.maps.LatLng(37.498086, 127.028001),
                level: 3 
            };
            const map = new kakao.maps.Map(mapContainer, mapOption);
            const markerPosition  = new kakao.maps.LatLng(37.498086, 127.028001); 
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

    // --- 4. Scroll-in Animations ---
    const animatedSections = document.querySelectorAll('.content-section, .gallery-item-large, .value-item');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });

    animatedSections.forEach(section => {
        section.classList.add('fade-in-section');
        observer.observe(section);
    });

});
