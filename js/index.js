const form = document.getElementById("github-form"); 
const input = document.getElementById("search");
const userList = document.getElementById("user-list");
const reposList = document.getElementById("repos-list");
const toggle = document.getElementById("toggle");

//Event listener to keep track of whether user wants to search for users or repos
toggle.addEventListener("click", () => {
  toggle.textContent = toggle.innerText === "Choice: Users" ? "Choice: Repos" : "Choice: Users";
});

//Event listener on the form to fetch the data from either the user or repo endpoints depending on choice
form.addEventListener("submit", (e) => {
  e.preventDefault();
  userList.textContent = "";  //clears the lists first before new results are fetched and displayed
  reposList.textContent = "";


  //check choice first before deciding which endpoint to use
  if(toggle.innerText==="Choice: Users"){ //searching for specific user
    fetch(`https://api.github.com/search/users?q=${input.value}`, {
    method: "GET",
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
  })
    .then((res) => res.json())
    .then((data) =>
      data.items.forEach((item) => {    //loop through data then add to the dom
        let user = document.createElement("li");
        user.innerHTML = `
              <h1>username: <i>${item.login}</i></h1>
              <a href=${item.html_url}>Visit profile </a>
              <button id=${item.id}>View repositories </button>
              <br>
              <img src=${item.avatar_url} alt="avatar" width="400">
              <hr>
              `;
        userList.appendChild(user); //append user data to the userlist

        //Passes the id and login parameters to the displayRepos function to use in user repo fetching
        displayRepos(item.id, item.login); 
      })
    );
  }
  else{  //Searching for specific repo
    fetch(`https://api.github.com/search/repositories?q=${input.value}`, {
    method: "GET",
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
  })
    .then((res) => res.json())
    .then((data) =>
      data.items.forEach((item) => {
        let repo = document.createElement("li");
        repo.innerHTML = `
              <h1>Repository name: <i>${item.name}</i></h1>
              <h2>Owner: ${item.owner.login}</h2>
              <a href=${item.html_url}>Visit repo </a>
              <hr>

              `;
        reposList.appendChild(repo);
      })
    );

  }
  
});

//function that handles gets the user's repositories by using passed in parameters from username endpoint
function displayRepos(id, login) {
  let reposButton = document.getElementById(id); 
  reposButton.addEventListener("click", () => {
    reposList.textContent = "";

    fetch(`https://api.github.com/users/${login}/repos`, {
      method: "GET",
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        data.forEach((item) => {
          let repo = document.createElement("li");
          repo.innerHTML = `
                      
                      <h2><a href=${item.html_url}>${item.name}</a></h2>
  
                  `;
          reposList.appendChild(repo);
        });
      });
  });
}
