function obtainTables() {
    $.ajax({
        url: "http://localhost:3000/api/tables",
        dataType: "json",
        // contentType: "application/json",
        success: tableSuccess,
        error: tableError
    })
}

function tableSuccess(d) {
    console.log(d);
    let arr = d.map((element)=>{
        return [element.email, element.modelName, element.researchGroup, element.paperLink, element.task1, element.task2, element.task3, element.task4, element.task5];
        // return {email: element.email}
        // return {
            // email: element.email,
            // modelName: element.modelName,
            // researchGroup: element.researchGroup,
            // paperLink: element.paperLink,
            // task1: element.task1,
            // task2: element.task2,
            // task3: element.task3,
            // task4: element.task4,
            // task5: element.task5
        // }
    });
    const headers = ['Rank', 'Model', 'Group', 'Paper', 'Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5'];

    let innerTable = '<table class="table performaceTable">';
    innerTable += '<tr>';
    $(headers).each(function (header) {
        innerTable += '<th>' + headers[header];
    });

    $(arr).each(function (elem) {
        innerTable += '<tr>'
        $(arr[elem]).each(function (innerElem) {
            switch (innerElem) {
                case 0:
                    innerTable += '<td>' + (elem + 1);
                    break;
                case 3:
                    innerTable += '<td><a>' + arr[elem][innerElem];
                    break;
                case 2:
                    innerTable += '<td>' + arr[elem][innerElem] + '<br>' + arr[elem][0]
                    break;
                default:
                    innerTable += '<td>' + arr[elem][innerElem];
                }
        });
    });

    $('#leaderboard').html(innerTable);
}

function tableError(e) {
    console.log(e);
}


$(document).ready(()=>{
    obtainTables();

    // console.log(arr)
})
