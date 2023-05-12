// 데이터보내는 작업 -> api
// html문서 작업 -> index

const payload = localStorage.getItem("payload")
const user_id = JSON.parse(payload).user_id

document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("access")) {
        MypageShow();
    } else {
        window.location.replace(`${FRONTEND_API}login.html`)
    }
});


async function MypageShow() {

    const response = await fetch(`${BACKEND_API}/api/user/${user_id}/`, {
        method: 'GET',
    })

    response_json = await response.json()

    const user_name = document.getElementById('user_name');
    const user_created_at = document.getElementById('user_created_at');

    username.innerText = "이름 : " + response_json.username;
    user_created_at.innerText = "가입일 : " + response_json.created_at.substr(0, 10);
    const new_profile_images = response_json.profile_image;

    profile_img_area.setAttribute('src', `${BACKEND_API}/api/user${new_profile_images}`)
}

// 내 정보 수정시 보이는 정보
async function MyinfoShow() {

    const response = await fetch(`${BACKEND_API}/api/user/${user_id}/`, {
        method: 'GET',
    })

    response_json = await response.json()

    document.getElementById('edit_user_name').value = response_json.username
    document.getElementById('email').value = response_json.email
}

// 내 정보 수정
async function handleMyEdit() {

    const userimage = document.getElementById('edit_user_image');
    const image = userimage.files[0];

    const formData = new FormData();

    formData.append('username', edit_user_name.value);
    formData.append('profile_image', image);

    const response = await fetch(`${BACKEND_API}/api/user/${user_id}/`, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access"),
        },
        method: 'PUT',
        body: formData
    })

    console.log(await response.json())
    window.location.replace(`${FRONTEND_API}mypage.html`)
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
    window.location.replace(`${FRONTEND_API}index.html`)
}


