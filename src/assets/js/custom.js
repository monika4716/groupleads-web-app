
	$(document).ready(function() {
		$(document).on("focus", "select", function() {
			this.size=$(this).find("option").length;
			$(this).parent().addClass('transparent-custom-icon');
		})
		  
		$(document).on("blur", "select", function() {       
			this.size=0;
			$(this).parent().removeClass('transparent-custom-icon');
		})
		  
		// $(document).on("change", "select", function() {
		// 	this.size=1;
		// 	this.blur();	
		// });

		$(document).on("click", "option:selected", function() {
			if($(this).parent().attr('size') > 1 ){
				$(this).parent().attr('size',1)
				$(this).parent().blur();
			}
		});

	});
	