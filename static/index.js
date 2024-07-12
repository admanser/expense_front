const HOST = "localhost"
const PORT = 8000
const apiUrl = `http://${HOST}:${PORT}/api/expense/`
//const apiUrl = 'http://127.0.0.1:8000/api/expense/'

// GET // 

const btnGet = document.getElementById("btn-get"); // Obtenemos la referencia al botón de obtención de datos

// Añadimos el listener para el botón de obtención de datos
btnGet.addEventListener("click", () => {
  fetch(apiUrl)
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok ' + res.statusText);
      }
      console.log(res);
      return res.json();
    })
    .then(data => {
      let container = document.getElementById("expenseData");
      container.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevos registros de gastos
      createHeader(container); // Crea la primer linea con los titulos de los campos
      data.forEach(exp => {
        let expense = new Expense(exp); // Crear instancia de la clase Expense
        container.appendChild(expense.createDiv()); // Agregar el div del expense al contenedor
      });
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
});

function createHeader(container) {
  const headers = ['ID', 'Category', 'Detail', 'Currency', 'Amount', 'Date'];
  const headerDiv = document.createElement('div');
  headerDiv.classList.add('expense-header');
  headers.forEach(header => {
    const div = document.createElement('div');
    div.textContent = header;
    headerDiv.appendChild(div);
  });
  container.appendChild(headerDiv);
}

class Expense {
  constructor({ id, category, expense_detail, currency, amount, date }) {
    this.id = id;
    this.category = category;
    this.expense_detail = expense_detail;
    this.currency = currency;
    this.amount = amount;
    this.date = date;
  }

  // Método para crear un div con los detalles del gasto
  createDiv() {
    const fragment = document.createDocumentFragment();

    const id = document.createElement('div');
    id.textContent = this.id;
    fragment.appendChild(id);

    const category = document.createElement('div');
    category.textContent = this.category;
    fragment.appendChild(category);

    const detail = document.createElement('div');
    detail.textContent = this.expense_detail;
    fragment.appendChild(detail);

    const currency = document.createElement('div');
    currency.textContent = this.currency;
    fragment.appendChild(currency);

    const amount = document.createElement('div');
    amount.textContent = this.amount;
    fragment.appendChild(amount);

    const date = document.createElement('div');
    date.textContent = this.date;
    fragment.appendChild(date);

    const itemContainer = document.createElement('div');
    itemContainer.classList.add('expense-item');
    itemContainer.appendChild(fragment);

    return itemContainer;
  }
}


// POST //

const btnPostForm = document.getElementById("btn-post-form"); // Selección del botón para mostrar el formulario
const btnCloseForm = document.getElementById("btn-close-form"); // Selección del botón para ocultar el formulario
const formSection = document.getElementById("charge_expense"); // Selección de la seccion formulario

btnPostForm.addEventListener("click", () => {
  formSection.style.display = "block"; // Cambiar el estilo del formulario para mostrarlo
});

btnCloseForm.addEventListener("click", () => {
  formSection.style.display = "none"; // Cambiar el estilo del formulario para ocultarlo
});

const btnPost = document.getElementById("btn-post") // Obtenemos la referencia al botón de envío del formulario

function addExpense() {
  // Definimos la función para agregar un gasto
  const form = document.getElementById('charge_expense_form');
  const formData = new FormData(form);

  // Construimos el objeto de gastos a partir de los datos del formulario
  const expense = {
    category: formData.get('category'),
    expense_detail: formData.get('expense_detail'),
    currency: formData.get('currency'),
    amount: parseFloat(formData.get('amount')),
    date: formData.get('date')
  };

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(expense) // Convertimos el objeto de gastos a JSON
  })
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok ' + res.statusText);
      }
      return res.json();
    })
    .then(data => {
      alert('Expense added successfully!');
      console.log(data);
      form.reset(); // Limpiamos el formulario después de enviar los datos
      // fetchExpenses(); // Llamamos a una función para actualizar la lista de gastos (si existe)
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
      alert('There was an error adding the expense. Please try again.');
    });
}

// Añadimos el listener para el botón de envío del formulario
btnPost.addEventListener("click", (e) => {
  e.preventDefault(); // Evitamos el comportamiento predeterminado de enviar el formulario y recargar la página
  addExpense(); // Llamamos a la función para agregar el gasto
});


// PUT //

