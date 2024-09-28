import { createRouter, createWebHistory } from 'vue-router';
import TheNoSelectionColumn from '@/components/column-post/TheNoSelectionColumn.vue';
import ThePostColumns from '@/components/column-post/ThePostColumns.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'no-selection',
      path: '/',
      component: TheNoSelectionColumn,
    },
    {
      name: 'post',
      path: '/story/:postId',
      component: ThePostColumns,
      props: ({ params }) => ({
        postId: Number.parseInt(params.postId as string),
      }),
    },
  ],
});

export default router;
