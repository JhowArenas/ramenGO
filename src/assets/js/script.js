const options = {
  broth: [
    {
      name: "salt",
      desc: "Simple like the seawater, nothing more ",
      price: 10,
    },
    {
      name: "shoyu",
      desc: "The good old and traditional soy sauce ",
      price: 10,
    },
    {
      name: "miso",
      desc: "Paste made of fermented soybeans",
      price: 10,
    },
  ],
  meat: [
    {
      name: "chasu",
      desc: "A sliced flavourful pork meat with a selection of season vegetables.",
      price: 10,
    },
    {
      name: "yasai_vegetarian",
      desc: "A delicious vegetarian lamen with a selection of season vegetables.",
      price: 10,
    },
    {
      name: "karaague",
      desc: "Three units of fried chicken, moyashi, ajitama egg and other vegetables.",
      price: 12,
    },
  ],
};

const getRamen = async (broth, meat) => {
  try {
    const response = await fetch(
      `https://front-br-challenges.web.app/api/v1/ramen-go/?meat=${meat}&broth=${broth}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return "Oops! Something went wrong.";
  }
};

const createMenu = () => {
    options.broth.forEach((item) => {
      const elItems = document.createElement("li");
      elItems.id = item.name;
      elItems.classList.add("card-item");
      elItems.innerHTML = `<img src="./src/assets/images/icons/${
        item.name
      }/inactive.svg" alt="Salt Image">
        <h3 class="card-item__title">${item.name.replace("_", " ")}</h3>
        <p class="card-item__sub-title">${item.desc}</p>
        <p class="card-item__price">US$ ${item.price}</p>`;

      document.querySelector("#broth-options.card-list").appendChild(elItems);
    });
    options.meat.forEach((item) => {
      const elItems = document.createElement("li");
      elItems.id = item.name;
      elItems.classList.add("card-item");
      elItems.innerHTML = `<img src="./src/assets/images/icons/${
        item.name
      }/inactive.svg" alt="Salt Image">
        <h3 class="card-item__title">${item.name.replace("_", " ")}</h3>
        <p class="card-item__sub-title">${item.desc}</p>
        <p class="card-item__price">US$ ${item.price}</p>`;
      document.querySelector("#meat-options.card-list").appendChild(elItems);
    });

    optionChangeState();
  },
  sendOrderAct = async () => {
    // Get the click event on button to send the request
    const opSelect = { broth: "", meat: "" };

    document.querySelectorAll(".card-item.active").forEach((item) => {
      item.parentElement.id === "broth-options"
        ? (opSelect.broth = item.id)
        : (opSelect.meat = item.id);
    });

    const ramen =
      opSelect.broth != "" && opSelect.meat != ""
        ? await getRamen(opSelect.broth, opSelect.meat)
        : "";

    document.querySelector(".al-missingopt") != null
      ? document.querySelector(".al-missingopt").remove()
      : "";

    if (ramen == "") {
      const elMOP = document.createElement("p");
      elMOP.classList.add("al-missingopt");
      elMOP.classList.add("c-red");
      elMOP.innerHTML = `Select your ramen ${
        opSelect.broth != ""
          ? "meat"
          : opSelect.meat != ""
          ? "broth"
          : "broth and meat"
      }`;
      document.querySelector(".bt-send").after(elMOP);
    } else {
      const modal = document.querySelector(".order-send");
      modal.querySelector("img").src = ramen.data.image;
      modal.querySelector(".food-name").innerText = ramen.data.name;

      window.scrollTo({ top: 0, behavior: "smooth" });
      document.querySelector("body").classList.add("modal-open");
    }
  },
  closeOrderAct = () => {
    document.querySelector("body").classList.remove("modal-open");
    
    const modal = document.querySelector(".order-send");
    modal.querySelector("img").src = "";
    modal.querySelector(".food-name").innerText = "";

    document.querySelectorAll(".card-item.active").forEach((item) => {
      item.classList.remove("active");
      item.querySelector("img").src = item
        .querySelector("img")
        .src.replace("active", "inactive");
    });
  },
  optionChangeState = (e) => {
    // Get the click event on the options (broth and meat)
    document.querySelectorAll(".card-item").forEach((el) => {
      el.addEventListener("click", function () {
        const that = this;
        document.querySelector(".al-missingopt") != null
          ? document.querySelector(".al-missingopt").remove()
          : "";

        document
          .querySelectorAll(`#${this.parentElement.id} .card-item`)
          .forEach((el) => {
            if (el !== that) {
              el.classList.remove("active");
              el.querySelector("img").src.includes("inactive")
                ? ""
                : (el.querySelector("img").src = el
                    .querySelector("img")
                    .src.replace("active", "inactive"));
            } else {
              that.classList.toggle("active");
              const img = that.querySelector("img");
              img.src.includes("inactive")
                ? (img.src = img.src.replace("inactive", "active"))
                : (img.src = img.src.replace("active", "inactive"));
            }
          });
      });
    });
  };

const handleClick = async (action) => {
 action == 'sendOrder' ? sendOrderAct() : 
 action == 'closeOrder' ? closeOrderAct() : ''
}

  

document.addEventListener("DOMContentLoaded", () => {
  createMenu();
  document.getElementById("make-order").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
  });
});
