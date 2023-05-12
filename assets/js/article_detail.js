
window.onload = () => {
    // URLSearchParams는 쿼리 스트링을 파싱하여, 특정 파라미터 작업을 쉽게 수행할 수 있습니다.
    const urlParams = new URLSearchParams(window.location.search).get('id');
    DetailArticle(urlParams);
}

const article_id = new URLSearchParams(window.location.search).get('id');

async function DetailArticle(id){
    const user = localStorage.getItem("payload")
    const user_parse = JSON.parse(user).username
    
    const response = await fetch(`${BACKEND_API}/api/article/${id}`, {
        method: 'GET',        
    })

    response_json = await response.json()    
    
    if (user_parse != response_json.user) {
        const btn_edit = document.getElementById('detail_btn_edit')
        const btn_del = document.getElementById('detail_btn_del')
        btn_edit.remove();
        btn_del.remove();
    }
    const detail_product_name = document.querySelector('#detail_product_name');
    const detail_product_price = document.querySelector('#detail_product_price');
    const detail_btn_price = document.querySelector('#detail_btn_price');
    const detail_seller_name = document.querySelector('#detail_seller_name');
    const detail_product_num = document.querySelector('#detail_product_num');
    const detail_finished_at = document.querySelector('#detail_finished_at');
    const detail_created_at = document.querySelector('#detail_created_at');
    const detail_product_desc = document.querySelector('#detail_product_desc');
    const detail_product_img = document.querySelector('#detail_product_img');
    const detail_product_img_url = `${BACKEND_API}/${response_json.image}`

    detail_product_img.setAttribute('src', detail_product_img_url)
    detail_product_name.innerText = response_json.product
    detail_product_price.innerText = response_json.max_user
    detail_btn_price.innerText = `구매 | ${response_json.max_user}원`
    detail_seller_name.innerText = response_json.user
    detail_product_num.innerText = response_json.id
    detail_created_at.innerText = response_json.created_at.substr(0, 10)
    detail_finished_at.innerText = response_json.finished_at.substr(0, 10)
    detail_product_desc.innerText = response_json.content

    // 시간 타이머
    const clock = document.querySelector("#timer");

    function getClock(){
        const bidTime = new Date(response_json['finished_at']);
        let d = (bidTime - new Date())/1000;
        if (d > 0) {
            const h = String(Math.floor(d/(60 * 60))).padStart(2,"0");
            d -=  h * 60 * 60;
            const m = String(Math.floor(d/(60))).padStart(2,"0");
            d -=  m * 60;
            const s = String(Math.floor(d)).padStart(2,"0");
            clock.innerText = `${h} : ${m} : ${s} 초 남음`;
        } else {
            clock.innerText = `경매 종료`;
        }
        
    }

    getClock(); //맨처음에 한번 실행
    setInterval(getClock, 1000); //1초 주기로 새로실행
    
}

// 관심 상품 등록
async function BookmarkArticle(){

    const response = await fetch(`${BACKEND_API}/api/article/${article_id}/mark/`, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access"),
        },
        method: 'POST',
        body: JSON.stringify({})
    })
    
    if (response.status == 200) {
        alert("북마크에 추가했습니다.")         
    } else if (response.status == 202) {
        alert("북마크에서 삭제했습니다.")
    } 

    window.location.reload()
}

// 내 상품 정보 수정시 보이는 정보
async function MyProductShow() {

    const response = await fetch(`${BACKEND_API}/api/article/${article_id}`, {
        method: 'GET',        
    })

    response_json = await response.json()

    document.getElementById('product_title').value = response_json.title
    document.getElementById('product_category').value = response_json.category
    document.getElementById('product_content').value = response_json.content
}

// 상품 정보 수정
async function DetailPatchArticle(){

    const title = document.getElementById('product_title');
    const category = document.getElementById('product_category');
    const content = document.getElementById('product_content');
    
    const response = await fetch(`${BACKEND_API}/api/article/${article_id}/`, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access"),
            'content-type': 'application/json',
        },
        method: 'PATCH',
        body: JSON.stringify({
            "title": title.value,
            "category": category.value,
            "content": content.value,
        })
    })

    if (response.status == 200) {
        alert("수정이 완료되었습니다.")
        window.location.reload()
    } else if (title.value == '' || content.value == '') {
        alert("빈칸을 입력해 주세요.")
    } else if (category.value == '-- 카테고리를 선택해 주세요 --') {
        alert("카테고리를 선택해 주세요.")
    } 

    window.location.reload()
}

// 상품 삭제
async function MyProductDelete() {

    const response = await fetch(`${BACKEND_API}/api/article/${article_id}/`, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access"),
        },
        method: 'DELETE',
    })

    if (response.status == 200) {
        alert("삭제가 완료되었습니다.")
    } else if (response.status == 401) {
        alert("권한이 없습니다.")
    }

    window.location.replace(`${FRONTEND_API}/index.html`)
}