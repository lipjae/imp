

var naverLogin = new naver.LoginWithNaverId({
    clientId: "buniXVCiAaaHIjxxHXO0",
    callbackUrl: "http://localhost:8080/api/login",
    isPopup: false, /* 팝업을 통한 연동처리 여부 */
  });



/* 설정정보를 초기화하고 연동을 준비 */
naverLogin.init();

// api_url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=buniXVCiAaaHIjxxHXO0&redirect_uri=http://localhost:8080/api/login&state=RAMDOM_STATE';

export default naverLogin
