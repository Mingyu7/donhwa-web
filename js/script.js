document.addEventListener('DOMContentLoaded', function() {

    // --- Dynamic Kakao Map Script Loading ---
    function initMap() {
        try {
            var mapContainer = document.getElementById('map'), 
                mapOption = { 
                    center: new kakao.maps.LatLng(37.498086, 127.028001), // 지도의 중심좌표 (강남역 부근)
                    level: 3 
                };

            var map = new kakao.maps.Map(mapContainer, mapOption); 

            var markerPosition  = new kakao.maps.LatLng(37.498086, 127.028001); 

            var marker = new kakao.maps.Marker({
                position: markerPosition
            });

            marker.setMap(map);

        } catch (e) {
            console.error("Kakao Map을 초기화하는 데 실패했습니다.", e);
            displayMapError();
        }
    }

    function displayMapError() {
        var mapContainer = document.getElementById('map');
        if(mapContainer) {
            mapContainer.innerHTML = "<p style='text-align:center; padding: 2rem;'>지도를 불러오는 데 실패했습니다. API 키 설정을 확인하거나 관리자에게 문의하세요.</p>";
        }
    }

    function loadMapScript() {
        if (window.KAKAO_MAP_API_KEY) {
            const script = document.createElement('script');
            script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${window.KAKAO_MAP_API_KEY}&libraries=services&autoload=false`;
            script.onload = () => {
                kakao.maps.load(initMap);
            };
            script.onerror = () => {
                console.error("Kakao Map 스크립트를 로드하는 데 실패했습니다. 네트워크 연결 또는 API 키를 확인해주세요.");
                displayMapError();
            };
            document.head.appendChild(script);
        } else {
            console.error("Kakao Map API 키가 'js/config.js' 파일에 설정되지 않았습니다.");
            displayMapError();
        }
    }

    loadMapScript();

    // --- Smooth Scrolling for Nav Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Scroll-based Header Style Change ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.8)';
            header.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        }
    });

});