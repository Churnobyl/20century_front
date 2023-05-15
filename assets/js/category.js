window.onload = () => {
  // URLSearchParams는 쿼리 스트링을 파싱하여, 특정 파라미터 작업을 쉽게 수행할 수 있습니다.
  const urlParams = new URLSearchParams(window.location.search).get("category");
  DetailCategory(urlParams);
};

//자바스크립트 복사
// const response_json2 = JSON.parse(JSON.stringify(response_json));

async function DetailCategory(category_name) {
  const response = await fetch(`${BACKEND_API}/api/article/${category_name}`, {
    method: "GET",
  }); // 👍화이팅!

  const response_json = await response.json();
  const category_cards = document.querySelector("#category_cards");
  const category_brand_list = document.querySelector("#category_brand_list");

  const response_json2 = JSON.parse(JSON.stringify(response_json.article));
  const response_json3 = JSON.parse(JSON.stringify(response_json.article));

  sort_function(response_json2, "bookmarked", "desc");

  // 카테고리 큰 카드 부분 4
  for (let i = 0; i <= RECOMMEND_PRODUCT; i++) {
    if (response_json2.length > i) {
      const title = response_json2[i].title;
      const id = response_json2[i].id;
      const product = response_json2[i].product;
      const max_point = response_json2[i].max_point;
      const progress = response_json2[i].progress;
      const image_url = response_json2[i].image;
      const image = `${BACKEND_API}${image_url}`;
      let finished_at = new Date(response_json2[i]["finished_at"]);
      category_cards.innerHTML += `<div class='col'>
                <div class='card h-100'>
                    <img src='${image}' class='card-img-top'>
                    <div class="progress-edge" id='progress${i}'>
                    </div>
                    <div class='card-body'>
                        <h5 class='card-title'>제목: ${title}</h5>
                        <p class='card-text'> 상품: ${product} </p>
                        <h5 class='card-title' id='bid${i}'>현재가: ${max_point}</h5>
                    </div>
                    <button type='button' class='btn btn-success' onclick='OpenDetailArticle(${id})'>보러가기</button>
                    <div class='card-footer'>
                        <small class='text-body-secondary'><span id="finish-time${i}">${elapsedTime(
        finished_at
      )}</span></small>
                    </div>
                </div>
            </div>`;

      if (progress === true) {
        document.querySelector(
          `#progress${i}`
        ).innerHTML = `<span class='badge rounded-pill text-bg-success'>진행중</span>`;
      } else {
        document.querySelector(
          `#progress${i}`
        ).innerHTML = `<span class='badge rounded-pill text-bg-danger'>종료</span>`;
      }
    } else {
      break;
    }
  }

  // 카테고리 작은 카드 부분 10
  for (let i = 0; i <= RESENT_PRODUCT; i++) {
    if (response_json3.length > i) {
      const id = response_json3[i].id;
      const product = response_json3[i].product;
      const max_point = response_json3[i].max_point;
      const image_url = response_json3[i].image;
      const image = `${BACKEND_API}${image_url}`;

      category_brand_list.innerHTML += `<div class="col">
                <div class="card h-100">
                    <a href = "detail.html?id=${id}">
                    <img src="${image}" class="card-img-top" alt="...">
                    </a>
                    <div class="card-body">
                        <h5 class="card-title">${product}</h5>
                        <p class='card-text'> ${max_point} </p>
                    </div>
                </div>
            </div>`;
    } else {
      break;
    }
  }
}
