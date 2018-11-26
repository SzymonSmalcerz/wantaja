let hamburger = document.getElementById('hamburger_img');
let ul = document.getElementById('menu');
let nav = document.getElementById('navigator');
let loginButton = document.getElementById('loginButton');
let registerButton = document.getElementById('registerButton');
let loginForm = document.getElementById('loginForm');
let registerForm = document.getElementById('registerForm');
let formsContainer = document.getElementById('formsContainer');
let main_popup = document.getElementById('main_popup');
let close_img = document.getElementById('close_img');

hamburger.addEventListener('click', function() {
  ul.classList.toggle('block_sm');
  nav.classList.toggle('unwrapped');
});

if(loggedIn) {
  console.log("logged in !!!!");
  let main_popup_text = document.querySelector('#main_popup .middle_item-text');
  main_popup_text.innerHTML = '<br><br><br><h1>Start game !</h1>';

  let main_popup_form = document.querySelector('#main_popup form');
  main_popup_form.action = '/game';
  main_popup_form.method += 'get';

  let main_popup_button = document.querySelector('#main_popup button');
  main_popup_button.innerHTML = "PLAY !";

  loginButton.innerText = "Log out";
  loginButton.setAttribute('href', '/logout');

} else {
  let main_popup_button = document.querySelector('#main_popup button');
  main_popup_button.addEventListener('click', function(event) {
    formsContainer.classList.toggle('block');
    registerForm.classList.toggle('block');
    main_popup.classList.toggle('none');
    close_img.classList.toggle('none');
    close_img.openedForm = registerForm;
    event.preventDefault();
  });

  loginButton.addEventListener('click', function() {
    formsContainer.classList.toggle('block');
    loginForm.classList.toggle('block');
    main_popup.classList.toggle('none');
    close_img.classList.toggle('none');
    close_img.openedForm = loginForm;
  });
}

registerButton.addEventListener('click', function() {
  formsContainer.classList.toggle('block');
  registerForm.classList.toggle('block');
  main_popup.classList.toggle('none');
  close_img.classList.toggle('none');
  close_img.openedForm = registerForm;
});

close_img.addEventListener('click', function() {
  console.log(close_img.openedForm);
  if(close_img.openedForm) {
    close_img.openedForm.classList.toggle('block');
    close_img.openedForm = null;
    main_popup.classList.toggle('none');
    close_img.classList.toggle('none');
    formsContainer.classList.toggle('block');
  }
})
