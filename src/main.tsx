import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import {
  ChakraProvider,
  ColorModeScript,
  createStandaloneToast
} from '@chakra-ui/react'

import BasicLayout from '@layout/basicLayout'
import WrapperElement from '@components/WrapperElement/index'

import routers from './config'
import theme from './theme'

import './assets/style/animation.less'

const { ToastContainer } = createStandaloneToast({ theme })

const App = () => {
  const location = useLocation()

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ToastContainer />
      <TransitionGroup component={null}>
        <CSSTransition key={location.key} timeout={300} classNames="page">
          <Routes>
            <Route element={<BasicLayout />}>
              {routers.map(({ element, ...props }) => (
                <Route
                  key={props.path}
                  {...props}
                  element={<WrapperElement Component={element} />}
                />
              ))}
            </Route>
          </Routes>
        </CSSTransition>
      </TransitionGroup>
    </ChakraProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
