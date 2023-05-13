// 데이터보내는 작업 -> api
// html문서 작업 -> index

const RECOMMEND_PRODUCT = 4
const BID_ARTICLES = 5
const RESENT_PRODUCT = 10

// 시간!
function elapsedTime(date) {
    const start = new Date(date);
    const end = new Date();

    const diff = (start - end) / 1000;
    
    const times = [
        { name: '년', milliSeconds: 60 * 60 * 24 * 365 },
        { name: '개월', milliSeconds: 60 * 60 * 24 * 30 },
        { name: '일', milliSeconds: 60 * 60 * 24 },
        { name: '시간', milliSeconds: 60 * 60 },
        { name: '분', milliSeconds: 60 },
        { name: '초', milliSeconds: 1},
    ];

    for (const value of times) {
    const betweenTime = Math.floor(diff / value.milliSeconds);

    if (value.name === '초' && betweenTime > 0) {
        return `<span style="color: red;">${betweenTime}${value.name} 후</span>`;
    } else if (betweenTime > 0) {
        return `${betweenTime}${value.name} 후`;
    }
    }
    return `<span style="color: red;">종료</span>`;
}

const payload = localStorage.getItem("payload")
const user_id = JSON.parse(payload).user_id

document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("access")) {
        MypageShow();
    } else {
        window.location.replace(`${FRONTEND_API}/login.html`)
    }
});


// 마이페이지 내 정보 보여주기
async function MypageShow() {

    const response = await fetch(`${BACKEND_API}/api/user/${user_id}/`, {
        method: 'GET',
    })

    const response_json = await response.json()

    const user_name = document.getElementById('name');    
    const user_point = document.getElementById('user_point');
    const user_created_at = document.getElementById('user_created_at');

    user_name.innerText = "이름 : " + response_json.user.username;
    user_point.innerText = "포인트 : " + response_json.user.point;
    user_created_at.innerText = "가입일 : " + response_json.user.created_at.substr(0, 10);
    const new_profile_images = response_json.user.profile_image;    
    
    const bid_json = response_json.bid_article
    const book_json = response_json.book
    const bid_board = document.getElementById('bid_board');
    const bookmark_board = document.getElementById('bookmark_board')

    profile_img_area.setAttribute('src', `${BACKEND_API}/${new_profile_images}`);

    //마이페이지 찜 목록
    book_json.forEach((book, i) => {
        const title = book.title;
        const id = book.id;
        const product = book.product;
        const max_point = book.max_point;
        const progress = book.progress;
        const image_url = book.image;
        const image = `${BACKEND_API}${image_url}`;
        const finished_at = new Date(book.finished_at);

        bookmark_board.innerHTML +=
        `
        <div class='bookmark_container'>
            <div class='col'>
                <div class='card h-100'>
                    <img src=${image} class='card-img-top'>
                    <div class="progress-edge" id='progress${i}'>
                    </div>
                    <div class='card-body'>
                        <h5 class='card-title'>제목: ${title}</h5>
                        <p class='card-text'> 상품: ${product} </p>
                        <h5 class='card-title' id='bid${i}'>현재가: ${max_point}</h5>
                    </div>
                    <button type='button' class='btn btn-success' onclick='OpenDetailArticle(${id})'>보러가기</button>
                    <div class='card-footer'>
                        <small class='text-body-secondary'><span id="finish-time${i}">${elapsedTime(finished_at)}</span></small>
                    </div>
                </div>
            </div>
        </div>
        `;
    
        if (progress === true) {
            document.querySelector(`#progress${i}`).innerHTML = `<span class='badge rounded-pill text-bg-success'>진행중</span>`;
        } else {
            document.querySelector(`#progress${i}`).innerHTML = `<span class='badge rounded-pill text-bg-danger'>종료</span>`;
        }
    });

    //마이페이지 입찰 현황
    bid_json.forEach((bid) => {
        const id = bid.id;
        const product = bid.product;
        const max_point = bid.max_point;
        const image_url = bid.image;
        const image = `${BACKEND_API}${image_url}`;

        bid_board.innerHTML +=
        `
        <div class='card_size_container'>
            <div class="col">
                <div class="card h-100">
                    <a href="detail.html?id=${id}">
                    <img src=${image} class="card-img-top" alt="...">
                    </a>
                    <div class="card-body">
                        <h5 class="card-title">${product}</h5>
                        <p class='card-text'> 현재가: ${max_point} </p>
                    </div>
                </div>
            </div>
        </div>
        `;
    });

    // 마이페이지 찜 목록
    // for (let i=0; i < RECOMMEND_PRODUCT; i++){
    //     const title = response_json.book[i].title;
    //     const id = response_json.book[i].id;
    //     const product = response_json.book[i].product;
    //     const max_point = response_json.book[i].max_point;
    //     const progress = response_json.book[i].progress;
    //     const image_url = response_json.book[i].image;
    //     const image = `${BACKEND_API}${image_url}`;
    //     let finished_at = new Date(response_json.book[i]['finished_at'])
        
    //     bookmark_board.innerHTML +=
    //     `<div class='col'>
    //         <div class='card h-100'>
    //             <img src=${image} class='card-img-top'>
    //             <div class="progress-edge" id='progress${i}'>
    //             </div>
    //             <div class='card-body'>
    //                 <h5 class='card-title'>제목: ${title}</h5>
    //                 <p class='card-text'> 상품: ${product} </p>
    //                 <h5 class='card-title' id='bid${i}'>현재가: ${max_point}</h5>
    //             </div>
    //             <button type='button' class='btn btn-success' onclick='OpenDetailArticle(${id})'>보러가기</button>
    //             <div class='card-footer'>
    //                 <small class='text-body-secondary'><span id="finish-time${i}">${elapsedTime(finished_at)}</span></small>
    //             </div>
    //         </div>
    //     </div>`

    //     if (progress === true)
    //         {
    //             document.querySelector(`#progress${i}`).innerHTML = `<span class='badge rounded-pill text-bg-success'>진행중</span>`;
    //         } else {
    //             document.querySelector(`#progress${i}`).innerHTML = `<span class='badge rounded-pill text-bg-danger'>종료</span>`;
    //         };    
    // };

    // //마이페이지 입찰 현황
    // for (let i=0; i < BID_ARTICLES; i++){
    //     const id = response_json.bid_article[i].id;
    //     const product = response_json.bid_article[i].product;
    //     const max_point = response_json.bid_article[i].max_point;
    //     const image_url = response_json.bid_article[i].image;
    //     const image = `${BACKEND_API}${image_url}`;

    //     bid_board.innerHTML +=
    //     `<div class="col">
    //         <div class="card h-100">
    //             <a href = "detail.html?id=${id}">
    //               <img src=${image} class="card-img-top" alt="...">
    //             </a>
    //             <div class="card-body">
    //                 <h5 class="card-title">${product}</h5>
    //                 <p class='card-text'> 현재가: ${max_point} </p>
    //             </div>
    //         </div>
    //     </div>`
    // };    
}







