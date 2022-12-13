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

// Check if file field is valid (has a file uploaded)
function checkFile () {
	if ($(this).get(0).files.length !== 0) {
		$(this).parent().removeClass('has-error').children('div.help-block').remove()
		// return true
	} else if ($(this).parent().children('div.help-block').length === 0) {
		$(this).parent().addClass('has-error').append('<div class="help-block">File is not valid</div>')
		// return false;
	}
}

function checkFileInPond() {
	let filesPond = new FormData($('form')).getAll('filepond');
	// let txt_found = 0;
	// let txt_regex = /[\w\-]+\.txt/;
	// let json_found = 0;
	// let json_regex = /[\w\-]+\.json/;
	let error_files = [];
	let tasks = [false, false, false, false, false, false, false]
	let tFiles = ['conll_predictions.txt', 'pawsx_predictions.txt', 'conll_predictions.txt', 'mldoc_predictions.txt', 'udpos_predictions.txt', 'sts_predictions.txt', 'sqac_predictions.json'];
	filesPond.forEach(file => {
		if (tFiles.includes(file)) {
			tasks[tFiles.indexOf(file)] = true;
			console.log('file:', file)
		} else if (!tFiles.includes(file)) {
			error_files.push(`${file} not valid`);
		}
	});
	for (const index in tasks) {
		if (tasks[index] === false) {
			error_files.push(tFiles[index]);
		}
	}
	if (error_files.length || tFiles.some(task => task === false)) {
		if ($('#pondDiv').children('div.help-block').length === 0) {
			$('#pondDiv').addClass('has-error')
			$('#pondDiv').insertAfter(`<div class="help-block">Files ${error_files.join(', ')} are not valid</div>`);
		}
	} else {
		$(this).parent().removeClass('has-error').children('div.help-block').remove()
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

// On form submit
function submitForm (e) {
	evaluationSent = true;
	const formData = new FormData($('#evaluation_form')[0]);
	console.log('formData:', formData)
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
		url: process.env.API_URL,
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
	console.log('okay');
	// Disables submit button by default
	$('#submit_button').attr('disabled', true)
	let onClickAlready = false;

	// Add as blur event
	$('#email').blur(checkMail)
	console.log('blur mail');

	// Add as blur event
	$("input[type=file]").blur(checkFile)
	console.log('blur files');

	// Add as blur event
	$('input[type=text]').blur(checkText)
	console.log('blur text');

	// Add as blur event
	$('input[type=url]').blur(checkLink)
	console.log('blur url');

	// Add as blur event
	$('#actualPond').blur(checkFileInPond)
	console.log('blur filepond');

	// On hover submit button, validate all fields too
	console.log('pre focus')
	$("#submit_button").on('pointerenter', function () {
		console.log('in focus')
		$("input[type=text]").each(checkText)
		$("input[type=file]").each(checkFile)
		$("input[type=url]").each(checkLink)
		$("input[type=email]").each(checkMail)
		let textsOk = !$("input[type=text]").parent().hasClass('has-error') 
		let filesOk = !$("input[type=files]").parent().hasClass('has-error')
		let urlOk = !$("input[type=url]").parent().hasClass('has-error')
		let mailOk = !$("input[type=email]").parent().hasClass('has-error')
		let filepondOk = !$("#pond").parent().parent().hasClass('has-error')
		let legalOk = $("#dataPol").is(":checked")
		// console.log('textsOk, filesOk, urlOk, mailOk, legalOk:', textsOk, filesOk, urlOk, mailOk, legalOk)
		if (!evaluationSent && filesOk && textsOk && urlOk && mailOk && legalOk) {
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

