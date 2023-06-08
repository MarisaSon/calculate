const deleteButtons = document.querySelectorAll(".delete");
const addButton = document.querySelector("#add");
const persons = document.querySelector("#persons");
const calculateButton = document.querySelector("#calculate");
const result = document.querySelector("#result");

addButton.addEventListener("click", function (e) {
  e.preventDefault();

  const div = document.createElement("div");

  const inputName = document.createElement("input");
  inputName.setAttribute("type", "text");
  inputName.setAttribute("placeholder", "Имя");
  inputName.classList.add("name");

  const inputSum = document.createElement("input");
  inputSum.setAttribute("type", "number");
  inputSum.setAttribute("placeholder", "Сумма");
  inputSum.classList.add("sum");

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete");
  deleteButton.innerText = "Убрать человека";


  div.appendChild(inputName);
  div.appendChild(inputSum);
  div.appendChild(deleteButton);
  persons.appendChild(div);

  deleteButton.addEventListener("click", deleteRow);
});

deleteButtons.forEach(function (item) {
  item.addEventListener("click", deleteRow);
});

function deleteRow(e) {
  e.preventDefault();
  const div = e.target.parentNode;
  persons.removeChild(div);
}

calculateButton.addEventListener("click", function (e) {
  e.preventDefault();
  result.innerHTML = "";

  const inputs = persons.querySelectorAll("input");
  const inputsArray = Array.from(inputs);
  const checkResult = inputsArray.every(function (input) {
    if (input.value == "") {
      return false;
    }
    return true;
  });
  if (checkResult == false) {
    Swal.fire({
      icon: "error",
      title: "Ошибка!",
      text: "Заполните все поля!",
    });
  }

  const items = [];
  persons.querySelectorAll("div").forEach(function (div) {
    const name = div.querySelector(".name").value;
    const sum = div.querySelector(".sum").value;
    const personData = {
      name: name,
      sum: Number(sum),
    };
    items.push(personData);
  });

  let totalSum = 0;
  items.forEach(function (item) {
    totalSum += item.sum;
  });
  const sumPerPerson = totalSum / items.length;

  const overPaid = items.filter(function (personData) {
    return personData.sum > sumPerPerson;
  });
  const lessPaid = items.filter(function (personData) {
    return personData.sum < sumPerPerson;
  });

  const resultTransactions = [];
  lessPaid.forEach(function (lessPaidPerson) {
    let needToPaySum = sumPerPerson - lessPaidPerson.sum;
    overPaid.forEach(function (overPaidPerson) {
      const overPaidSum = overPaidPerson.sum - sumPerPerson;
      if (needToPaySum == 0 || overPaidSum == 0) {
        return;
      }

      if (needToPaySum >= overPaidSum) {
        const transaction = {
          from: lessPaidPerson.name,
          to: overPaidPerson.name,
          sum: overPaidSum.toFixed(2),
        };
        resultTransactions.push(transaction);

        needToPaySum -= overPaidSum;
        overPaidPerson.sum = sumPerPerson;
      } else {
        const transaction = {
          from: lessPaidPerson.name,
          to: overPaidPerson.name,
          sum: needToPaySum.toFixed(2),
        };
        resultTransactions.push(transaction);

        overPaidPerson.sum -= needToPaySum;
        needToPaySum = 0;
      }
    });
  });

  resultTransactions.forEach(function (transaction) {
    const transactionRow = document.createElement('span');
    transactionRow.innerHTML = transaction.from + " 🡆 " + transaction.to + ": " + transaction.sum + "<br />";
    result.appendChild(transactionRow)
  });

});