const btnPutForm = document.getElementById("btn-put-form"); // Selección del botón para mostrar el formulario
const btnClosePutForm = document.getElementById("btn-close-put-form"); // Selección del botón para ocultar el formulario
const formPutSection = document.getElementById("update_expense"); // Selección de la seccion formulario

btnPutForm.addEventListener("click", () => {
  formPutSection.style.display = "block"; // Mostrar el formulario de actualización
});

btnClosePutForm.addEventListener("click", () => {
  formPutSection.style.display = "none"; // Ocultar el formulario de actualización
});

const btnPut = document.getElementById("btn-put"); // Obtenemos la referencia al botón de envío del formulario de actualización

function updateExpense() {
  const form = document.getElementById("update_expense_form");
  const formData = new FormData(form);
  const expenseId = formData.get("expense_id");

  const updatedExpense = {
    category: formData.get("category"),
    expense_detail: formData.get("expense_detail"),
    currency: formData.get("currency"),
    amount: parseFloat(formData.get("amount")),
    date: formData.get("date"),
  };

  fetch(`${apiUrl}${expenseId}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedExpense),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok " + res.statusText);
      }
      return res.json();
    })
    .then(() => {
      alert("Expense updated successfully!");
      form.reset(); // Limpiamos el formulario después de enviar los datos
      //fetchExpenses(); // Opcional: Llamamos a una función para actualizar la lista de gastos
      formPutSection.style.display = "none"; // Ocultamos el formulario después de actualizar
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
      alert("There was an error updating the expense. Please try again.");
    });
}

formPutSection.addEventListener("submit", function (event) {
  event.preventDefault();
  updateExpense();
});


// DELETE //

<<<<<<< HEAD
const btnDeleteExpense = document.getElementById("btn-delete"); // Selección del botón para eliminar un gasto

// btnDeleteExpense.addEventListener("click", () => {
//   formSection.style.display = "none"; // Cambiar el estilo del formulario para ocultarlo
// });

function deleteExpense() {
  const expenseId = prompt("Enter Expense ID to delete:");
=======
const btnDeleteForm = document.getElementById("btn-delete-form"); // Selección del botón para mostrar el formulario
const btnCloseDeleteForm = document.getElementById("btn-close-delete-form"); // Selección del botón para ocultar el formulario
const formDeleteSection = document.getElementById("delete_expense"); // Selección de la seccion formulario
const Deleteform = document.getElementById("Delete_expense_form"); // Selección del formulario
>>>>>>> 862a0fe5eb7462c52054d21bda332cb7e73ad262

btnDeleteForm.addEventListener("click", () => {
  formDeleteSection.style.display = "block"; // Cambiar el estilo del formulario para mostrarlo
});

btnCloseDeleteForm.addEventListener("click", () => {
  formDeleteSection.style.display = "none"; // Cambiar el estilo del formulario para ocultarlo
});

const btnDelete = document.getElementById("btn-delete") // Obtenemos la referencia al botón de envío del formulario

// Definimos la función para eleminar un registro de gasto
function deleteExpense() {
  let form = document.getElementById('delete_expense_form');
  let formData = new FormData(form);
  let expenseId = formData.get('expense_id');

  fetch(`${apiUrl}${expenseId}/`, {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json'
      }
  })
<<<<<<< HEAD
    .then(response => {
      alert('Expense deleted!');
      //fetchExpenses();
    });
=======
  .then(res => {
      if (!res.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
      }
      alert('Expense deleted successfully!');
      form.reset(); // Limpiamos el formulario después de enviar los datos
      //fetchExpenses(); // Llamamos a una función para actualizar la lista de gastos
  })
  .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
      alert('There was an error deleting the expense. Please try again.');
  });
>>>>>>> 862a0fe5eb7462c52054d21bda332cb7e73ad262
}

// Añadimos el listener para el botón de envío del formulario
btnDelete.addEventListener("click", (e) => {
  e.preventDefault(); // Evitamos el comportamiento predeterminado de enviar el formulario y recargar la página
 deleteExpense(); // Llamamos a la función para borrar el gasto
});


// ACCIONES PARA LA PIZARRA //

const btnCleanBoard = document.getElementById("btn-clean-board"); // Selección del botón para borrar la pizarra

btnCleanBoard.addEventListener("click", () => {
  let container = document.getElementById("expenseData");
  container.innerHTML = '';
});