interface JQuery{
  myPlugin: () => void;
}

$.fn.myPlugin = () => {
  console.log('test');
  
}


$('#root').myPlugin();