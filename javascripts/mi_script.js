function obtainTables () {
	$.ajax({
		url: 'https://bscplantl01.bsc.es/evales/api/tables',
		dataType: 'json',
		// contentType: "application/json",
		success: tableSuccess,
		error: tableError
	})
}

function tableSuccess (d) {
	// console.log('d:', d)
	const arr = d.map((element) => {
		return [
			element.modelName,
			element.researchGroup,
			element.url,
			Number(Number(element.sum) / Number(7)).toPrecision(4).toString(),
			Number(element.conll_nerc.F1).toPrecision(4).toString(),
			Number(element.ud_pos.F1).toPrecision(4).toString(),
			Number(element.mldoc.F1).toPrecision(4).toString(),
			Number(element.paws_x.F1).toPrecision(4).toString(),
			Number(element.sts.Combined).toPrecision(4).toString(),
			Number(element.sqac.F1).toPrecision(4).toString(),
			Number(element.xnli.Accuracy).toPrecision(4).toString()
		]
	})

	const headers = [
		'Rank',
		'Model',
		'Submitted by',
		'URL',
		'Score',
		'CoNLL-NERC (F1)',
		'UD-POS (F1)',
		'MLDoc (F1)',
		'PAWS-X (F1)',
		'STS (Comb.)',
		'SQAC (F1)',
		'XNLI (Acc.)'
	]
	const idHref = [
		'',
		'',
		'',
		'',
		'',
		'nerc',
		'pos',
		'mldoc',
		'pawsx',
		'sts',
		'qa',
		'xnli'
	]

	let innerTable = '<table id="table" class="performanceTable table">'
	innerTable += '<thead><tr>'
	$(headers).each(function (header) {
		if (idHref[header] != '') {
			innerTable += '<th><a href="datasets.html#' + idHref[header].toLowerCase() + '">' + headers[header] + "</a></th>"
		} else if (headers[header] === 'Paper'){
			innerTable += '<th style="width:30px;">' + headers[header] + "</th>"
		} else {
			innerTable += '<th>' + headers[header] + "</th>"
		}
	})
	innerTable += '</tr></thead><tbody>'
	$(arr).each(function (elem) {
		innerTable += '<tr>'
		innerTable += '<td>' + (elem + 1) + '</td>'
		$(arr[elem]).each(function (innerElem) {
			switch (innerElem) {
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
		autoWidth: false,
		order: [[0, "asc"]],
		columnDefs: [
			{ targets: [1, 2, 3], orderable: false },
			{ targets: "_all", className: 'dt-center' },
			{ targets: "_all", orderSequence: ['desc', 'asc'] }
		],
		searching: false
	});
}

function tableError (e) {
	console.log(e)
}

$(document).ready(() => {
	obtainTables()
})