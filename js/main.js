const table = document.getElementById("table");
const data = [
    { id: 1, name: 'Maximiliano', date: new Date(), participate: true }
]

main()

function main() {
    let row;
    const buttonActionsSimple = ` 
            <button class="btn-floating waves-effect waves-light blue add"> <i class="material-icons">add</i> </button>
            <button class="btn-floating waves-effect waves-light yellow edit"> <i class="material-icons">edit</i> </button>
            <button class="btn-floating waves-effect waves-light red delete"> <i class="material-icons">delete</i> </button>`;

    loadData();


    function loadData() {
        for (let _row of data) {
            addRow(_row);
        }
    }

    function addCommand() {
        addEmptyRow();
    }

    function editCommand(row) {
        editRow(row);
    }

    function acceptCommand(row) {
        const valid = validity(row);

        if (valid)
            setRow(row);
    }

    function addRow(data) {
        const rowGroup = getRowGroup();
        rowGroup.insertAdjacentHTML('beforeend', `<form class="form tableRow" data-id="${data.id}">
                <div class="tableCell">${data.name}</div>
                <div class="tableCell">${formatSpanishDate(data.date)}</div>
                <div class="tableCell">${labelCheckbox(data.participate)}</div>
                <div class="row tableCell"> ${buttonActionsSimple} </div>
            </form>`);

        formEvent()
        addEvent();
        editEvent(data.id);
    }



    function addEmptyRow() {
        const rowGroup = getRowGroup();
        const id = calcId();
        rowGroup.insertAdjacentHTML('beforeend', `<form class="tableRow form" data-id="${id}">
                ${addInputsData()}
                ${actionButtonsEditMode()}
            </form>`);


        formEvent();
        acceptEvent(id);

    }

    function editRow(row) {
        const name = row.querySelector(".tableCell:first-child").innerHTML;
        const date = stringToDate(row.querySelector(".tableCell:nth-child(2)").innerHTML);
        const participate = stringToBoolean(row.querySelector(".tableCell:nth-child(3)").innerHTML);
        const data = { name: name, date: date, participate: participate };
        row.innerHTML = `${addInputsData(data)} ${actionButtonsEditMode()}`
        acceptEvent(row.dataset.id);

        formEvent();
    }

    function setRow(row) {
        const rowName = row.querySelector(":first-child");

        const inputName = rowName.querySelector("input");
        rowName.innerHTML = inputName.value;
        const rowFecha = row.querySelector(":nth-child(2)");
        const inputDate = rowFecha.querySelector("input");
        rowFecha.innerHTML = formatSpanishDate(inputDate.value ? toDateUTC(inputDate.value) : new Date());
        const rowParticipate = row.querySelector(":nth-child(3)");
        const inputParticipate = rowParticipate.querySelector("input");
        rowParticipate.innerHTML = labelCheckbox(inputParticipate.checked);
        row.querySelector(":nth-child(4)").innerHTML = buttonActionsSimple;
        addEvent();
        editEvent(row.dataset.id);
    }

    function getRowGroup() {
        return table.querySelector(".tableRowGroup");
    }

    function addEvent() {
        const addButtons = table.querySelectorAll("button.add");
        addButtons.forEach(b => {
            b.addEventListener("click", ev => addCommand())
        })
    }

    function editEvent(id) {
        const row = table.querySelector(`.tableRow[data-id='${id}']`);
        row.querySelector("button:nth-child(2)").addEventListener("click", ev => editCommand(row))
    }

    function calcId() {
        return parseInt(getRowGroup().lastElementChild.dataset.id) + 1;
    }

    function acceptEvent(id) {
        const row = getRowGroup().querySelector(`.tableRow[data-id="${id}"]`);
        const acceptButton = row.querySelector("button:first-child");
        acceptButton.addEventListener("click", ev => {
            acceptCommand(row);
        })
    }

    function addInputsData(data) {

        if (!data)
            return `
            <div class="tableCell">
                <input type="text" name="name[]" value="" class="validate" required maxlength="50"/>
                <span class="helper-text" data-error="El nombre es requerido" data-success="Correcto"></span>
            </div>
            <div class="tableCell">
                <input type="date" name="date[]" value="" class="validate" required="true" />
                <span class="helper-text" data-error="La fecha es inválida" data-success="Correcto"></span>
            </div>
            <div class="tableCell">
                <label>
                    <input type="checkbox" name="participate[]"/>
                    <span></span>
                </label>  
            </div>`

        return `
        <div class="tableCell">
            <input type="text" name="name[]" value="${data.name}" class="validate" required maxlength="50"/>
            <span class="helper-text" data-error="El nombre es requerido" data-success="Correcto"></span>
        </div>
        <div class="tableCell">
            <input type="date" name="date[]" value="${data.date.toISOString().substr(0, 10)}" class="validate" required="true" />
            <span class="helper-text" data-error="La fecha es inválida" data-success="Correcto"></span>
        </div>
        <div class="tableCell">
            <label>
                <input type="checkbox" checked="${data.participate}" name="participate[]"/>
                <span></span>
            </label>  
        </div>`
    }

    function actionButtonsEditMode() {
        return `<div class="tableCell row">
        <button class="btn-floating waves-effect waves-light blue accept" type="submit"> <i class="material-icons">check</i> </button>
        <button class="btn-floating waves-effect waves-light red close"> <i class="material-icons">close</i> </button>
    </div>`
    }

    function validity(row) {
        const inputName = row.querySelector(":first-child input");
        const inputDate = row.querySelector(":nth-child(2) input");
        return inputName.validity.valid && inputDate.validity.valid
    }

    function formatSpanishDate(date) {
        return date.toLocaleDateString("es-es")
    }

    function stringToDate(string){
        let array = string.split("/");
        return new Date(array[2], array[1] - 1, array[0]);
    }

    function toDateUTC(dateString){
        
        let array = dateString.split("-");
        console.log(array)
        return new Date(Date.UTC(array[0], array[1] - 1, array[2], 3, 0));
    }

    function labelCheckbox(data) {
        return data ? 'SI' : 'NO';
    }

    function stringToBoolean(data) {
        return data === 'SI';
    }

    function formEvent() {
        document.querySelectorAll(".form").forEach(el => {
            el.addEventListener("submit", function (ev) {
                ev.preventDefault();
            })
        });
    }
}