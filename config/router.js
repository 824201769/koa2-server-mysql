module.exports = [
  {
    id: 1,
    title: 'admin',
    // 此权限可以访问哪些前端路由
    router: [
      'home',
      'notice',
      'teacher',
      'course',
      'account',
      'notice_show',
      'adminAccount',
      'courseFrom',
      'courseware',
    ],
  },
  {
    id: 2,
    title: 'school',
    router: ['teacher', 'home', 'notice_show', 'course', 'courseware'],
  },
  {
    id: 3,
    title: 'teacher',
    router: ['teaching', 'courselist', 'courseware', 'notice_show'],
  },
];
