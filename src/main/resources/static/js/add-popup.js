window.addEventListener("load", function(){
    let openPopupButton = document.querySelector(".open-popup-button");
    let popupContainer = document.querySelector(".popup-container");
    let scrollPosition = 0; // 스크롤 위치를 저장할 변수를 초기화

    let categoryUl = document.querySelector(".category-section .category-filter");
    let labels = categoryUl.querySelectorAll("label");
    let saveButton = document.querySelector(".add-popup .button button");
    
    let selectedProductId;
    let selectedMealCategoryId;
 
    
    openPopupButton.onclick = () => {
        scrollPosition = window.scrollY;
		document.body.style.top = `-${scrollPosition}px`;
		document.body.style.overflow = 'hidden';
		document.body.style.padding = '0 17px 0 0';
        popupContainer.classList.remove("d:none");
    }

    window.addEventListener("click", (e) => {
        if (e.target === popupContainer) {
			document.body.style.top = 'auto';
			document.body.style.overflow = 'auto';
			document.body.style.padding = '';
            window.scrollTo(0, scrollPosition);
            popupContainer.classList.add("d:none");
            
            resetCategorySelection();
        }
    });
   
   
	let formSection = document.querySelector(".search-bar form");
	let queryInput = formSection.querySelector(".search-text");
	let searchButton = formSection.querySelector(".search-input");
	let productList = document.querySelector(".product-list");
	
	
	async function createCards() {
        let query = queryInput.value;
        let response = await fetch(`/api/products?q=${query}`);
        let list = await response.json();
        console.log(list);
        
        productList.innerHTML = "";
        
        for (let m of list) {
            let template = `
                <section class="card p:2 bg-color:base-0" data-id="${m.id}">
                    <h1 class="font-size:1 font-weight:bold">${m.name}</h1>
                    <div class="kcal-block">
                        <span class="font-size:0 font-weight:bold color:base-7">${m.kcal}</span>
                        <span class="font-size:0 font-weight:bold color:base-7">kcal</span>
                    </div>
                </section>
            `;
            productList.insertAdjacentHTML("beforeend", template);
        }
    }
    
    
    
    searchButton.onclick = async function(e) {
        e.preventDefault();
        
        // 기존 카드를 비동기로 생성
        await createCards();
        
        let cards = productList.querySelectorAll(".card");
        // 생성된 카드에 클릭 이벤트를 추가
        cards.forEach(card => {
            card.addEventListener("click", function () {
                // 클릭한 카드에 "clicked" 클래스 추가
                card.classList.add("clicked");
    
                // 나머지 카드에서 "clicked" 클래스 제거
                cards.forEach(otherCard => {
                    if (otherCard !== card) {
                        otherCard.classList.remove("clicked");
                    }
                });
                
                let productId = card.getAttribute("data-id");
	            console.log("productId: ", productId);
	            
	            selectedProductId = productId;
            });
        });
        
    }
    
    categoryUl.onclick = async function(e) {
		e.preventDefault();
		
		let el = e.target;
		
    	labels.forEach((label) => {
			label.classList.remove("checked");
    	});
    	if (el.tagName === "LABEL") {
    		el.classList.add("checked");
    		let inputElement = el.querySelector("input[type='radio']");
    		
    		if (inputElement) {
      			let mealCategoryId = inputElement.value;
      			console.log("mealCategoryId:", mealCategoryId);
      			
      			selectedMealCategoryId = mealCategoryId;
    		}
  		}
  		
	};
	
	
	saveButton.onclick = async function() {
       
        console.log(selectedDate, selectedProductId, selectedMealCategoryId);
        
        let requestData = {
	        regDate: selectedDate,
	        productId: selectedProductId,
	        mealCategoryId: selectedMealCategoryId
	    };
	    console.log(JSON.stringify(requestData));
	    
        // HTTP POST 요청을 보냄
        await fetch(`/api/eatings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        });
        
        
        // 데이터 검색을 위해 엔드포인트 호출
	    let eatingDate = selectedDate;
	    let mealCategoryId = selectedMealCategoryId;
	    
	    let url = `/api/eatings/findByMealCategory
	    		?eatingDate=${eatingDate}&mealCategoryId=${mealCategoryId}`;
	    let response = await fetch(url);
	    
	    
	    if (response.ok) {
		    const data = await response.json();
		    console.log(data);
		
		    // 각 메뉴에 대한 데이터를 사용하여 메뉴 카드를 생성
		    const breakfastCard = createMenuCard("아침", data.breakfast.sumKcal, "icon-bread icon-size:14 back:transparent", data.breakfastList);
		    const lunchCard = createMenuCard("점심", data.lunch.sumKcal, "icon-rice icon-size:13 back:transparent", data.lunchList);
		    const dinnerCard = createMenuCard("저녁", data.dinner.sumKcal, "icon-chicken icon-size:14 back:transparent", data.dinnerList);
		    const snackCard = createMenuCard("간식", data.snack.sumKcal, "icon-grape icon-size:13 back:transparent", data.snackList);
		
		    // 메뉴 카드를 해당 컨테이너에 추가
		    const dailyFoodContainer = document.querySelector(".daily-food");
		    
		    dailyFoodContainer.innerHTML = "";
		    
		    dailyFoodContainer.insertAdjacentHTML("beforeend", breakfastCard);
		    dailyFoodContainer.insertAdjacentHTML("beforeend", lunchCard);
		    dailyFoodContainer.insertAdjacentHTML("beforeend", dinnerCard);
    		dailyFoodContainer.insertAdjacentHTML("beforeend", snackCard);
        }
	}
	
	function createMenuCard(menuName, sumKcal, iconClass, items) {
	    return `
	        <div class="card">
	            <section class="meal ${menuName}">
	                <h1><a href="#">${menuName}</a></h1>
	                <div class="kcal-block">
	                    <a href="#">
	                        <span>${sumKcal}</span><span>칼로리</span>
	                    </a>
	                </div>
	                <div class="img-block">
	                    <a class="icon ${iconClass}" href="#"></a>
	                </div>
	                <div class="drop-down">
	                    <a class="icon icon-chevron-bottom back:transparent icon-size:8" href="#"></a>
	                </div>
	            </section>
	            <div class="${menuName}-list">
	                ${items}
	            </div>
	        </div>
	    `;
	}
	
	function createFoodItemCard(itemName, kcal) {
	    return `
	        <section class="food-card">
	            <h1 class="food-name">${itemName}</h1>
	            <div class="food-kcal-block">
	                <span>${kcal}</span><span>칼로리</span>
	            </div>
	        </section>
	    `;
	}


    
    function resetCategorySelection() {
	    labels.forEach((label) => {
	      	label.classList.remove("checked");
    	});
  	}
    
    // 색상을 결정하는 함수
	function getColor(value, max) {
	    var ratio = value / max;
	    if (ratio < 0.2 || ratio > 1.3) {
	        return '#FF6B78';
	    } else if (ratio < 0.5 || ratio > 1.0) {
	        return '#FFAB47';
	    } else {
	        return '#585CE5';
	    }
	}
	
	// 일반 도넛 차트 생성 함수
	function createDoughnutChart(elementId, originalData, maxValue, cutout) {
	    var ctxElement = document.getElementById(elementId);
	    if (ctxElement === null) {
	        console.error(`Element with id ${elementId} not found`);
	        return;
	    }
	    var ctx = ctxElement.getContext('2d');
	    var remaining = maxValue - originalData;
	    var chartData = [originalData, remaining];
	
	    return new Chart(ctx, {
	        type: 'doughnut',
	        data: {
	            datasets: [{
	                data: chartData,
	                backgroundColor: [
	                    getColor(originalData, maxValue),
	                    '#F4F6FA'
	                ],
	                borderWidth: 0,
	                borderRadius: 100,
	            }]
	        },
	        options: {
	            cutout: cutout,
	            aspectRatio: 1,
	            plugins: {
	                tooltip: {
	                    enabled: false,
	                },
	            },
	        }
	    });
	}

	// health-chart 도넛 차트 생성 함수
	function createHealthChart(elementId, originalData, maxValue) {
	    var ctxElement = document.getElementById(elementId);
	    if (ctxElement === null) {
	        console.error(`Element with id ${elementId} not found`);
	        return;
	    }
	    var ctx = ctxElement.getContext('2d');
	    var remaining = maxValue - originalData;
	    var chartData = [originalData, remaining];
	
	    return new Chart(ctx, {
	        type: 'doughnut',
	        data: {
	            datasets: [{
	                data: chartData,
	                backgroundColor: [
	                    getColor(originalData, maxValue),
	                    '#F4F6FA'
	                ],
	                borderWidth: 0,
	                circumference: 260, // 도넛 자르기
	                rotation: 230, // 도넛 시작 위치
	                borderRadius: 100,
	            }]
	        },
	        options: {
	            cutout: '85%',
	            aspectRatio: 1,
	            plugins: {
	                tooltip: {
	                    enabled: false,
	                },
	            },
	        }
	    });
	}
	
});


