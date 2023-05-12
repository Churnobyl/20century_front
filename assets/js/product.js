window.onload = () => {

    if (localStorage.getItem("access") == null) {
        alert("로그인 해주세요.")
        window.location.replace(`${FRONTEND_API}/login.html`)
    }
    
}


//상품 등록
async function CreateProduct() {

    const formdata = new FormData()
    formdata.append('title', product_title.value);
    formdata.append('product', product_name.value);
    formdata.append('category', product_category.value);
    formdata.append('image', product_image.files[0]);
    formdata.append('content', product_content.value);
    formdata.append('max_point', max_point.value);
    formdata.append("finished_at", 2);

    const response = await fetch(`${BACKEND_API}/api/article/`, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access"),
        },
        method: 'POST',
        body: formdata
    })

    if (response.status == 200) {
        alert("상품이 등록되었습니다.")
        window.location.replace(`${FRONTEND_API}/`)
    } else if (product_title.value == '' || product_name.value == '' || product_category.value == '' || product_content.value == '') {
        alert("빈칸을 입력해 주세요.")
    }
}