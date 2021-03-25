/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
// 🐨 you're going to need this:
import * as auth from 'auth-provider'
import * as colors from 'styles/colors'
import {client} from './utils/api-client'
import {useAsync} from './utils/hooks'
import {FullPageSpinner} from './components/lib'
import {AuthenticatedApp} from './authenticated-app'
import {UnauthenticatedApp} from './unauthenticated-app'

async function getUser() {
  let user = null

  const token = await auth.getToken()
  if (token) {
    const data = await client('me', {token})
    user = data.user
  }

  return user
}

function App() {
  const {
    data: user,
    error,
    isError,
    isSuccess,
    run,
    setData,
  } = useAsync()

  React.useEffect(() => {
    run(getUser())
  }, [run])

  const login = form => auth.login(form).then(user => setData(user))

  const register = form => auth.register(form).then(user => setData(user))

  const logout = () => {
    auth.logout()
    setData(null)
  }
  // 🐨 if there's a user, then render the AuthenticatedApp with the user and logout
  // 🐨 if there's not a user, then render the UnauthenticatedApp with login and register

  let component = <FullPageSpinner />
  if(isSuccess) {
    component = (user) ?
      <AuthenticatedApp user={user} logout={logout} /> :
      <UnauthenticatedApp login={login} register={register} />
  }
  else if(isError) {
    component = (
      <div
        css={{
          color: colors.danger,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <p>Uh oh... There's a problem. Try refreshing the app.</p>
        <pre>{error.message}</pre>
      </div>
    )
  }
  return component
}

export {App}

/*
eslint
  no-unused-vars: "off",
*/
