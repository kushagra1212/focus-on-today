(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const goals = {
      inputValues: JSON.parse(localStorage.getItem("goals")) ?? [
        { checked: false, value: "" },
        { checked: false, value: "" },
        { checked: false, value: "" },
      ],
      updateValue: function (index, value) {
        this.inputValues[index] = {
          checked: this.inputValues[index]?.checked ?? false,
          value: value,
        };
        localStorage.setItem("goals", JSON.stringify(this.inputValues));
      },
      getValue: function (index) {
        return this.inputValues[index]?.value;
      },
      updateChecked: function (index, checked) {
        this.inputValues[index] = {
          checked,
          value: this.inputValues[index]?.value ?? "",
        };
        localStorage.setItem("goals", JSON.stringify(this.inputValues));
      },
      get: function (index) {
        return this.inputValues[index];
      },
      getCheckedCount: function () {
        let count = 0;
        this.inputValues.forEach((item) => {
          if (item?.checked) count++;
        });

        return count;
      },
    };

    const cardBodyList = document.querySelector(".card__body__list");
    const cardBodyError = document.querySelector(".card__body__error");
    const cardBodyProgressBar = document.querySelector(
      ".card__body__progress__bar"
    );
    const cardBodyProgressBarLabel = document.querySelector(
      ".card__body__progress__bar__label"
    );

    function populateGoalsFromLocalStorage() {
      for (let i = 0; i < cardBodyList.children.length; i++) {
        cardBodyList.children[i].children[1].value = goals.get(i)?.value ?? "";
        cardBodyList.children[i].children[0].checked =
          goals.get(i)?.checked ?? false;

        updateCheckedUI(i, cardBodyList.children[i].children[0].checked);
      }

      updateProgress();
    }
    populateGoalsFromLocalStorage();
    function updateProgress() {
      const checkedCount = goals.getCheckedCount();
      if (checkedCount) {
        cardBodyProgressBar.style = `opacity:1;width:${
          (checkedCount / goals.inputValues.length) * 100
        }%;`;
        cardBodyProgressBarLabel.textContent = `${checkedCount} / ${goals.inputValues.length} Completed`;
      } else {
        cardBodyProgressBar.style = `opacity:0;`;
        cardBodyProgressBarLabel.textContent = ``;
      }
    }

    cardBodyList.addEventListener("input", (e) => {
      for (let i = 0; i < cardBodyList.children.length; i++) {
        if (
          cardBodyList.children[i] === e.target.parentNode &&
          e.target.type === "text"
        ) {
          goals.updateValue(i, e.target.value);
          updateProgress();
        }
      }
    });

    function updateCheckedUI(i, checked) {
      if (checked) {
        goals.updateChecked(i, true);
        cardBodyList.children[i].children[1].classList.add(
          "card__body__list__item_text--strike"
        );
        cardBodyList.children[i].children[1].disabled = true;
      } else {
        goals.updateChecked(i, false);
        cardBodyList.children[i].children[1].disabled = false;
        cardBodyList.children[i].children[1].classList.remove(
          "card__body__list__item_text--strike"
        );
      }
    }
    cardBodyList.addEventListener("click", (e) => {
      for (let i = 0; i < cardBodyList.children.length; i++) {
        if (cardBodyList.children[i] === e.target.parentNode) {
          if (e.target.checked && !goals.getValue(i)) {
            e.target.checked = false;
            cardBodyError.classList.add("card__body__error--occurred");
            setTimeout(
              () =>
                cardBodyError.classList.remove("card__body__error--occurred"),
              3000
            );
            return;
          }

          updateCheckedUI(i, e.target.checked);
        } else if (cardBodyList.children[i] == e.target) {
          cardBodyList.children[i].children[1].focus();
        }
      }

      updateProgress();
    });
  });
})();
