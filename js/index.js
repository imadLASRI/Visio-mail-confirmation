(function () {
  // var testTool = window.testTool;
  // if (testTool.isMobileDevice()) {
  //   vConsole = new VConsole();
  // }
  // console.log("checkSystemRequirements");
  // console.log(JSON.stringify(ZoomMtg.checkSystemRequirements()));

  ZoomMtg.preLoadWasm();
  ZoomMtg.prepareJssdk();

  const API_KEY = "qGDr8lXeTeKsnMF_1hWlTQ";

  const params = new URLSearchParams(window.location.search);
  let mn = params.get("mn");
  let pw = params.get("pw");
//   let name = params.get("name");
  let email = params.get("email");

//   console.log('mn : ' + mn + ' pw : ' + pw);

  if (email !== null) {
    $("#verified_email").val(email);
  }

	//managing not registred error modal   
	var modal = document.getElementById("myModal");
	var span = document.getElementsByClassName("close")[0];
	span.onclick = function() {
		modal.style.display = "none";
		location.reload();
	}
	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = "none";
			location.reload();
		}
	}

  document.getElementById("join_meeting").addEventListener("click", (e) => {
    e.preventDefault();

    let apiKey = API_KEY;
    let sign = "";
    // let role = document.getElementById("meeting_role").value;
    let role = 0;

    // let userName = document.getElementById("display_name").value;
    let email = document.getElementById("verified_email").value;

    if (email !== "") {
		document.getElementById("join_meeting").style.display = "none";
		document.getElementById("loader").style.display = "block";
	}
	
	// verify inscription email
	fetch("http://webevents.test/api/zoom/verifyinscription", {
		  method: "POST",
		  headers: {
			"Content-Type": "application/json",
		  },
		  // mode: "no-cors",
		  body: JSON.stringify({
			email: email,
		  }),
		})
		.then((response) => response.json())
		.then((data) => {
			if(data !== 'failed'){
				connectZoom(data);
			}
			else{
				modal.style.display = "block";
			}
		});
	
	
	function connectZoom(name){
		// replace with App url
		fetch("https://sas.salonvirtuel.space/api/zoom/signature", {
		  method: "POST",
		  headers: {
			"Content-Type": "application/json",
		  },
		  // mode: "no-cors",
		  body: JSON.stringify({
			meeting_number: mn,
			role: role,
		  }),
		})
		  .then((response) => response.json())
		  .then((data) => {
			// GOT SIGNATURE
			sign = data;
	
			// INIT and Join Meeting
			ZoomMtg.init({
			  leaveUrl: "./",
			  isSupportAV: true,
			  success: function () {
				$.i18n.reload("fr-FR");
				// using the returned name and the entred email
				ZoomMtg.join({
				  signature: sign,
				  meetingNumber: mn,
				  userName: name,
				  apiKey: apiKey,
				  userEmail: email,
				  passWord: pw,
				  success: (success) => {
					document.getElementById("connexion").style.display = "none";
					document.getElementById("nav-tool").style.background = "none";
					$("#nav-tool").css("background", "none !important");
					$("#nav-tool").css("height", "0");
					//
					setTimeout(function () {
					  $("#join-pc-audio-btn").html(
						"Activer l'audio du Périphérique"
					  );
					}, 500);
				  },
				  error: (error) => {
					console.log(error);
	
					setTimeout(function () {
					  if (error) {
						$(".zm-modal-footer").css("display", "none");
					  }
	
					  $(".ReactModal__Overlay").click(function (e) {
						e.preventDefault();
						e.stopPropagation();
	
						if (email == null) {
						  location.replace(window.location + "&email=" + email);
						} else {
						  location.reload();
						}
					  });
					}, 300);
				  },
				});
			  },
			});
		});
	}
  });
})();
