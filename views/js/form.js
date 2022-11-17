// form.js
// Handles the validation and the form of https://benchmark.plantl.bsc.es/submit.html
//
// Made by: Pau Figueras Pavón
// github: https://github.com/pswsm

// Disables submit button by default
$('#submit_button').attr('disabled', true)

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


// Add as blur event
$('#email').blur(checkMail)

// Check if file fiedl is valid (has a file uploaded)
function checkFile () {
  if ($(this).get(0).files.length !== 0) {
    $(this).parent().removeClass('has-error').children('div.help-block').remove()
		// return true
	} else if ($(this).parent().children('div.help-block').length === 0) {
		$(this).parent().addClass('has-error').append('<div class="help-block">File is not valid</div>')
		// return false;
  }
}

// Add as blur event
$("input[type=file]").blur(checkFile)

// Check text fields not empty
function checkText () {
  if ($(this).get(0).value == undefined || $(this).get(0).value == '') {
		if ($(this).parent().children('div.help-block').length === 0){
			$(this).parent().addClass('has-error').append('<div class="help-block">Field not valid not valid</div>')
		}
	} else {
    $(this).parent().removeClass('has-error').children('div.help-block').remove()
    // $(this).parent().children('div.help-block').remove()
	}
}

// Add as blur event
$('input[type=text]').blur(checkText)


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

// Add as blur event
$('input[type=url]').blur(checkLink)

// On form submit
function submitForm (e) {
	$('#submit_button').val('Submit')
	$('#evaluation_form').css('display', 'none').parent().append('<img src="../ok.png" alt="Evaluation sent successfully">')
	$('#evaluation_form + img').css('filter', 'invert(100%)').css('text-align', 'center')
	$('#evaluation_form + p').css('display', 'none')
	$('#evaluation_form + h1').text('Thanks for submitting!')
  const formData = new FormData($('#evaluation_form')[0])
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
}

function submitError (err) {
  console.error(err)
}

// On hover submit button, validate all fields too
$("#submit_button").hover(function () {
	$("input[type=text]").each(checkText)
	$("input[type=file]").each(checkFile)
	$("input[type=url]").each(checkLink)
	$("input[type=email]").each(checkMail)
	let textsOk = $("input[type=text]").parent().hasClass('has-error') 
	let filesOk = $("input[type=files]").parent().hasClass('has-error')
	let urlOk = $("input[type=url]").parent().hasClass('has-error')
	let mailOk = $("input[type=email]").parent().hasClass('has-error')
	let legalOk = $("#dataPol").is(":checked")
	// console.log('textsOk, filesOk, urlOk, mailOk, legalOk:', textsOk, filesOk, urlOk, mailOk, legalOk)
	if (!(filesOk && textsOk && urlOk && mailOk) && legalOk) {
		$('#submit_button').attr('disabled', false).click(submitForm)
	}
}, function () {})
