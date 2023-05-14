window.onload = () => {
  // URLSearchParams는 쿼리 스트링을 파싱하여, 특정 파라미터 작업을 쉽게 수행할 수 있습니다.
  const urlParams = new URLSearchParams(window.location.search).get("id");
  DetailArticle(urlParams);
};

const article_id = new URLSearchParams(window.location.search).get("id");

async function DetailArticle(id) {
  const user = localStorage.getItem("payload");
  const user_id = JSON.parse(user).user_id;

  const response = await fetch(`${BACKEND_API}/api/article/${id}`, {
    method: "GET",
  });

  const response_json = await response.json();
  console.log(response_json);

  if (user_id != response_json.article.user_id) {
    const btn_edit = document.getElementById("detail_btn_edit");
    const btn_del = document.getElementById("detail_btn_del");
    btn_edit.setAttribute("style", "display:none;");
    btn_del.setAttribute("style", "display:none;");
  }
  if (response_json.article.progress) {
    const end_btn = document.getElementById("end_btn");
    end_btn.setAttribute("style", "display:none;");
  } else {
    const start_btn = document.getElementById("start_btn");
    const btn_edit = document.getElementById("detail_btn_edit");
    start_btn.setAttribute("style", "display:none;");
    btn_edit.setAttribute("style", "display:none;");
  }

  const detail_product_name = document.querySelector("#detail_product_name");
  const detail_product_price = document.querySelector("#detail_product_price");
  const max_money_user = document.querySelector("#max_money_user");
  const detail_btn_price = document.querySelector("#detail_btn_price");
  const detail_seller_name = document.querySelector("#detail_seller_name");
  const detail_product_num = document.querySelector("#detail_product_num");
  const detail_finished_at = document.querySelector("#detail_finished_at");
  const detail_created_at = document.querySelector("#detail_created_at");
  const detail_product_desc = document.querySelector("#detail_product_desc");
  const detail_product_img = document.querySelector("#detail_product_img");
  const detail_product_img_url = `${BACKEND_API}/${response_json.article.image}`;
  //const max_price = response_json.max_point + 10

  detail_product_img.setAttribute("src", detail_product_img_url);
  detail_product_name.innerText = response_json.article.product;
  detail_product_price.innerText = response_json.bid.max_point;
  max_money_user.innerText = response_json.bid.max_user;
  //detail_btn_price.innerText = `구매 | ${max_price}원`
  detail_seller_name.innerText = response_json.article.user;
  detail_product_num.innerText = response_json.article.id;
  detail_created_at.innerText = response_json.article.created_at.substr(0, 10);
  detail_finished_at.innerText = response_json.article.finished_at.substr(
    0,
    10
  );
  detail_product_desc.innerText = response_json.article.content;

  // 시간 타이머
  const clock = document.querySelector("#timer");

  function getClock() {
    const bidTime = new Date(response_json.article["finished_at"]);
    let d = (bidTime - new Date()) / 1000;
    if (d > 0) {
      const h = String(Math.floor(d / (60 * 60))).padStart(2, "0");
      d -= h * 60 * 60;
      const m = String(Math.floor(d / 60)).padStart(2, "0");
      d -= m * 60;
      const s = String(Math.floor(d)).padStart(2, "0");
      clock.innerText = `${h} : ${m} : ${s} 초 남음`;
    } else {
      clock.innerText = `경매 종료`;
      const start_btn = document.getElementById("start_btn");
      const btn_edit = document.getElementById("detail_btn_edit");
      start_btn.setAttribute("style", "display:none;");
      btn_edit.setAttribute("style", "display:none;");
    }
  }

  getClock(); //맨처음에 한번 실행
  setInterval(getClock, 1000); //1초 주기로 새로실행

  // 댓글 불러오기
  if (response_json.comment.length === 0) {
    document.querySelector("#comment_div").style.visibility = "hidden";
  }
  response_json.comment.forEach((e) => {
    comment_list.innerHTML += `<li class="list-group-item">${e.content}<span> - ${e.user}</span>
            <button class="btn btn-outline-success" type="button" style="width: 60px" onclick="DeleteComment(${e.id})">삭제</button>
        </li>`;
  });
}

