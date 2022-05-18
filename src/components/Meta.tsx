import Head from 'next/head'

const Meta = () => {
  return (
    <Head>
      <meta name='application-name' content='Gittodoro.' />
      <meta name='apple-mobile-web-app-capable' content='yes' />
      <meta name='apple-mobile-web-app-status-bar-style' content='default' />
      <meta name='apple-mobile-web-app-title' content='Gittodoro.' />
      <meta name='format-detection' content='telephone=no' />
      <meta name='mobile-web-app-capable' content='yes' />
      <meta name='msapplication-config' content='/icons/browserconfig.xml' />
      <meta name='msapplication-TileColor' content='#F6BD41' />
      <meta name='msapplication-tap-highlight' content='no' />

      <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
      <meta name="theme-color" content="#242526" media="(prefers-color-scheme: dark)" />
      <meta name="background-color" content="#ffffff" media="(prefers-color-scheme: light)" />
      <meta name="background-color" content="#242526" media="(prefers-color-scheme: dark)" />

      <link rel='apple-touch-icon' href='/icons/touch-icon-iphone-retina.png' />
      {/* <link rel='apple-touch-icon' sizes='152x152' href='/icons/touch-icon-ipad.png' /> */}
      <link rel='apple-touch-icon' sizes='180x180' href='/icons/touch-icon-iphone-retina.png' />
      {/* <link rel='apple-touch-icon' sizes='167x167' href='/icons/touch-icon-ipad-retina.png' /> */}

      {/* <link rel='icon' type='image/png' sizes='32x32' href='/icons/favicon-32x32.png' /> */}
      {/* <link rel='icon' type='image/png' sizes='16x16' href='/icons/favicon-16x16.png' /> */}
      <link rel='manifest' href='/manifest.json' />
      {/* <link rel='mask-icon' href='/icons/safari-pinned-tab.svg' color='#5bbad5' /> */}
      <link rel='shortcut icon' href='/favicon.ico' />
      {/* <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500' /> */}

      <meta charSet="UTF-8" />
      <meta name="title" content="Gittodoro. | Pomodoro Task Tracker" />
      <meta name="description" content="A Github Issues progress tracker using the Pomodoro Technique." />
      <meta name="keywords" content="productivity,pomodoro,git,github,issues,progress,tracker" />
      <meta name="author" content="Maricris E." />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://gittodoro.web.app/" />
      <meta property="og:title" content="Gittodoro. | Pomodoro Task Tracker" />
      <meta property="og:description" content="A Github Issues progress tracker using the Pomodoro Technique." />
      <meta property="og:image" content="https://gittodoro.web.app/assets/timer-screen-shot.png" />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://gittodoro.web.app/" />
      <meta property="twitter:title" content="Gittodoro. | Pomodoro Task Tracker" />
      <meta property="twitter:description" content="A Github Issues progress tracker using the Pomodoro Technique." />
      <meta property="twitter:image" content="https://gittodoro.web.app/assets/timer-screen-shot.png" />

      {/*  <link rel='apple-touch-startup-image' href='/images/apple_splash_2048.png' sizes='2048x2732' />
      <link rel='apple-touch-startup-image' href='/images/apple_splash_1668.png' sizes='1668x2224' />
      <link rel='apple-touch-startup-image' href='/images/apple_splash_1536.png' sizes='1536x2048' />
      <link rel='apple-touch-startup-image' href='/images/apple_splash_1125.png' sizes='1125x2436' />
      <link rel='apple-touch-startup-image' href='/images/apple_splash_1242.png' sizes='1242x2208' />
      <link rel='apple-touch-startup-image' href='/images/apple_splash_750.png' sizes='750x1334' />
      <link rel='apple-touch-startup-image' href='/images/apple_splash_640.png' sizes='640x1136' /> */}
    </Head>
  )
}

export default Meta