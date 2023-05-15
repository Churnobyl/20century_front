// 데이터보내는 작업 -> api
// html문서 작업 -> index

const RECOMMEND_PRODUCT = 4;
const BID_ARTICLES = 5;
const RESENT_PRODUCT = 10;

window.onload = function () {
  handleShow();
};

let sort_function = function (data, key, type) {
  return data.sort(function (a, b) {
    let x = a[key];
    let y = b[key];

    if (type == "desc") {
      return x > y ? -1 : x < y ? 1 : 0;
    } else if (type == "asc") {
      return x < y ? -1 : x > y ? 1 : 0;
    }
  });
};

// 시간!
function elapsedTime(date) {
  const start = new Date(date);
  const end = new Date();

  const diff = (start - end) / 1000;

  const times = [
    { name: "년", milliSeconds: 60 * 60 * 24 * 365 },
    { name: "개월", milliSeconds: 60 * 60 * 24 * 30 },
    { name: "일", milliSeconds: 60 * 60 * 24 },
    { name: "시간", milliSeconds: 60 * 60 },
    { name: "분", milliSeconds: 60 },
    { name: "초", milliSeconds: 1 },
  ];

  for (const value of times) {
    const betweenTime = Math.floor(diff / value.milliSeconds);

    if (value.name === "초" && betweenTime > 0) {
      return `<span style="color: red;">${betweenTime}${value.name} 후</span>`;
    } else if (betweenTime > 0) {
      return `${betweenTime}${value.name} 후 종료`;
    }
  }
  return `<span style="color: red;">종료</span>`;
}

async function handleShow() {
  const response = await fetch(`${BACKEND_API}/api/article/`, {
    method: "GET",
  });

  const response_json = await response.json();
  const response_json3 = JSON.parse(JSON.stringify(response_json.article2));
  const response_json2 = JSON.parse(JSON.stringify(response_json.article));
  const response_json_bid = JSON.parse(JSON.stringify(response_json.article2));
  //sort_function(response_json2, 'bookmarked', 'desc')
  const count = response_json.article.count;
  const all_page = parseInt(count / 4) + 1;
  let page_num = 1;
  if (response_json.article.next != null) {
    page_num = response_json.article.next.substr(-1) - 1;
  }
  // const page_num = response_json.article.next.substr(-1) -1
  const pre_page = 1;
  const next_page = page_num + 1;

  if (count < 5) {
    const pagesection = document.getElementById("pagesection");
    pagesection.remove();
  } else {
    pagination.innerHTML += `<li class="page-item">
                                    <a id="page_item_pre" class="page-link" aria-label="Previous" onclick="PageShow(${pre_page})">
                                    <span aria-hidden="true">&laquo;</span>
                                    </a>
                                </li>
                                <li class="page-item"><a class="page-link">${page_num} / ${all_page}</a></li>
                                <li class="page-item">
                                    <a id="page_item_next" class="page-link" aria-label="Next" onclick="PageShow(${next_page})">
                                    <span aria-hidden="true">&raquo;</span>
                                    </a>
                                </li>`;
  }

  articleView(response_json.article, response_json_bid);

  // let a = 0
  // response_json2.forEach((e) => {
  //     //console.log(e)
  //     const backendUrl = 'http://127.0.0.1:8000'; // Replace with your backend URL
  //     category_content.innerHTML += `<div class='col'>
  //         <div class='card h-100'>
  //             <img src='${backendUrl}${e.image}' class='card-img-top'>
  //             <div class="progress-edge" id='progress${a}'>
  //             </div>
  //             <div class='card-body'>
  //                 <h5 class='card-title'>제목: ${e.title}</h5>
  //                 <p class='card-text'> 상품: ${e.product} </p>
  //                 <h5 class='card-title' id='bid${a}'>현재가: ${e.bid}</h5>
  //             </div>
  //             <button type='button' class='btn btn-success' onclick='OpenDetailArticle(${e.id})'>보러가기</button>
  //             <div class='card-footer'>
  //                 <small class='text-body-secondary'><span id='finish-time${a}'>${elapsedTime(e.finished_at)}</span></small>
  //             </div>
  //         </div>
  //     </div>`

  //     if (e.progress === true)
  //     {
  //         document.querySelector(`#progress${a}`).innerHTML = `<span class='badge rounded-pill text-bg-success'>진행중</span>`;
  //     } else {
  //         document.querySelector(`#progress${a}`).innerHTML = `<span class='badge rounded-pill text-bg-danger'>종료</span>`;
  //     };

  //     if (e.bid === undefined)
  //     {
  //         document.querySelector(`#bid${a}`).textContent = '입찰없음';
  //     }

  //     a++;
  //     }
  // )
  response_json3.forEach((e, i) => {
    const id = e.id;
    const product = e.product;
    const max_point = e.max_point;
    const image_url = e.image;
    const image = `${BACKEND_API}${image_url}`;
    let max_user = "";
    if (e.max_user != null) {
      max_user = e.max_user;
    } else {
      max_user = "미정";
    }

    brand_list.innerHTML += `<div class="col">
            <div class="card h-100">
                <a href = "detail.html?id=${id}">
                  <img src="${image}" class="card-img-top" alt="...">
                </a>
                <div class="card-body">
                    <h5 class="card-title">${product}</h5>
                    <p class='card-text'> 현재가: <span style="color: red;">${e.max_point}</span> point </p>
                    <p class='card-text'> 최고입찰자: ${max_user} 님 </p>
                </div>
            </div>
        </div>`;
  });
}

