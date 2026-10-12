import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/overview' },
    { path: '/overview', name: 'overview', component: () => import('@/views/OverviewView.vue'), meta: { title: 'Overview' } },
    { path: '/residents', name: 'clients', component: () => import('@/views/ClientsView.vue'), meta: { title: 'Residents' } },
    { path: '/residents/:id', name: 'client', component: () => import('@/views/ClientDetailView.vue'), meta: { title: 'Resident profile' } },
    { path: '/journal', name: 'journal', component: () => import('@/views/JournalView.vue'), meta: { title: 'Journal' } },
    { path: '/incident-report', name: 'incident', component: () => import('@/views/IncidentView.vue'), meta: { title: 'Incident report' } },
    { path: '/shift-handover', name: 'handover', component: () => import('@/views/HandoverView.vue'), meta: { title: 'Shift handover' } },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
