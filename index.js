let data = {};
let error_message;
const api = "https://randomuser.me/api/1.3/?";
let custom_enable = false;

let num_results;
let rb_male;
let rb_female;
let password_check_special;
let password_check_upper;
let password_check_lower;
let password_check_number;
let num_password_min;
let num_password_max;
let seed_input;
let num_page;

document.addEventListener("DOMContentLoaded", () => {
  num_results = document.getElementById("num_results");
  rb_male = document.getElementById("rb_male");
  rb_female = document.getElementById("rb_female");
  password_check_special = document.getElementById("password_check_special");
  password_check_upper = document.getElementById("password_check_upper");
  password_check_lower = document.getElementById("password_check_lower");
  password_check_number = document.getElementById("password_check_number");
  num_password_min = document.getElementById("num_password_min");
  num_password_max = document.getElementById("num_password_max");
  seed_input = document.getElementById("seed_input");
  num_page = document.getElementById("num_page");

  const spinner = document.getElementById("spinner");
  const btn = document.getElementById("search_button");
  const clear = document.getElementById("clear_button");

  changeFormEnabled();
  const form = document.getElementById("search_form");
  const custom = document.getElementById("custom");
  custom.addEventListener("change", () => {
    custom_enable = !custom_enable;
    changeFormEnabled();
  });

  clear.addEventListener("click", () => {
    clearForm();
    form.submit();
  });

  form.addEventListener("submit", async e => {
    error_message = "";

    e.preventDefault();
    spinner.style.display = "inline";
    btn.disabled = true;

    let query = getQuery();
    console.log(query);

    try {
      const response = await fetch(query);
      data = await response.json();
    } catch (e) {
      error_message = `fetch error: ${e.message}`;
    }

    btn.disabled = false;
    spinner.style.display = "none";
    render();
  })
});

function render()
{
  if (error_message)
  {
    const error = document.getElementById("error");
    error.innerText = error_message;
    return;
  }

  const result_list = document.getElementById("result_list");
  let result = "";

  for (let user of data.results)
  {
    result += getData(user);
  }
  result_list.innerHTML = result;
}

function getQuery()
{
  let query = api;
  if (custom_enable) {
    if (num_results.value)
      query += `results=${num_results.value}&`;

    if (rb_male.checked)
      query += "gender=male&"
    if (rb_female.checked)
      query += "gender=female&"

    let password = "";
    let charset = "";
    if (password_check_special.checked)
      charset += (charset === "" ? "special" : ",special");
    if (password_check_upper.checked)
      charset += (charset === "" ? "upper" : ",upper");
    if (password_check_lower.checked)
      charset += (charset === "" ? "lower" : ",lower");
    if (password_check_number.checked)
      charset += (charset === "" ? "number" : ",number");

    let length = "";
    if (num_password_min.value) {
      length += num_password_min.value;
    }
    if (num_password_max.value)
      length += (length === "" ? num_password_max.value : `-${num_password_max.value}`);

    password += charset;
    password += (password === "" ? length : `,${length}`);

    if (password)
      query += `password=${password}&`;

    if (seed_input.value)
      query += `seed=${seed_input.value}&`

    if (num_page.value)
      query += `page=${num_page.value}&`;
  }
  return query;
}

function getData(user)
{
  return result =
  `<li>
    <table class="user_table" border="2">
      <tr>
        <th colspan="7">RANDOM GENERATED USER</th>
      </tr>
      <tr>
        <th colspan="2">Main info</th>
        <th colspan="2">Online info</th>
        <th colspan="2">Location</th>
        <th>Picture</th>
      </tr>
      <tr>
        <td class="table_category_name">Title</td>
        <td>${(user.name.title ? user.name.title : "-")}</td>
        <td class="table_category_name">E-mail</td>
        <td>${(user.email ? user.email : "-")}</td>
        <td rowspan="2" class="table_category_name">Adress</td>
        <td rowspan="2">${user.location.state}, ${user.location.city}</td>
        <td rowspan="5"><img src="${user.picture.large}"></td>
      </tr>
      <tr>
        <td class="table_category_name">First</td>
        <td>${user.name.first}</td>
        <td class="table_category_name">Login</td>
        <td>${user.login.username}</td>
      </tr>
      <tr>
        <td class="table_category_name">Last</td>
        <td>${user.name.last}</td>
        <td class="table_category_name">Password</td>
        <td>${user.login.password}</td>
        <td class="table_category_name">Postcode</td>
        <td>${user.location.postcode}</td>
      </tr>
      <tr>
        <td class="table_category_name">Gender</td>
        <td>${user.gender}</td>
        <td class="table_category_name">Date of register</td>
        <td>${user.registered.date}</td>
        <td class="table_category_name">Coordinates</td>
        <td>${(user.location.coordinates.latitude)}, ${user.location.coordinates.longitude}</td>
      </tr>
      <tr>
        <td class="table_category_name">Date of birth</td>
        <td>${user.dob.date}</td>
        <td class="table_category_name">Phone</td>
        <td>${user.phone}</td>
        <td class="table_category_name">Timezone</td>
        <td>${user.location.timezone.description}, ${user.location.timezone.offset}</td>
      </tr>
    </table>
  </li>`;
}

function changeFormEnabled()
{
  num_results.disabled = !num_results.disabled;
  rb_male.disabled = !rb_male.disabled;
  rb_female.disabled = !rb_female.disabled;
  password_check_special.disabled = !password_check_special.disabled;
  password_check_upper.disabled = !password_check_upper.disabled;
  password_check_lower.disabled = !password_check_lower.disabled;
  password_check_number.disabled = !password_check_number.disabled;
  num_password_min.disabled = !num_password_min.disabled;
  num_password_max.disabled = !num_password_max.disabled;
  seed_input.disabled = !seed_input.disabled;
  num_page.disabled = !num_page.disabled;
}

function clearForm()
{
  num_results.value = null;
  rb_male.checked = 0;
  rb_female.checked = 0;
  password_check_special.checked = 0;
  password_check_upper.checked = 0;
  password_check_lower.checked = 0;
  password_check_number.checked = 0;
  num_password_min.value = null;
  num_password_max.value = null;
  seed_input.value = null;
  num_page.value = null;
}
