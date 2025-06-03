// 業界とカテゴリ定義
const INDUSTRIES = {
  "IT": "💻 IT",
  "医療": "💉 医療",
  "教育": "📚 教育",
  "建設": "🏗️ 建設",
  "金融": "💰 金融",
  "製造": "🏭 製造",
  "販売": "🛒 販売",
  "デザイン": "🎨 デザイン",
  "観光": "🗺️ 観光",
  "農業": "🌾 農業",
  "その他": "❓ その他"
};

const CATEGORIES = {
  "SDGs": "🌱 SDGs",
  "ビジコン系": "💡 ビジコン系",
  "イベント": "🎪 イベント",
  "企業との共同プロジェクト": "🤝 企業との共同プロジェクト"
};

function populateSelectOptions(select, options, includeAllOption = false) {
  if (!select) return;
  select.innerHTML = "";
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = includeAllOption ? "すべて" : "選択してください";
  select.appendChild(defaultOption);

  Object.entries(options).forEach(([val, label]) => {
    const option = document.createElement("option");
    option.value = val;
    option.textContent = label;
    select.appendChild(option);
  });
}

function bindFavoriteButtons() {
  document.querySelectorAll(".favorite-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const userName = localStorage.getItem("userName");
      const key = `favorites_${userName}`;
      let favorites = JSON.parse(localStorage.getItem(key) || "[]");

      const isRemoving = favorites.includes(id);
      favorites = isRemoving
        ? favorites.filter(pid => pid !== id)
        : [...favorites, id];

      localStorage.setItem(key, JSON.stringify(favorites));

      btn.classList.toggle("added", !isRemoving);
      btn.textContent = isRemoving ? "☆ お気に入り追加" : "★ お気に入り解除";
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  populateSelectOptions(document.querySelector("select[name='industry']"), INDUSTRIES);
  populateSelectOptions(document.querySelector("select[name='category']"), CATEGORIES);
  populateSelectOptions(document.getElementById("industry-filter"), INDUSTRIES, true);
  populateSelectOptions(document.getElementById("category-filter"), CATEGORIES, true);

  bindFavoriteButtons();

  const role = localStorage.getItem("userRole");
  const navBar = document.getElementById("nav-bar");
  if (navBar && role === "student") {
    navBar.remove();
  }

  const postForm = document.getElementById("post-form");
if (postForm) {
  const params = new URLSearchParams(window.location.search);
  const editId = params.get("edit");

  // 編集モードならフォームに値を事前に入れる
  if (editId) {
    const projects = JSON.parse(localStorage.getItem("projects") || "[]");
    const project = projects.find(p => p.id === editId);
    if (project) {
      postForm.setAttribute("data-edit-id", editId);
      postForm.elements["title"].value = project.title;
      postForm.elements["description"].value = project.description;
      postForm.elements["industry"].value = project.industry;
      postForm.elements["category"].value = project.category;
      postForm.elements["organization"].value = project.organization;
      postForm.elements["skills"].value = project.skills || "";
      postForm.elements["term_label"].value = project.term_label || "";
      const [start, end] = project.duration.split("〜");
      postForm.elements["duration-start"].value = start;
      postForm.elements["duration-end"].value = end;
    }
  }

  postForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(postForm);
    const project = {};
    formData.forEach((value, key) => project[key] = value);

    project.duration = `${project["duration-start"]}〜${project["duration-end"]}`;
    delete project["duration-start"];
    delete project["duration-end"];

    let projects = JSON.parse(localStorage.getItem("projects") || "[]");

    if (editId) {
      const index = projects.findIndex(p => p.id === editId);
      if (index !== -1) {
        project.id = editId;
        project.author = projects[index].author;
        projects[index] = project;
      }
    } else {
      project.id = Date.now().toString();
      project.author = localStorage.getItem("userName") || "未設定";
      projects.push(project);
    }

    localStorage.setItem("projects", JSON.stringify(projects));
    alert("プロジェクトが保存されました！");
    const role = localStorage.getItem("userRole");
    window.location.href = role === "company" ? "company-projects.html" : "projects.html";
  });
}


  const changeRoleLink = document.getElementById("change-role-link");
  if (changeRoleLink) {
    changeRoleLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");
      window.location.href = "select-role.html";
    });
  }

  const logoutLink = document.getElementById("logout-link");
  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("ログアウトしますか？")) {
        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");
        window.location.href = "select-role.html";
      }
    });
  }

  const userInfoBar = document.getElementById("user-info");
  const name = localStorage.getItem("userName");
  if (userInfoBar && role && name) {
    const roleLabel = role === "student" ? "👩‍🎓 学生" : "🏢 企業";
    userInfoBar.textContent = `${roleLabel}としてログイン中：${name}`;
  }
});

function enforceLogin(requiredRole) {
  const role = localStorage.getItem("userRole");
  if (!role || role !== requiredRole) {
    alert("このページにはアクセスできません。ログインしてください。");
    window.location.href = "select-role.html";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("userRole");
  const postLink = document.querySelector('a[href="post.html"]');
  if (postLink && role === "student") {
    postLink.remove(); // または postLink.style.display = "none";
  }
});

