


var boulangerie_list = []
var baguette_list = []
var ingredient_list = []

function display_data(boulangeries, baguettes, ingredients){
    boulangerie_list = boulangeries;
    baguette_list = baguettes;
    ingredient_list = ingredients;

    console.log(boulangerie_list)

    for (const boulang in boulangerie_list) {
        display_boulangerie_table(boulangerie_list[boulang])
    }
}




function display_boulangerie_table(boulangerie){
    row = "<td>" + boulangerie.id + "</td>"
    row += "<td>" + boulangerie.name + "</td>"
    row += "<td>"

    for (const bag in boulangerie.baguettes) {
        console.log( boulangerie.baguettes[bag].id)
        baguette = get_obj_by_id(baguette_list, boulangerie.baguettes[bag].id);
        console.log(baguette)
        onclick_request = "selected_baguette('".concat('', baguette.id).concat('', "')")

        row += '<p class="text-primary onclick" onclick="' + onclick_request + '">' + baguette.name  + "</p>"
    }

    row += "</td>"

    $('#boulangerieTab tr:last').after('<tr>' + row + '</tr>');
}

function selected_baguette(id){
    var baguette = get_obj_by_id(baguette_list, id);

    document.getElementById("selectedBaguetteId").innerHTML = id;
    document.getElementById("selectedBaguetteName").innerHTML = baguette.name;

    var baguette_ingredient = ingredient_by_list_id(baguette.ingredients);

    document.getElementById("selectedBaguetteCalorie").innerHTML = total_calorie(baguette_ingredient);

    display_aliments_by_list(baguette_ingredient);
}

function display_aliments_by_list(aliment_list){

    $('#ingredientTab tr:not(:first)').remove();

    for (const bag in aliment_list) {
        aliment = aliment_list[bag]
        row = "<td>" + aliment.id + "</td>";
        row += "<td>" + aliment.name + "</td>";
        row += "<td>" + aliment.calorie + "</td>";

        $('#ingredientTab tr:last').after('<tr>' + row + '</tr>');
    }
}





function ingredient_by_list_id(id_list){
    var ingredients_baguette = [];

    for (const obj in id_list) {
        ingre = get_obj_by_id(ingredient_list, id_list[obj].id);
        ingredients_baguette.push(ingre)
    }

    return ingredients_baguette
}

function total_calorie(list_ingre){
    total_cal = 0
    for (const obj in list_ingre) {
        total_cal +=  parseInt(list_ingre[obj].calorie);
    }
    return total_cal
}



function get_obj_by_id(list, id){
    retour = {}
    for (const obj in list) {
        if(list[obj].id === id){
            retour = list[obj]
        }
    }
    return retour
}



