
const routes = [
  {
    path: '/',
    component: () => import('layouts/Index.vue'),
    children: [
      { path: 'signIn', component: () => import('pages/user/SignIn.vue') },
      { path: 'signUp', component: () => import('pages/user/SignUp.vue') }
    ]
  },
  {
    path: '/api',
    component: () => import('layouts/ApiLayout'),
    children: [
      { path: '', component: () => import('pages/CardList.vue') },
      { path: 'payment', component: () => import('pages/Payment.vue') },
      { path: 'orderList', component: () => import('pages/OrderList.vue') },
      { path: 'login', component: () => import('pages/Login.vue') },
      { path: 'kakao', component: () => import('pages/Kakao.vue') },
      { path: 'callback', component: () => import('pages/Callback.vue') }
    ],
    props: { default: true }
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
