<template>
  
</template>

<script>

import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'	
import jsonp from 'jsonp'
import naver_id_login from 'src/boot/naver'


export default {
	mounted () {
		this.naverCallback()
	},
	methods: {
		...mapActions({
      afterLogin: 'member/afterLogin'
		}),
		naverCallback: async function () { 

			var vm = this

			var token = naver_id_login.oauthParams.access_token;
			
			var authResult = await $.ajax({
				url: "https://openapi.naver.com/v1/nid/getUserProfile.json?response_type=json",
				type: "GET",
				data: {"access_token":token},
				dataType: "jsonp",
				jsonp: "oauth_callback"
			});

			if(authResult.message == 'success'){
				vm.afterLogin({type: 'naver', data: authResult.response})
				vm.$router.push('/api/login')
			}else{

			}
			
			
		}
	}

}

</script>

<style>

</style>