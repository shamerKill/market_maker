import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor() { }

  menuData = [
    {
      name: '',
      list: [
        {
          title: '账号管理',
          icon: 'icon-a-1',
          href: '/core/user/account-list',
        },
        {
          title: '手动操盘',
          icon: 'icon-a-2',
          href: '/core/trade/stocks',
        },
        {
          title: '操盘机器人',
          icon: 'icon-a-3',
          href: '/core/trade/robots',
        },
        {
          title: '机器人',
          icon: 'icon-a-3',
          href: '/core/trade/robot-list',
        },
        {
          title: '机器人日志',
          icon: 'icon-a-5',
          href: '/core/logs/robot-logs',
        },
        {
          title: '数据报表',
          icon: 'icon-a-6',
          href: '/core/logs/chart',
        },
        {
          title: '资产报表',
          icon: 'icon-a-7',
          href: '/core/logs/property',
        },
        {
          title: '报警系统',
          icon: 'icon-a-8',
          href: '/core/trade/alarms',
        }
      ]
    },
    {
      name: '用户设置',
      list: [
        {
          title: '用户中心',
          icon: 'icon-a-9',
          href: '/core/user/settings',
        },
        {
          title: '邀请好友',
          icon: 'icon-a-10',
          href: '/core/user/recharge',
        }
      ]
    },
    // {
    //   name: '支持',
    //   list: [
    //     {
    //       title: '新手教程',
    //       icon: 'icon-a-11',
    //       href: '/core/user/settings',
    //     },
    //     {
    //       title: '联系我们',
    //       icon: 'icon-a-12',
    //       href: '/core/user/settings',
    //     }
    //   ]
    // }
  ]
}
