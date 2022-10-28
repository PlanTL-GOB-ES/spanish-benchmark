// Obtain plugin
let cc = initCookieConsent();

// Run plugin with your configuration
cc.run({
	autorun: true,
	current_lang: 'en',
	delay: 0,
	autoclear_cookies: true,
	onAccept: function() {},
	onChange: function(cookie) {},
	gui_options: {
        consent_modal: {
            layout: 'bar',               // box/cloud/bar
            position: 'bottom',     // bottom/middle/top + left/right/center
            transition: 'slide',           // zoom/slide
            swap_buttons: false            // enable to invert buttons
        },
        settings_modal: {
            layout: 'box',                 // box/bar
            // position: 'left',           // left/right
            transition: 'slide'            // zoom/slide
        }
    },
	languages : {
		'en' : {	
			consent_modal : {
				title :  "Cookies",
				description :  'We use cookies to keep track of files and inputs you\'ve sent us through the form to submit data.',
				primary_btn: {
					text: 'Accept all',
					role: 'accept_all'
				},
				secondary_btn: {
					text : 'Accept necessary',
					role : 'accept_necessary'
				}
			},
			settings_modal : {
				title : '<div>Cookie settings</div>',
				save_settings_btn : "Save settings",
				accept_all_btn : "Accept all",
				cookie_table_headers : [
					{col1: "Name" }, 
					{col2: "Domain" }, 
					{col3: "Expiration" }, 
					{col4: "Description" },
				],
				blocks : [
					{
						title : "Cookie usage",
						description: 'We use cookies to ensure the basic functionalities of the website and to enhance your online experience. You can choose for each category to opt-in/out whenever you want. For more details about cookies and how we use them, read the full <a href="../privacy-policy.html" class="cc-link">cookie policy</a>.'
					},{
						title : "Strictly necessary cookies",
						description: 'These cookies are essential for the proper functioning of our website. Without these cookies, the website would not work properly.',
						toggle : {
							value : 'necessary_cookies',
							enabled : true,
							readonly: true							//cookie categories with readonly=true are all treated as "necessary cookies"
						}
					},{
						title : "Preferences cookies",
						description: 'These cookies allow the website to remember the choices you have made in the past.',
						toggle : {
							value : 'preferences_cookies',	//there are no default categories => you specify them
							enabled : true,
							readonly: false
						}
					},{
						title : "More information",
						description: 'For any queries in relation to our policy on cookies and your choices, please <a class="cc-link" href="mailto:privacy@skylands.io">contact me</a>.',
					}
				]
			}
		}
	}
});

cc.show()