// 내 정보 수정시 보이는 정보
async function MyinfoShow() {

    const response = await fetch(`${BACKEND_API}/api/user/${user_id}/`, {
        method: 'GET',
    })

    response_json = await response.json()

    document.getElementById('edit_user_name').value = response_json.user.username
    document.getElementById('email').value = response_json.user.email
}

// 내 정보 수정
async function handleMyEdit() {

    const username = document.getElementById('edit_user_name');
    const userimage = document.getElementById('edit_user_image');
    const image = userimage.files[0];

    const formData = new FormData();

    if (image) {
        formData.append('profile_image', image);
    }

    formData.append('username', username.value);

    const response = await fetch(`${BACKEND_API}/api/user/${user_id}/`, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access"),
        },
        method: 'PUT',
        body: formData
    })

    if (response.status == 200) {
        alert("수정이 완료되었습니다.") 
    }
    window.location.reload()
}

// 포인트 충전
async function PointCharge() {

    const point = document.getElementById("my_point")
    const response = await fetch(`${BACKEND_API}/api/user/${user_id}/`, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access"),
            'content-type': 'application/json',
        },
        method: 'PATCH',
        body: JSON.stringify({
            "point": parseInt(point.value, 10)
        })
    })

    if (response.status == 200) {
        alert("충전이 완료되었습니다.") 
        window.location.reload()
    } else if (point.value == '') {
        alert("금액을 입력해 주세요.")
    } 
}

// 탈퇴
async function DeleteUser() {    

    const response = await fetch(`${BACKEND_API}/api/user/${user_id}/`, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access"),
        },
        method: 'DELETE',
    })

    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("payload")
    window.location.replace(`${FRONTEND_API}/index.html`)
}

function OpenDetailArticle(id){

    window.location.href = `${FRONTEND_API}/detail.html?id=${id}`
    
}
