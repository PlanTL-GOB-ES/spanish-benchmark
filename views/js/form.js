$('email').blur(() => {
  const mail = $('#email').val();
  if (/[\w-]+@\w+\.\w{2,3}/.test(mail)) {
    if ($('#emailDiv > div.help-block').length === 0) {
      $('#emailDiv').addClass('has-error').append('<div class="help-block">Mail ' + mail + ' is not valid</div>');
    } else {
      $('#emailDiv').addClass('has-error').children('div.help-block').text('Mail ' + mail + ' is not valid');
    }
  } else {
    $('#emailDiv').removeClass('has-error');
    $('#emailDiv > div.help-block').remove();
  }
})

function checkFile () {
  if (this.path === '') {
    if ($('#' + this.id + ' > div.help-block').length === 0) {
      $('#' + this.id).parent().addClass('has-error').append('<div class="help-block">File is not valid</div>')
    } else {
      $('#' + this.id + '').addClass('has-error').children('div.help-block').text('File is not valid')
    }
  } else {
    $('#' + this.id).parent().removeClass('has-error')
    $('#' + this.id + ' + div.help-block').remove()
  }
}

$("input[type=file]").blur(checkFile)

function checkText () {
  if (this.value === '') {
    if ($('#' + this.id + ' > div.help-block').length === 0) {
      $('#' + this.id).parent().addClass('has-error').append('<div class="help-block">Name is not valid</div>')
    } else {
      $('#' + this.id + '').addClass('has-error').children('div.help-block').text('Name is not valid')
    }
  } else {
    $('#' + this.id).parent().removeClass('has-error')
    $('#' + this.id + ' + div.help-block').remove()
  }
}

$("#submit_button").hover(() => {
	if (!$("input[type=text]").value = '' || !$("input[type=file]").path = '') {
		$("#submit_button").attr("disabled", false)
	}
})

function submitForm (e) {
  const formData = new FormData($('#evaluation_form')[0])
  // let mailValid = checkMail(formData.get('email'))
  // let linkValid = checkLink(formData.get('paperLink'))
  if (!$('#evaluation_form div').hasClass('has-error') && $("#dataPol").is(":checked")) {
    $('#submit_button').val('Submit')
    $.ajax({
      url: 'https://bscplantl01.bsc.es/evales/api/results',
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
