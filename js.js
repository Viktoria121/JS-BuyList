document.addEventListener("DOMContentLoaded", () => {
	const input = document.querySelector(".product-adding-item input");
	const addBtn = document.querySelector(".product-adding-item button");
	const list = document.querySelector(".main-first-items");
	const statsNeed = document.querySelector(".need-to-buy");
	const statsBought = document.querySelector(".bought");

	// Додає функціонал до одного елемента продукту
	function setupProduct(item) {
		const nameInput = item.querySelector(".product");
		let countDisplay = item.querySelector(".count");
		let count = parseInt(countDisplay.textContent);
		const subBtn = item.querySelector(".subtraction");
		const addBtn = item.querySelector(".adding");
		const buyBtn = item.querySelector(".buy");
		const cancelBtn = item.querySelector(".cancel-button");

        nameInput.value = nameInput.placeholder;
        if(nameInput.id){nameInput.readOnly = true;}

		if (subBtn) {
			subBtn.addEventListener("click", () => {
				if (count > 1) {
					count--;
					countDisplay.textContent = count;
					updateStats();
					if (count === 1) {
						subBtn.disabled = true;
						subBtn.id = "only-one";
					}
				}
			});
			if (count === 1) {
				subBtn.disabled = true;
				subBtn.id = "only-one";
			}
		}

		if (addBtn) {
			addBtn.addEventListener("click", () => {
				count++;
				countDisplay.textContent = count;
				if (subBtn) {
					subBtn.disabled = false;
					subBtn.removeAttribute("id");
                    updateStats();
				}
			});
		}

		if (buyBtn) {
        buyBtn.addEventListener("click", () => {
            isBuying = buyBtn.textContent === "Купити";

            if (isBuying) {
                // Позначаємо товар як куплений
                nameInput.classList.add("crossed");
                nameInput.readOnly = true;
                nameInput.id = "thickness";

                const subBtn = item.querySelector(".subtraction");
                const addBtn = item.querySelector(".adding");
                // Заміна кнопок +/- на просто число
                if ((subBtn && addBtn) ) {
                    const span = document.createElement("span");
                    span.className = "count";
                    span.textContent = count;

                    item.querySelector(".add-or-sub").innerHTML = "";
                    item.querySelector(".add-or-sub").append(span);
                }

                // Заміна кнопок дій: тільки кнопка "Скасувати купівлю"
                const actions = item.querySelector(".buy-or-cancel");
                if (actions) {
                    actions.innerHTML = "";
                    actions.append(buyBtn);
                }
                buyBtn.textContent = "Скасувати купівлю";

            } else {
                // Повертаємо до стану "не куплено"
                nameInput.classList.remove("crossed");
                nameInput.readOnly = false;
                nameInput.removeAttribute("id");

                // Відновлюємо кнопки +/- та лічильник
                const addOrSub = item.querySelector(".add-or-sub");
                if (addOrSub) {
                    let newSubBtn = item.querySelector(".subtraction");
                    let newAddBtn = item.querySelector(".adding");

                    addOrSub.innerHTML = "";

                    if (newSubBtn && newAddBtn && countDisplay) {
                        // Якщо кнопки вже є в DOM — використовуємо їх
                        addOrSub.append(newSubBtn, countDisplay, newAddBtn);
                    } else {
                        
                        nameInput.readOnly="true";
                        // Якщо немає — створюємо кнопки

                        if (!newSubBtn) {
                            newSubBtn = document.createElement("button");
                            newSubBtn.className = "subtraction";
                            newSubBtn.textContent = "–";
                            newSubBtn.title = "Зменшити кількість";
                            if(countDisplay.textContent === "1") newSubBtn.id = "only-one";
                            newSubBtn.addEventListener("click", () => {
                                if (count > 1) {
                                    count--;
                                    countDisplay.textContent = count;
                                    updateStats();
                                    if (count === 1) {
                                        newSubBtn.disabled = true;
                                        newSubBtn.id = "only-one";
                                    }
                                }
                            });

                        }

                        if (!newAddBtn) {
                            newAddBtn = document.createElement("button");
                            newAddBtn.className = "adding";
                            newAddBtn.textContent = "+";
                            newAddBtn.title = "Збільшити кількість";
                            newAddBtn.addEventListener("click", () => {
                                count++;
                                countDisplay.textContent = count;
                                if (newSubBtn) {
                                    newSubBtn.disabled = false;
                                    newSubBtn.removeAttribute("id");
                                    updateStats();
                                }
                            });
                        }

                        // Додаємо елементи до DOM
                        addOrSub.append(newSubBtn, countDisplay, newAddBtn);
                    }
                }


                // Повертаємо кнопку видалення
                const actions = item.querySelector(".buy-or-cancel");
                if (actions) {
                    let newCancelBtn = item.querySelector(".cancel-button");
                    actions.innerHTML = "";
                    if(newCancelBtn){
                        actions.append(buyBtn, cancelBtn);
                    }
                    
                    if (!newCancelBtn) {
                        newCancelBtn = document.createElement("button");
                        newCancelBtn.className = "cancel-button";
                        newCancelBtn.textContent = "×";

                        newCancelBtn.addEventListener("click", () => {
                            item.remove();
                            updateStats();
                        });
                    }
                    actions.append(buyBtn, newCancelBtn);
                }
                buyBtn.textContent = "Купити";
            }

            updateStats();
        });
    }


		if (cancelBtn) {
			cancelBtn.addEventListener("click", () => {
				item.remove();
				updateStats();
			});
		}

		nameInput.addEventListener("click", () => {
			if (!nameInput.classList.contains("crossed")) {
				nameInput.readOnly = false;
			}
		});

		nameInput.addEventListener("blur", () => {
			nameInput.readOnly = true;
			updateStats();
		});
	}

	// Створює новий продукт і додає до списку
	function createProduct(name, count = 1) {
		const item = document.createElement("div");
		item.className = "first-table-items";

		const nameInput = document.createElement("input");
		nameInput.type = "text";
		nameInput.className = "product";
        nameInput.placeholder = name;
		nameInput.value = name;

		const countContainer = document.createElement("span");
		countContainer.className = "add-or-sub";

		const countDisplay = document.createElement("span");
		countDisplay.className = "count";
		countDisplay.textContent = count;

		const subBtn = document.createElement("button");
		subBtn.className = "subtraction";
		subBtn.textContent = "–";
		subBtn.title = "Зменшити кількість";

		const addBtn = document.createElement("button");
		addBtn.className = "adding";
		addBtn.textContent = "+";
		addBtn.title = "Збільшити кількість";

		countContainer.append(subBtn, countDisplay, addBtn);

		const actionContainer = document.createElement("span");
		actionContainer.className = "buy-or-cancel";

		const buyBtn = document.createElement("button");
		buyBtn.className = "buy";
		buyBtn.textContent = "Купити";

		const cancelBtn = document.createElement("button");
		cancelBtn.className = "cancel-button";
		cancelBtn.textContent = "×";

		actionContainer.append(buyBtn, cancelBtn);

		item.append(nameInput, countContainer, actionContainer);
		list.append(item);

		setupProduct(item);
		updateStats();
	}

	// Оновлює список куплених / некуплених
	function updateStats() {
		statsNeed.innerHTML = "";
		statsBought.innerHTML = "";

		document.querySelectorAll(".first-table-items").forEach(item => {
			const name = item.querySelector(".product").value.trim();
			const count = parseInt(item.querySelector(".count").textContent);
			const isBought = item.querySelector(".product").id

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

	// Обробка кнопки додавання
	addBtn.addEventListener("click", () => {
		const value = input.value.trim();
		if (value !== "") {
			createProduct(value);
			input.value = "";
			input.focus();
		}
	});

	// Enter додає товар
	input.addEventListener("keypress", e => {
		if (e.key === "Enter") {
			addBtn.click();
		}
	});

	// Підключити логіку до вже існуючих елементів у HTML
	document.querySelectorAll(".first-table-items").forEach(setupProduct);
	updateStats();
});
