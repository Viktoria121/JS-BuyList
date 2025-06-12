document.addEventListener("DOMContentLoaded", () => {
	const input = document.querySelector(".product-adding-item input");
	const addBtn = document.querySelector(".product-adding-item button");
	const list = document.querySelector(".main-first-items");
	const statsNeed = document.querySelector(".need-to-buy");
	const statsBought = document.querySelector(".bought");

	function setupProduct(item) {
		const nameInput = item.querySelector(".product");
		let countDisplay = item.querySelector(".count");
		let count = parseInt(countDisplay.textContent);
		const subBtn = item.querySelector(".subtraction");
		const addBtn = item.querySelector(".adding");
		const buyBtn = item.querySelector(".buy");
		const cancelBtn = item.querySelector(".cancel-button");

		// Заборонити редагування, якщо куплено
		if (nameInput.dataset.bought === "true") {
			nameInput.readOnly = true;
			//nameInput.classList.add("crossed");
		}

		if (subBtn) {
			subBtn.addEventListener("click", () => {
				if (count > 1) {
					count--;
					countDisplay.textContent = count;
					if (count === 1) {
						subBtn.disabled = true;
						subBtn.id = "only-one";
					}
					updateCountProduct(nameInput.value.trim());
				}
			});
		}

		if (addBtn) {
			if(nameInput.dataset.bought === "true"){
				const addOrSub = item.querySelector(".add-or-sub");
				addOrSub.innerHTML = "";
				const newCount = document.createElement("span");
				newCount.className = "count";
				newCount.textContent = count;
				addOrSub.append(newCount);
				countDisplay = newCount;
			}
			addBtn.addEventListener("click", () => {
				count++;
				countDisplay.textContent = count;
				if (subBtn.disabled = true) {
					subBtn.disabled = false;
					subBtn.removeAttribute("id");
				}
				updateCountProduct(nameInput.value.trim());
			});
		}

		if (buyBtn) {
			buyBtn.addEventListener("click", () => {

				if (nameInput.dataset.bought === "false") {
					// Позначити як куплено
					nameInput.dataset.bought = "true";
					nameInput.readOnly = true;
					nameInput.classList.add("crossed");

					// Заміна +/- на просто лічильник
					const addOrSub = item.querySelector(".add-or-sub");
					addOrSub.innerHTML = "";
					addOrSub.append(countDisplay);

					// Заміна кнопок на одну
					const actions = item.querySelector(".buy-or-cancel");
					actions.innerHTML = "";
					buyBtn.textContent = "Скасувати купівлю";
					buyBtn.setAttribute("data-tooltip", "Ви придбали цей товар");
					actions.append(buyBtn);
				} 
				else {
					// Позначити як не куплено
					nameInput.dataset.bought = "false";
					nameInput.readOnly = false;
					nameInput.classList.remove("crossed");

					// Відновлення +/- кнопок
					const addOrSub = item.querySelector(".add-or-sub");
					addOrSub.innerHTML = "";
					addOrSub.append(subBtn, countDisplay, addBtn);

					// Відновлення кнопки "×"
					const actions = item.querySelector(".buy-or-cancel");
					actions.innerHTML = "";
					buyBtn.textContent = "Купити";
					actions.append(buyBtn, cancelBtn);
					buyBtn.setAttribute("data-tooltip", "Придбати цей товар");
				}
				updateStats();
			});
		}

		if (cancelBtn) {
			if(nameInput.dataset.bought === "true"){
				const actions = item.querySelector(".buy-or-cancel");
				actions.innerHTML = "";
				actions.append(buyBtn); 
			}
			cancelBtn.addEventListener("click", () => {
				item.remove();
				updateStats();
			});
		}

		nameInput.addEventListener("click", () => {
			if (nameInput.dataset.bought === "false") {
				nameInput.readOnly = false;
			}
		});

		nameInput.addEventListener("blur", () => {
			nameInput.readOnly = true;
			updateStats();
		});
	}

	function createProduct(name, count = 1) {
		const item = document.createElement("div");
		item.className = "first-table-items";

		const nameInput = document.createElement("input");
		nameInput.type = "text";
		nameInput.className = "product";
		nameInput.value = name;
		nameInput.dataset.bought = "false";

		const countContainer = document.createElement("span");
		countContainer.className = "add-or-sub";

		const countDisplay = document.createElement("span");
		countDisplay.className = "count";
		countDisplay.textContent = count;

		const subBtn = document.createElement("button");
		subBtn.className = "subtraction";
		subBtn.textContent = "–";
		subBtn.setAttribute("data-tooltip", "Зменшити кількість");
		subBtn.id = "only-one";

		const addBtn = document.createElement("button");
		addBtn.className = "adding";
		addBtn.textContent = "+";
		addBtn.setAttribute ("data-tooltip", "Збільшити кількість");

		countContainer.append(subBtn, countDisplay, addBtn);

		const actionContainer = document.createElement("span");
		actionContainer.className = "buy-or-cancel";

		const buyBtn = document.createElement("button");
		buyBtn.className = "buy";
		buyBtn.textContent = "Купити";
		buyBtn.setAttribute("data-tooltip", "Придбати цей товар");

		const cancelBtn = document.createElement("button");
		cancelBtn.className = "cancel-button";
		cancelBtn.textContent = "×";
		buyBtn.setAttribute("data-tooltip", "Видалити товар із списку");

		actionContainer.append(buyBtn, cancelBtn);

		item.append(nameInput, countContainer, actionContainer);
		list.append(item);

		setupProduct(item);
		updateStats();
	}

	function updateStats() {
		statsNeed.innerHTML = "";
		statsBought.innerHTML = "";

		document.querySelectorAll(".first-table-items").forEach(item => {
			const nameInput = item.querySelector(".product");
			const name = nameInput.value.trim();
			const count = parseInt(item.querySelector(".count").textContent);
			const isBought = nameInput.dataset.bought === "true";

			const statItem = document.createElement("span");
			statItem.className = "product-name";

			const amountSpan = document.createElement("span");
			amountSpan.className = "amount";
			amountSpan.textContent = count;

			statItem.textContent = name + " ";
			statItem.appendChild(amountSpan);

			if (isBought) {
				statsBought.append(statItem);
			} else {
				statsNeed.append(statItem);
			}
		});
	}

	function updateCountProduct(name) {
		document.querySelectorAll(".first-table-items").forEach(item => {
			const nameInput = item.querySelector(".product");
			const productName = nameInput.value.trim();

			if (productName === name) {
				const count = item.querySelector(".count").textContent;
				const statItems = document.querySelectorAll(
					`.${nameInput.dataset.bought === "true" ? "bought" : "need-to-buy"} .product-name`
				);

				statItems.forEach(statItem => {
					const statName = statItem.childNodes[0].nodeValue.trim();
					if (statName === name) {
						const amountSpan = statItem.querySelector(".amount");
						if (amountSpan) {
							amountSpan.textContent = count;
						}
					}
				});
			}
		});
	}

	addBtn.addEventListener("click", () => {
		const value = input.value.trim();
		if (value !== "") {
			createProduct(value);
			input.value = "";
			input.focus();
		}
	});

	input.addEventListener("keypress", e => {
		if (e.key === "Enter") {
			addBtn.click();
		}
	});

	document.querySelectorAll(".first-table-items").forEach(item => {
		const nameInput = item.querySelector(".product");
		if (!nameInput.dataset.bought) {
			nameInput.dataset.bought = "false";
		}
		setupProduct(item);
	});

	updateStats();
});