// 관심 상품 등록
async function BookmarkArticle() {
  const response = await fetch(
    `${BACKEND_API}/api/article/${article_id}/mark/`,
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access"),
      },
      method: "POST",
      body: JSON.stringify({}),
    }
  );

  if (response.status == 200) {
    alert("북마크에 추가했습니다.");
  } else if (response.status == 202) {
    alert("북마크에서 삭제했습니다.");
  }

  window.location.reload();
}

// 내 상품 정보 수정시 보이는 정보
async function MyProductShow() {
  const response = await fetch(`${BACKEND_API}/api/article/${article_id}/`, {
    method: "GET",
  });

  response_json = await response.json();
  response_json = response_json.article;

  document.getElementById("product_name").value = response_json.product;
  document.getElementById("product_category").value = response_json.category;
  document.getElementById("product_content").value = response_json.content;
}

// 상품 정보 수정
async function DetailPatchArticle() {
  const product = document.getElementById("product_name");
  const category = document.getElementById("product_category");
  const content = document.getElementById("product_content");

  const response = await fetch(`${BACKEND_API}/api/article/${article_id}/`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("access"),
      "content-type": "application/json",
    },
    method: "PATCH",
    body: JSON.stringify({
      product: product.value,
      category: category.value,
      content: content.value,
    }),
  });

  if (response.status == 200) {
    alert("수정이 완료되었습니다.");
    window.location.reload();
  } else if (product.value == "" || content.value == "") {
    alert("빈칸을 입력해 주세요.");
  } else if (category.value == "-- 카테고리를 선택해 주세요 --") {
    alert("카테고리를 선택해 주세요.");
  }

  window.location.reload();
}

// 상품 삭제
async function MyProductDelete() {
  const response = await fetch(`${BACKEND_API}/api/article/${article_id}/`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("access"),
    },
    method: "DELETE",
  });

  if (response.status == 200) {
    alert("삭제가 완료되었습니다.");
  } else if (response.status == 401) {
    alert("권한이 없습니다.");
  }

  window.location.replace(`${FRONTEND_API}/index.html`);
}

// 상품 입찰
async function PurchaseProduct() {
  const point = document.getElementById("my_point").value;

  const response = await fetch(
    `${BACKEND_API}/api/article/${article_id}/bid/`,
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access"),
        "content-type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify({
        max_point: point,
      }),
    }
  );

  const response_json = await response.json();

  if (response.status == 200) {
    alert("입찰이 완료되었습니다.");
  } else if (response.status > 200) {
    alert(response_json["message"]);
  }

  window.location.reload();
}

// 댓글 작성
async function CreateComment() {
  const comment = document.getElementById("comment").value;

  const response = await fetch(
    `${BACKEND_API}/api/article/${article_id}/comment/`,
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access"),
        "content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        content: comment,
      }),
    }
  );

  if (response.status == 201) {
    alert("댓글 작성 완료");
  } else if (response.status == 400) {
    alert("다시 입력해 주세요.");
  }

  window.location.reload();
}

// 댓글 수정 ///////////////////// 수정 //////////////////////
async function EditComment(id) {
  const comment = document.getElementById("comment").value;

  const response = await fetch(
    `${BACKEND_API}/api/article/${article_id}/comment/${id}/`,
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access"),
        "content-type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({
        content: comment,
      }),
    }
  );

  if (response.status == 201) {
    alert("댓글 수정 완료");
  } else if (response.status == 400) {
    alert("다시 입력해 주세요.");
  }

  window.location.reload();
}

// 댓글 삭제
async function DeleteComment(id) {
  const response = await fetch(
    `${BACKEND_API}/api/article/${article_id}/comment/${id}/`,
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access"),
      },
      method: "DELETE",
    }
  );

  window.location.reload();
}
