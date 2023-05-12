// 데이터보내는 작업 -> api
// html문서 작업 -> index

window.onload = () => {

    handleShow();

}


async function handleShow() {

    const response = await fetch(`${BACKEND_API}/api/article/`, {
        method: 'GET',
    })

    response_json = await response.json()

    for (let i = 0; i < response_json.article2.length; i++) {
        let image = response_json.article2[i]['image'];
        let title = response_json.article2[i]['title'];
        let name = response_json.product[i].name;
        let bid = response_json.bid[i].max_point;

        console.log(response_json)

        category_content.innerHTML += `<div class='col'><div class='card h-100'><img src='${BACKEND_API}/api/article${image}' class='card-img-top'><span class='badge rounded-pill text-bg-danger'>진행중</span><div class='card-body'><h5 class='card-title'>${title}</h5><p class='card-text'> ${name} </p><h5 class='card-title'>${bid}</h5></div><button type='button' class='btn btn-success'>보러가기</button><div class='card-footer'><small class='text-body-secondary'>마지막 찬스 3분 전!!</small></div></div></div>`
    }
}

