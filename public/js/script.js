let addIngridientsBtn = document.getElementById('addIngridientsBtn');

let ingridientList = document.querySelector('.ingridientList');

let ingridientDiv = document.querySelectorAll('.ingridientDiv')[0];

//------------------------------------------------------------------------

if (addIngridientsBtn) {
    addIngridientsBtn.addEventListener('click', function () {

        let newIngridients = ingridientDiv.cloneNode(true);

        let input = newIngridients.getElementsByTagName('input')[0];

        input.value = '';

        ingridientList.appendChild(newIngridients);
    });
}

//------------------------------------------------------------------------

let deleteButtonRecipe = document.getElementById('delete-button-recipe');

if (deleteButtonRecipe) {
    deleteButtonRecipe.addEventListener('click', function () {

        let current_url = window.location.href;

        let id = current_url.replace(/^.*recipe\//, '');

        axios({
            method: 'delete',
            url: window.location.origin + `/recipe/${id}`
        })
            .then(function (response) {
                // handle success
                if (response.status == 200 && response.data.status == 'success delete') {
                    // window.location.href = window.location.origin;
                    window.location.reload();
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    });
}