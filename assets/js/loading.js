async function injectNavbar() {
    fetch("./nav.html").then(response => {
        return response.text()
    }).then(data => {
        document.querySelector("header").innerHTML = data;
    })

    let navbarHtml = await fetch("./nav.html")
    let data = await navbarHtml.text()
    document.querySelector("header").innerHTML = data;

    const payload = localStorage.getItem('payload');
    if (payload) {
        const payload_json = JSON.parse(payload)

        const intro = document.getElementById('user_name')
        intro.innerText = `${payload_json.username}님 환영합니다.`

        let logins = document.getElementById('logins')
        logins.style.display = "none";
        let signups = document.getElementById('signups')
        signups.style.display = "none";
    } else {
        let logout_btn = document.getElementById('logout_btn')
        logout_btn.style.display = "none";
    }

}

injectNavbar()

