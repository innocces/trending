import React, { lazy } from 'react'

export default [
  {
    path: '/',
    element: lazy(() => import('@page/Home/index')),
    index: true
  },
  {
    path: '/search/:key',
    element: lazy(() => import('@page/Search/index'))
  }
]
