function obtainTables () {
  $.ajax({
    url: 'http://localhost:3000/api/tables',
    dataType: 'json',
    // contentType: "application/json",
    success: tableSuccess,
    error: tableError
  })
}

function tableSuccess (d) {
  console.log(d)
  const arr = d.map((element) => {
    return [element.email, element.modelName, element.researchGroup, element.paperLink, element.task1, element.task2, element.task3, element.task4, element.task5]
  })
  const headers = [
    'Rank',
    'Model',
    'Group',
    'Paper',
    'CoNLL-NERC (F1)',
    'CAPITEL-NERC (F1)',
    'UD-POS (F1)',
    'CAPITEL-POS (F1)',
    'MLDoc (F1)',
    'PAWS-X (F1)',
    'STS (Comb.)',
    'SQAC (F1)',
    'WINOGRAD',
    'XNLI (Acc.)'
  ]

  let innerTable = '<table class="table performanceTable">'
  innerTable += '<tr>'
  $(headers).each(function (header) {
    innerTable += '<th>' + headers[header]
  })

  $(arr).each(function (elem) {
    innerTable += '<tr>'
    $(arr[elem]).each(function (innerElem) {
      switch (innerElem) {
        case 0:
          innerTable += '<td>' + (elem + 1)
          break
        case 3:
          innerTable += '<td><a>' + arr[elem][innerElem]
          break
        case 2:
          innerTable += '<td>' + arr[elem][innerElem] + '<br>' + arr[elem][0]
          break
        default:
          innerTable += '<td>' + arr[elem][innerElem]
      }
    })
  })

  $('#leaderboard').html(innerTable)
}

function tableError (e) {
  console.log(e)
}

$(document).ready(() => {
  obtainTables()

  // console.log(arr)
})
