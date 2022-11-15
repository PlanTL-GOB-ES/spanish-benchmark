$('#submit_button').attr('disabled', true)

function checkMail () {
  if (/[\w-]+@\w+\.\w{2,3}/.test($(this).value)) {
    $('#emailDiv').removeClass('has-error');
    $('#emailDiv > div.help-block').remove();
		return true;
  } else if ($('#emailDiv > div.help-block').length === 0) {
		$('#emailDiv').addClass('has-error').append('<div class="help-block">Mail ' + $(this).value + ' is not valid</div>');
		return false;
	}
}

$('#email').blur(checkMail)

function checkFile () {
  if ($(this).get(0).files.length !== 0) {
    $('#' + $(this).attr('id')).parent().removeClass('has-error')
		console.log('this:', this)
    $(this).parent().children('div.help-block').remove()
		return true
	} else if ($(this).parent().children('div.help-block').length === 0) {
		$(this).parent().addClass('has-error').append('<div class="help-block">File is not valid</div>')
		return false;
  }
}

$("input[type=file]").blur(checkFile)

function checkText () {
  if ($(this).value !== undefined || $(this).value !== '') {
    $(this).parent().removeClass('has-error')
    $(this).parent().children('div.help-block').remove()
		return true;
	} else if ($(this).parent().children('div.help-block').length === 0){
		$(this).addClass('has-error').children('div.help-block').text('Name is not valid')
		return false;
  }
}

function checkLink () {
	if ($(this).value === undefined || $(this).value === '' || /(?:(?:http|https):\/\/)?(?:www\.)?\w+(?:\.\w{2,3})/.test($(this).value)) {
		return true
	} else if ($(this).parent().children('div.help-block').length === 0) {
		$(this).parent().append('<div class="help=block">URL not valid</div>')
		return false
	}
}

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
	console.log('textsOk, filesOk, urlOk, mailOk, legalOk:', textsOk, filesOk, urlOk, mailOk, legalOk)
	if (filesOk && textsOk && urlOk && mailOk && legalOk) {
		$('#submit_button').attr('disabled', false)
	}
}, function () {})

function submitForm (e) {
  const formData = new FormData($('#evaluation_form')[0])
  // let mailValid = checkMail(formData.get('email'))
  // let linkValid = checkLink(formData.get('paperLink'))
  if (!$('#submit_button').is(':disabled')) {
    $('#submit_button').val('Submit')
    $.ajax({
			url: 'localhost:3000',
      // url: 'https://bscplantl01.bsc.es/evales/api/results',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: submitSuccess,
      error: submitError
    })
  } else {
    $('#evaluation_form div').each(function () {
      if ($(this).hasClass('has-error') && $(this).children('div.help-block').length === 0) {
        $(this).append('<div class="help-block">Field not valid</div>')
      }
    })
  }
}

function submitSuccess () {
  $('#evaluation_form').css('display', 'none').parent().append('<img src="../ok.png" alt="Evaluation sent successfully">')
  $('#evaluation_form + img').css('filter', 'invert(100%)').css('text-align', 'center')
  $('#evaluation_form + p').css('display', 'none')
  $('#evaluation_form + h1').text('Thanks for submitting!')
}

function submitError (err) {
  console.error(err)
}
