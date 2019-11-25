

var naver_id_login = new window.naver_id_login("buniXVCiAaaHIjxxHXO0", "http://localhost:8080/api/callback");
// var state = naver_id_login.getUniqState();
// naver_id_login.setButton("white", 2,40);
// naver_id_login.setDomain("http://localhost:8080/");
// naver_id_login.setState(state);
// // naver_id_login.setPopup();
// naver_id_login.init_naver_id_login();


// naver_id_login.test = async function(token){
//   return await $.ajax({
// 		url: "https://openapi.naver.com/v1/nid/getUserProfile.json?response_type=json",
// 		type: "GET",
// 		data: {"access_token":token},
// 		dataType: "jsonp",
// 		jsonp: "oauth_callback"
// 		});
// }



export default naver_id_login