async function PageShow(num) {
  const response = await fetch(`${BACKEND_API}/api/article/?page=${num}`, {
    method: "GET",
  });

  const response_json = await response.json();

  const count = response_json.article.count;
  const all_page = parseInt(count / 4) + 1;

  let page_num = 0;
  let pre_page = 0;
  let next_page = 0;
  if (response_json.article.previous == null) {
    page_num = 1;
    pre_page = 1;
    next_page = 2;
  } else if (response_json.article.next == null) {
    page_num = all_page;
    pre_page = page_num - 1;
    next_page = all_page;
  } else {
    page_num = response_json.article.next.substr(-1) - 1;
    pre_page = page_num - 1;
    next_page = page_num + 1;
  }

  pagination.innerHTML = `<li class="page-item">
                                <a id="page_item_pre" class="page-link" aria-label="Previous" onclick="PageShow(${pre_page})">
                                <span aria-hidden="true">&laquo;</span>
                                </a>
                            </li>
                            <li class="page-item"><a class="page-link">${page_num} / ${all_page}</a></li>
                            <li class="page-item">
                                <a id="page_item_next" class="page-link" aria-label="Next" onclick="PageShow(${next_page})">
                                <span aria-hidden="true">&raquo;</span>
                                </a>
                            </li>`;

  category_content.innerHTML = "";
  articleView(response_json.article);
}

function articleView(response_json) {
  let a = 0;
  response_json.results.forEach((e, i) => {
    let max_user = "";
    if (e.max_user != null) {
      max_user = e.max_user;
    } else {
      max_user = "미정";
    }
    // forEach함수 두번째 매개변수는 인덱스입니다!!
    const backendUrl = "http://127.0.0.1:8000"; // Replace with your backend URL
    category_content.innerHTML += `<div class='col'>
            <div class='card h-100'>
                <img src='${backendUrl}${e.image}' class='card-img-top'>
                <div class="progress-edge" id='progress${a}'>
                </div>
                <div class='card-body'>
                    <h5 class='card-title'>제목: ${e.title}</h5>
                    <p class='card-text'> 상품: ${e.product} </p>
                    <h5 class='card-title' id='bid${a}'>현재가: <span style="color: red;">${
      e.max_point
    }</span>point</h5>
    <p class='card-text'> 최고입찰자: ${max_user} 님 </p>
                </div>
                <button type='button' class='btn btn-success' onclick='OpenDetailArticle(${
                  e.id
                })'>보러가기</button>
                <div class='card-footer'>
                    <small class='text-body-secondary'><span id='finish-time${a}'>${elapsedTime(
      e.finished_at
    )}</span></small>
                </div>
            </div>
        </div>`;

    if (e.progress === true) {
      document.querySelector(
        `#progress${a}`
      ).innerHTML = `<span class='badge rounded-pill text-bg-success'>진행중</span>`;
    } else {
      document.querySelector(
        `#progress${a}`
      ).innerHTML = `<span class='badge rounded-pill text-bg-danger'>종료</span>`;
    }

    if (e.progress === false) {
      document.querySelector(`#bid${a}`).textContent = "입찰없음";
    }

    a++;
  });
}

// for (let i = 0; i < RECOMMEND_PRODUCT; i++) {
//     let image = response_json2[i]['image'];
//     let title = response_json2[i]['title'];
//     let product = response_json2[i]['product'];
//     let bid = response_json2[i]['max-point'];
//     let article_id = response_json2[i]['id'];
//     let progress = response_json2[i]['progress'];
//     let finished_at = new Date(response_json2[i]['finished_at'])

//     category_content.innerHTML +=
//     `<div class='col'>
//         <div class='card h-100'>
//             <img src='${BACKEND_API}${image}' class='card-img-top'>
//             <div class="progress-edge" id='progress${i}'>
//             </div>
//             <div class='card-body'>
//                 <h5 class='card-title'>제목: ${title}</h5>
//                 <p class='card-text'> 상품: ${product} </p>
//                 <h5 class='card-title' id='bid${i}'>현재가: ${bid}</h5>
//             </div>
//             <button type='button' class='btn btn-success' onclick='OpenDetailArticle(${article_id})'>보러가기</button>
//             <div class='card-footer'>
//                 <small class='text-body-secondary'><span id="finish-time${i}">${elapsedTime(finished_at)}</span></small>
//             </div>
//         </div>
//     </div>`

//     if (progress === true)
//     {
//         document.querySelector(`#progress${i}`).innerHTML = `<span class='badge rounded-pill text-bg-success'>진행중</span>`;
//     } else {
//         document.querySelector(`#progress${i}`).innerHTML = `<span class='badge rounded-pill text-bg-danger'>종료</span>`;
//     };

// if (bid === undefined)
// {
//     document.querySelector(`#bid${i}`).textContent = '입찰없음';
// }

// 카테고리 작은 카드 부분
// for(let i=0; i < RESENT_PRODUCT; i++){
//     const id = response_json3[i].id;
//     const product = response_json3[i].product;
//     const max_point = response_json3[i].max_point;
//     const image_url = response_json3[i].image;
//     const image = `${BACKEND_API}${image_url}`;

//     brand_list.innerHTML +=
//     `<div class="col">
//         <div class="card h-100">
//             <a href = "detail.html?id=${id}">
//               <img src="${image}" class="card-img-top" alt="...">
//             </a>
//             <div class="card-body">
//                 <h5 class="card-title">${product}</h5>
//                 <p class='card-text'> ${max_point} </p>
//             </div>
//         </div>
//     </div>`

function OpenDetailArticle(bid_id) {
  window.location.href = `${FRONTEND_API}/detail.html?id=${bid_id}`;
}

function searchProduct() {
  const search_input = document
    .querySelector("#search_input")
    .value.toLowerCase();
  // for (let i = 0; i < 100; i++) {}
}
