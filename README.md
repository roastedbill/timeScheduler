# TimeSchduler

Simple JavaScript library to create HTML time sheets. Wrapped in an example project using Middleman …

You only have to include `dist/timesheet.js` and `dist/timesheet.css` in your HTML and initialize Timesheet.js with:

```HTML
<div id="timesheet"></div>
```

```javascript
var timeSheet = new Timesheet('timesheet', 1528128000, 1530720000, [
  ['1528071072', '1529663072', 'id', 'https://www.google.com.sg/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwjNru-V0JHcAhUGXisKHaV1D9IQjRx6BAgBEAU&url=https%3A%2F%2Fhelloheidishop.com%2Fproducts%2Fhello&psig=AOvVaw20nEXQv-e234WFANbxxvh-&ust=1531212220418589', '1', '5'],
  ['1529071072', '1530263072', 'id', 'https://www.microsoft.com/en-gb/CMSImages/WindowsHello_Poster_1920-1600x300-hello.png?version=0d8f51c7-ef87-b0af-8f26-453fb40b4b7d', '2', '3']
  ],
  [
  ['1529171072', '1529763072', 'id', 'https://www.google.com.sg/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwjfr6as0JHcAhVFWH0KHSKSDB8QjRx6BAgBEAU&url=https%3A%2F%2Fhello.com%2F&psig=AOvVaw20nEXQv-e234WFANbxxvh-&ust=1531212220418589', '2', '3'],
  ['1630063072', '1630663072', 'id', 'https://i.ytimg.com/vi/kJ2dr9jAThY/maxresdefault.jpg', '4', '6'],
  ], bubbleClickCallBack);

$( ".data" ).sortable({
  revert: true,
  cancel: '.separator',
});
```

### Bower

`$ > bower install https://github.com/sbstjn/timesheet.js.git`

## Grunt commands

Use `grunt` to build all JavaScript and StyleSheet files located inside `dist/`. 
