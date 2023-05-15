window.onload = () => {
  if (localStorage.getItem("access") == null) {
    alert("로그인 해주세요.");
    window.location.replace(`${FRONTEND_API}/login.html`);
  }
};

//상품 등록
async function CreateProduct() {
  const formdata = new FormData();
  formdata.append("title", product_title.value);
  formdata.append("product", product_name.value);
  formdata.append("category", product_category.value);
  formdata.append("image", product_image.files[0]);
  formdata.append("content", product_content.value);
  formdata.append("max_point", max_point.value);
  formdata.append("finished_at", finished_at.value);

  const response = await fetch(`${BACKEND_API}/api/article/`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("access"),
    },
    method: "POST",
    body: formdata,
  });

  const response_json = await response.json();
  console.log(response_json);

  if (response.status == 200) {
    alert("상품이 등록되었습니다.");
    window.location.replace(`${FRONTEND_API}/`);
  } else if (response.status == 400) {
    alert(response_json["message"]);
  } else if (
    product_title.value == "" ||
    product_name.value == "" ||
    product_category.value == "" ||
    product_content.value == ""
  ) {
    alert("빈칸을 입력해 주세요.");
  }
}

let dateElement = document.getElementById("finished_at");
let date = new Date(
  new Date().getTime() - new Date().getTimezoneOffset() * 60000
)
  .toISOString()
  .slice(0, -8);
dateElement.value = date;
dateElement.setAttribute("min", date);

function setMinValue() {
  if (dateElement.value < date) {
    alert("현재 시간보다 이전의 날짜는 설정할 수 없습니다.");
    dateElement.value = date;
  }
}
