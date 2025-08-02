<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Laravel React App</title>

    <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">

    @viteReactRefresh
    @vite('resources/js/app.jsx')
</head>


<body class="antialiased">
    <div id="root"></div>
</body>

</html>
