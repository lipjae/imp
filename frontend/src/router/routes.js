
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
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
      { path: 'kakao', component: () => import('pages/Kakao.vue') }
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
