// form.js
// Handles the validation and the form of https://benchmark.plantl.bsc.es/submit.html
//
// Made by: Pau Figueras Pavón
// github: https://github.com/pswsm

// Global var to check if an evaluation has been sent
let evaluationSent = false;

FilePond.create(document.getElementById('pond'), {
	allowMultiple: true,
	storeAsFile: true,
	maxFiles: 7
})

// Check if mail is valid
function checkMail () {
	if (/[\w-]+@\w+\.\w{2,3}/.test($(this).get(0).value)) {
		$(this).parent().removeClass('has-error').children('div.help-block').remove();
		// return true;
	} else if ($('#emailDiv > div.help-block').length === 0) {
		$('#emailDiv').addClass('has-error').append('<div class="help-block">Mail ' + $(this).get(0).value + ' is not valid</div>');
		// return false;
	}
}

// Check text fields not empty
function checkText () {
	if ($(this).get(0).value == undefined || $(this).get(0).value == '') {
		if ($(this).parent().children('div.help-block').length === 0){
			$(this).parent().addClass('has-error').append('<div class="help-block">Field not valid</div>')
		}
	} else {
		$(this).parent().removeClass('has-error').children('div.help-block').remove()
		// $(this).parent().children('div.help-block').remove()
	}
}

function checkFileInPond() {
	let filesPond = new FormData($('form')[0]).getAll('filepond');
	if (filesPond.length === 7) {
		$('#pondDiv').removeClass('has-error').children('div.help-block').remove()
	} else {
		if ($('#pondDiv').children('div.help-block').length === 0) {
			$('#pondDiv').addClass('has-error')
			$('#pondDiv').append(`<div class="help-block">Missing files</div>`);
		}
	}
}

// Check if URL field is either empty, since it's optional or it's value looks like an url
function checkLink () {
	// console.log('$(this).get(0).value:', $(this).get(0).value);
	if ($(this).get(0).value === '' || /(?:(?:http|https):\/\/)?(?:www\.)?\w+(?:\.\w{2,3})/.test($(this).get(0).value)) {
		$(this).parent().removeClass('has-error').children('div.help-block').remove()
	} else {
		if ($(this).parent().children('div.help-block').length === 0) {
			$(this).parent().addClass('has-error').append('<div class="help-block">URL not valid not valid</div>')
		}
	}
}

function checkChecked() {
	if ($(this).is(':checked')) {
		$(this).parent().removeClass('has-error').children('div.help-block').remove();
	} else {
		if ($(this).parent().children('div.help-block').length === 0) {
			$(this).parent().addClass('has-error').append('<div class="help-block">Please accept the data policy to submit</div>')
		}
	}
}

// On form submit
function submitForm (e) {
	evaluationSent = true;
	const formData = new FormData($('#evaluation_form')[0]);
	// Disable button
	$('#submit_button').val('Submit').attr('disabled', true)
	// $('#evaluation_form + img').css('filter', 'invert(100%)').css('text-align', 'center')
	// Toast evaluating...
	Toastify({
		text: "Evaluating...",
		duration: 6000,
		stopOnFocus: false,
		style: {
			background: "#136b82"
		}
	}).showToast()
	$.ajax({
		// url: 'http://localhost:3000/api/results',
		url: 'https://bscplantl01.bsc.es/evales/api/results',
		type: 'POST',
		data: formData,
		processData: false,
		contentType: false,
		success: submitSuccess,
		error: submitError
		
	})
}

function submitSuccess () {
	$('#evaluation_form').parent().empty().append('<h1>Thanks for submitting!</h1><br><img src="./images/ok.png" alt="Evaluation sent successfully">')

	console.log('Upload okay')
	evaluationSent = false;
}

function submitError (err) {
	console.error(err)
	// Toast error code + detail.
	// Enable button
	switch (err.status) {
		case 400:
			let responseParsed = JSON.parse(err.responseText)
			let failedTasks = responseParsed.evaluations_error.join(', ')
			toast = Toastify({
				text: failedTasks + " failed, please check the files are the correct ones",
				duration: 3000,
				style: { background: "#f00" }
			})
			break;

		default:
			toast = Toastify({
				text: "An unknow error happened, please contact the administrators.",
				duration: 3000,
				style: { background: "#ff0000" }
			})
			break;
	}
	toast.showToast();
	$('#submit_button').attr('disabled', true);
	evaluationSent = false;
}

$(document).ready(function () {
	// Disables submit button by default
	$('#submit_button').attr('disabled', true)
	let onClickAlready = false;

	// Add as blur event
	$('#email').blur(checkMail)

	// Add as blur event
	$('input[type=text]').blur(checkText)

	// Add as blur event
	$('input[type=url]').blur(checkLink)

	// Add as blur event
	$('#actualPond').blur(checkFileInPond)

	// On hover submit button, validate all fields too
	$("#submit_button").on('pointerenter', function () {
		$("input[type=text]").each(checkText)
		$("input[type=url]").each(checkLink)
		$("input[type=email]").each(checkMail)
		$("#pond").each(checkFileInPond)
		$('#dataPol').each(checkChecked)
		let textsOk = !$("input[type=text]").parent().hasClass('has-error') 
		let urlOk = !$("input[type=url]").parent().hasClass('has-error')
		let mailOk = !$("input[type=email]").parent().hasClass('has-error')
		let filepondOk = !$("#pondDiv").hasClass('has-error')
		let legalOk = $("#dataPol").is(":checked")
		// console.log('textsOk, filesOk, urlOk, mailOk, legalOk:', textsOk, filesOk, urlOk, mailOk, legalOk)
		if (!evaluationSent && filepondOk && textsOk && urlOk && mailOk && legalOk) {
			$('#submit_button').attr('disabled', false)
			if (!onClickAlready) {
				$('#submit_button').click(submitForm);
				onClickAlready = true;
			}
		} else {
			$('#submit_button').attr('disabled', true)
		}
	})
})

