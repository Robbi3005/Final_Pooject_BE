let addIngridientsBtn = document.getElementById('addIngridientsBtn');

let ingridientList = document.querySelector('.ingridientList');

let ingridientDiv = document.querySelectorAll('.ingridientDiv')[0]; 

//------------------------------------------------------------------------

addIngridientsBtn.addEventListener('click', function(){

    let newIngridients = ingridientDiv.cloneNode(true);

    let input = newIngridients.getElementsByTagName('input')[0];

    input.value = '';

    ingridientList.appendChild(newIngridients); 
});