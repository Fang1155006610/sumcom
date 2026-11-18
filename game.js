let numbers = [];
let target = 0;

let selectedNumbers = [];
let history = [];

let solution = [];


/* ===================================
   random number
=================================== */

function generatePuzzle() {

    numbers = [];
    history = [];
    selectedNumbers = [];

    document.getElementById("message").textContent = "";

    document.getElementById("hintBox").classList.add("hidden");

    let a = randomNumber(1, 12);
    let b = randomNumber(1, 12);
    let c = randomNumber(1, 12);
    let d = randomNumber(1, 12);

    let op1 = randomOperator();
    let op2 = randomOperator();
    let op3 = randomOperator();

    let result1 = calculate(a, b, op1);

    if (!Number.isInteger(result1)) {
        result1 = a + b;
        op1 = "+";
    }

    let result2 = calculate(result1, c, op2);

    if (!Number.isInteger(result2)) {
        result2 = result1 + c;
        op2 = "+";
    }

    let result3 = calculate(result2, d, op3);

    if (!Number.isInteger(result3) || result3 <= 0 || result3 > 100) {
        result3 = result2 + d;
        op3 = "+";
    }

    target = result3;

    numbers = [a, b, c, d];

    solution = [
        `${a} ${displayOperator(op1)} ${b} = ${result1}`,
        `${result1} ${displayOperator(op2)} ${c} = ${result2}`,
        `${result2} ${displayOperator(op3)} ${d} = ${result3}`
    ];

    renderNumbers();
    document.getElementById("target").textContent = target;
}


/* ===================================
   number
=================================== */

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/* ===================================
   operator
=================================== */

function randomOperator() {

    const operators = ["+", "-", "*", "/"];

    return operators[
        Math.floor(Math.random() * operators.length)
    ];
}


/* ===================================
   calculate
=================================== */

function calculate(a, b, operator) {

    if (operator === "+") {
        return a + b;
    }

    if (operator === "-") {
        return a - b;
    }

    if (operator === "*") {
        return a * b;
    }

    if (operator === "/") {

        if (b === 0) {
            return null;
        }

        return a / b;
    }
}


/* ===================================
   display operator
=================================== */

function displayOperator(operator) {

    if (operator === "*") {
        return "×";
    }

    if (operator === "/") {
        return "÷";
    }

    return operator;
}


/* ===================================
   display number
=================================== */

function renderNumbers() {

    const container = document.getElementById("numbers");

    container.innerHTML = "";

    numbers.forEach((number, index) => {

        const button = document.createElement("button");

        button.className = "number-button";

        button.textContent = number;

        button.dataset.index = index;

        button.onclick = function () {
            selectNumber(index);
        };

        container.appendChild(button);
    });

    updateExpression();
}


/* ===================================
   choose number
=================================== */

function selectNumber(index) {

    if (selectedNumbers.includes(index)) {
        selectedNumbers = selectedNumbers.filter(i => i !== index);
    } else {

        if (selectedNumbers.length >= 2) {
            selectedNumbers = [];
        }

        selectedNumbers.push(index);
    }

    updateSelectedButtons();

    updateExpression();
}


/* ===================================
   เปลี่ยนสีปุ่มที่เลือก
=================================== */

function updateSelectedButtons() {

    const buttons = document.querySelectorAll(".number-button");

    buttons.forEach((button, index) => {

        if (selectedNumbers.includes(index)) {
            button.classList.add("selected");
        } else {
            button.classList.remove("selected");
        }

    });
}


/* ===================================
   choose operator
=================================== */

function chooseOperator(operator) {

    if (selectedNumbers.length !== 2) {

        showMessage(
            "please choose number",
            "error"
        );

        return;
    }

    const index1 = selectedNumbers[0];
    const index2 = selectedNumbers[1];

    const number1 = numbers[index1];
    const number2 = numbers[index2];

    let result = calculate(
        number1,
        number2,
        operator
    );

    /*
        ห้ามหารด้วย 0
    */

    if (result === null) {

        showMessage(
            "can't divided by 0",
            "error"
        );

        return;
    }

    /*
        จำนวนเต็ม only
    */

    if (!Number.isInteger(result)) {

        showMessage(
            "result is an integer",
            "error"
        );

        return;
    }

    /*
        undo part
    */

    history.push({
        numbers: [...numbers]
    });

    const newNumbers = numbers.filter(
        (_, index) =>
            index !== index1 &&
            index !== index2
    );

    newNumbers.push(result);

    numbers = newNumbers;

    selectedNumbers = [];

    renderNumbers();

    showMessage("", "");

    /*
        check
    */

    if (numbers.length === 1) {

        if (numbers[0] === target) {

            showMessage(
                "🎉 !CORRECT!",
                "success"
            );

        } else {

            showMessage(
                `wrong the answer isn't ${numbers[0]}`,
                "error"
            );

        }
    }
}


/* ===================================
   Undo
=================================== */

function undo() {

    if (history.length === 0) {

        showMessage(
            "can't undo",
            "error"
        );

        return;
    }

    numbers = history.pop().numbers;

    selectedNumbers = [];

    renderNumbers();

    showMessage("", "");
}


/* ===================================
   แสดงสิ่งที่เลือก
=================================== */

function updateExpression() {

    const expression =
        document.getElementById("selectedExpression");

    if (selectedNumbers.length === 0) {

        expression.textContent =
            "choose 2 numbers";

        return;
    }

    if (selectedNumbers.length === 1) {

        expression.textContent =
            `chose: ${numbers[selectedNumbers[0]]}`;

        return;
    }

    expression.textContent =
        `${numbers[selectedNumbers[0]]}  ?  ${numbers[selectedNumbers[1]]}`;
}


/* ===================================
   Hint
=================================== */

function showHint() {

    const hintBox =
        document.getElementById("hintBox");

    const hintText =
        document.getElementById("hintText");

    hintText.innerHTML =
        solution.join("<br>");

    hintBox.classList.remove("hidden");
}


/* ===================================
   status
=================================== */

function showMessage(text, type) {

    const message =
        document.getElementById("message");

    message.textContent = text;

    message.className = type;
}


/* ===================================
   new game
=================================== */

function newGame() {
    generatePuzzle();
}


/* ===================================
   start
=================================== */

generatePuzzle();