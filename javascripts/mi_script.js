function obtainTables () {
  $.ajax({
    url: 'https://plantl.api.aina.cf/evalesapi/tables',
    dataType: 'json',
    // contentType: "application/json",
    success: tableSuccess,
    error: tableError
  })
}

function tableSuccess (d) {
  console.log(d)

  const arr = d.map((element) => {
    return [
      element.email,
      element.modelName,
      element.researchGroup,
      element.paperLink,
      element.conll_nerc.F1,
      element.capitel_nerc.F1,
      element.ud_pos.F1,
      element.capitel_pos.F1,
      element.mldoc.F1,
      element.paws_x.F1,
      element.sts.Combined,
      element.sqac.F1,
      // /\d+\.\d{2}/.exec(element.winograd.F1),
      element.xnli.Accuracy
    ]
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
    // 'WINOGRAD',
    'XNLI (Acc.)'
  ]

  const idHref = [
    '',
    '',
    '',
    '',
    'nerc',
    'nerc',
    'pos',
    'pos',
    'mldoc',
    'pawsx',
    'sts',
    'qa',
    'xnli'
  ]

  let innerTable = '<table class="table performanceTable">'
  innerTable += '<tr>'
  $(headers).each(function (header) {
    if (header > 3) {
      innerTable += '<th><a href="datasets.html#' + idHref[header].toLowerCase() + '">' + headers[header]
    } else {
      innerTable += '<th>' + headers[header]
    }
  })

  $(arr).each(function (elem) {
    innerTable += '<tr>'
    $(arr[elem]).each(function (innerElem) {
      switch (innerElem) {
        case 0:
          innerTable += '<td>' + (elem + 1)
          break
        case 3:
          innerTable += '<td><a target="_blank" href=' + arr[elem][innerElem] + '><span class="material-symbols-outlined">open_in_new'
          break
        case 2:
          innerTable += '<td>' + arr[elem][innerElem] // + '<br>' + arr[elem][0]
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
