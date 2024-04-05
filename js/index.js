const form = document.getElementById("github-form");
const input = document.getElementById("search");
const userList = document.getElementById("user-list");
const reposList = document.getElementById("repos-list");
const toggle = document.getElementById("toggle");

// Event listener to toggle between user and repository search modes
toggle.addEventListener("click", () => {
  toggle.textContent = toggle.innerText === "Choice: Users" ? "Choice: Repos" : "Choice: Users";
});

// Form submission event listener to conduct the search operation based on the toggle state
form.addEventListener("submit", (e) => {
  e.preventDefault();
  userList.textContent = "";  // Clear existing user list contents
  reposList.textContent = ""; // Clear existing repository list contents

  // Determine search context (user or repository) and execute the appropriate fetch call
  if(toggle.innerText==="Choice: Users"){ // User search
    fetch(`https://api.github.com/search/users?q=${input.value}`, {
    method: "GET",
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
  })
    .then((res) => res.json())
    .then((data) => // Iterate over the search results and display each user
      data.items.forEach((item) => {
        let user = document.createElement("li");
        user.innerHTML = `
              <h1>username: <i>${item.login}</i></h1>
              <a href=${item.html_url}>Visit profile </a>
              <button id=${item.id}>View repositories </button>
              <br>
              <img src=${item.avatar_url} alt="avatar" width="400">
              <hr>
              `;
        userList.appendChild(user); // Append the user element to the user list

        displayRepos(item.id, item.login); // Fetch and display repositories for this user
      })
    );
  }
  else { // Repository search
    fetch(`https://api.github.com/search/repositories?q=${input.value}`, {
    method: "GET",
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
  })
    .then((res) => res.json())
    .then((data) => // Iterate over the search results and display each repository
      data.items.forEach((item) => {
        let repo = document.createElement("li");
        repo.innerHTML = `
              <h1>Repository name: <i>${item.name}</i></h1>
              <h2>Owner: ${item.owner.login}</h2>
              <a href=${item.html_url}>Visit repo </a>
              <hr>

              `;
        reposList.appendChild(repo); // Append the repo element to the repository list
      })
    );
  }

});

// Display repositories for a given user
// This function is triggered by clicking the "View repositories" button next to each user
function displayRepos(id, login) {
  let reposButton = document.getElementById(id);
  reposButton.addEventListener("click", () => {
    reposList.textContent = ""; // Clear existing repository list contents

    // Fetch and display the repositories for the chosen user
    fetch(`https://api.github.com/users/${login}/repos`, {
      method: "GET",
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    })
      .then((res) => res.json())
      .then((data) =>
        data.forEach((item) => {
          let repo = document.createElement("li");
          repo.innerHTML = `

                      <h2><a href=${item.html_url}>${item.name}</a></h2>

                  `;
          reposList.appendChild(repo); // Append repository element to the list
        })
      );
  });
}