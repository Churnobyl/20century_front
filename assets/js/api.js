const BACKEND_API = 'http://127.0.0.1:8000'
const FRONTEND_API = 'http://127.0.0.1:5500/'
const email = document.querySelector('#email')
const password = document.querySelector('#password')
const password2 = document.querySelector('#password2')
const image = document.getElementById("image")
const product_title = document.getElementById("product_title")
const product_name = document.getElementById("product_name")
const product_category = document.getElementById("product_category")
const product_image = document.getElementById("product_image")
const product_content = document.getElementById("product_content")
const profile_image = document.getElementById("profile_image")


async function handleSignup() {

    const formdata = new FormData()

    formdata.append('email', email.value);
    formdata.append('password1', password.value);
    formdata.append('password2', password2.value);
    formdata.append('profile_image', profile_image.files[0]);

    const response = await fetch(`${BACKEND_API}/api/user/dj-rest-auth/registration/`, {
        method: 'POST',
        headers: {

        },
        body: formdata,

    })

    if (response.status == 201) {
        alert("가입되었습니다.")
        window.location.replace(`${FRONTEND_API}login.html`)
    } else if (email.value == '' || password.value == '' || password2.value == '') {
        alert("빈칸을 입력해 주세요.")
    } else if (password.value != password2.value) {
        alert("비밀번호를 다시 확인해 주세요.")
    } else {
        alert('다시 입력해 주세요.')
    }
}


async function handleLogin() {

    const response = await fetch(`${BACKEND_API}/api/user/api/token/`, {
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            "email": email.value,
            "password": password.value
        })
    })

    if (response.status == 200) {
        alert("환영합니다.")

        const response_json = await response.json()

        localStorage.setItem("access", response_json.access);
        localStorage.setItem("refresh", response_json.refresh);

        const base64Url = response_json.access.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        localStorage.setItem("payload", jsonPayload);
        window.location.replace(FRONTEND_API)
    } else if (email.value == '' || password.value == '') {
        alert("빈칸을 입력해 주세요.")
    } else {
        alert('이메일과 비밀번호가 일치하지 않습니다.')
    }
}

function handleLogout() {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem('payload')

    window.location.replace(`${FRONTEND_API}index.html`)
}


//상품 등록
async function CreateProduct() {

    const formdata = new FormData()
    formdata.append('title', product_title.value);
    formdata.append('name', product_name.value);
    formdata.append('category', product_category.value);
    formdata.append('image', product_image.files[0]);
    formdata.append('content', product_content.value);
    formdata.append("finished_at", "2023-05-12 18:00:00");

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

// 상품 정보 수정
async function EditProduct() {

    const response = await fetch(`${BACKEND_API}/api/article/`, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access"),
            'content-type': 'application/json',
        },
        method: 'GET',
        body: JSON.stringify({
            "title": product_title.value,
            "name": product_name.value,
            "category": product_category.value,
            //"image": product_image.value,
            "content": product_content.value,
            "finished_at": "2023-05-12 18:00:00"
        })
    })

    if (response.status == 200) {
        alert("상품이 등록되었습니다.")
        window.location.replace(`${FRONTEND_API}`)
    } else if (product_title.value == '' || product_name.value == '' || product_category.value == '' || product_content.value == '') {
        alert("빈칸을 입력해 주세요.")
    }
}

function checkLogin() {
    const payload = localStorage.getItem('payload');

    if (payload) {
        window.location.replace(`${FRONTEND_API}`)
    }
}

// 로그인 되지 않은 유저 홈으로
function checkLogout() {
    const payload = localStorage.getItem('payload');

    if (payload == null) {
        window.location.replace(`${FRONTEND_API}`)
    }
}
