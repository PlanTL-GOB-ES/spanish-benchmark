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
	console.log('d:', d)
	const arr = d.map((element) => {
		return [
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
		'Model',
		'Submitted by',
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

	let innerTable = '<table id="table">'
	innerTable += '<thead><tr>'
	$(headers).each(function (header) {
		if (header > 2) {
			innerTable += '<th><a href="datasets.html#' + idHref[header].toLowerCase() + '">' + headers[header] + "</a></th>"
		} else {
			innerTable += '<th>' + headers[header] + "</th>"
		}
	})
	innerTable += '</tr></thead><tbody>'

	$(arr).each(function (elem) {
		innerTable += '<tr>'
		$(arr[elem]).each(function (innerElem) {
			switch (innerElem) {
				// case 0:
				//	innerTable += '<td>' + (elem + 1)
				//	break
				case 2:
					if (arr[elem][innerElem] != '') {
						innerTable += '<td><a target="_blank" href=' + arr[elem][innerElem] + '><span class="material-symbols-outlined">open_in_new</span></a></td>'
					} else {
						innerTable += '<td></td>'
					}
					break
				default:
					innerTable += '<td>' + arr[elem][innerElem] + "</td>"
			}
		})
		innerTable += "</tr>"
	})
	innerTable += "</tbody></table>"

	$('#leaderboard').html(innerTable)
	$('#table').DataTable({
		paging: false,
		order: [[3, 'desc'], [4, 'desc'], [5, 'desc'], [6, 'desc'], [7, 'desc'], [8, 'desc'], [9, 'desc'], [10, 'desc'], [11, 'desc']],
		columnDefs: [
			{ targets: [0, 1, 2], orderable: false }
		],
		searching: false
	});
}

function tableError (e) {
	console.log(e)
}

$(document).ready(() => {
	obtainTables()

	// console.log(arr)
})
