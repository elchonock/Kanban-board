"use strict";

document.addEventListener("DOMContentLoaded", function() {

    class KanbanAPI{
        static getItems(columnId) {
            const column = read().find(column=> column.id == columnId);

            if (!column) {
                return [];
            }

            return column.items;
        }
        static insertItem(columnId, content) {
            const data = read();
            const column = data.find(column=> column.id == columnId);
            const item = {
                id: Math.floor(Math.random() * 1000000),
                content
            };
            if (!column){
                throw new Error('column does not exist');
            }
            column.items.push(item);
            save(data);

            return item;

        }
        static updateItem(itemId, newProps) {
            const data = read();
            const [item, currentColumn] = (()=>{
                for (const column of data){
                    const item = column.items.find(i=>i.id == itemId);
                    if (item) {
                        return [item, column];
                    }

                }
                if (!item) {
                    throw new Error('no such item');
                }
            })();

            item.content = newProps.content ?? item.content;
//----update column and position--------------------------------------
            if (newProps.columnId != undefined && newProps.position != undefined) {
                const targetColumn = data.find(col=>col.id == newProps.columnId);
                if (!targetColumn){
                    throw new Error('target column not found');
                }
        //-------delete-item-from-current-column----------------------------------------------
                currentColumn.items.splice(currentColumn.items.indexOf(item), 1);
        //------move-item-into-new-column-----------------------------------------------------
                targetColumn.items.splice(newProps.position, 0, item);
            }
            
            save(data);

        }
        static deleteItem(itemId) {
            const data = read();
            for (const column of data) {
                const item = column.items.find(i => i.id == itemId);
                if (item){
                    column.items.splice(column.items.indexOf(item), 1);
                }
   
            }

            save(data);
        }

    }

    function read() {
        const json = localStorage.getItem('kanban_data');
        if (!json) {
            return [
                {
                    id: 1,
                    items:[]
                },
                {
                    id: 2,
                    items:[]
                },
                {
                    id: 3,
                    items:[]
                },
                {
                    id: 4,
                    items:[]
                },
            ];
        }
        return JSON.parse(json);
    }

    function save(data) {
        localStorage.setItem('kanban_data', JSON.stringify(data));
    }


    // console.log(KanbanAPI.insertItem(2, 'new'));

    KanbanAPI.deleteItem(553715);














////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

    // function testWebP(callback) {
    //     let webP = new Image();
    //     webP.onload = webP.onerror = function () {
    //         callback(webP.height == 2);
    //     };
    //     webP.src = 
    //     "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    // }
    // testWebP(function (support) {
    //     if (support == true) {
    //         document.querySelector("body").classList.add("webp");
    //     } else {
    //         document.querySelector("body").classList.add("no-webp");
    //     }
    // });


    // function ibg(){

    //     let ibg = document.querySelectorAll(".ibg");
    //     for (var i = 0; i < ibg.length; i++) {
    //     if(ibg[i].querySelector('img')){
    //     ibg[i].style.backgroundImage = 'url('+ibg[i].querySelector('img').getAttribute('src')+')';
    //     }
    //     }
    //     }
        
    // ibg();




    // //__________________________________________________________________________
    // //______________________________________________________________________
    // // Scroll

    // const topBtn = document.querySelectorAll(".to_top");
    // const page = document.querySelector(".page");


    // //Scroll to top
    // let t; 
    // function scrolltop() { 
    //     let top = Math.max(document.body.scrollTop, page.scrollTop); 
    //     if (top > 0) { 
    //         // page.scrollTo(0, Math.floor(top/1.4)); 
    //         page.scrollTo({
    //             top: Math.floor(top/1.4),
    //             behavior: "smooth"
    //         });

    //         t = setTimeout(scrolltop, 30); 
    //     } else { 
    //         clearTimeout(t); 
    //     } 
    //     return false; 
    // }

    // // Scroll top click
    // topBtn.forEach(item => {
    //     item.addEventListener("click", (e) => {
    //         if (!document.body.classList.contains("_touch")){
    //         e.preventDefault();
    //         scrolltop();
    //         }
    //     });
    // });


    // //------------------------------------------------------------------------------------
    // //Scroll to Elements--------------------------------------------------------------------
    // let scrollToIdTimerId;

    // //Old Working Scroll Func--------------------------------------------------------------------
    // //--------------------------------------------------------------------------------------
    // // For chrome

    // function scrollToId(id) {
    //     scrollToIdFunc();
    //     function scrollToIdFunc() {
    //         if (document.documentElement.scrollHeight <= 1040) {
    //             const point = document.querySelector(id).getBoundingClientRect().top;            
    //             if (point > 800) { 
    //                 // page.scrollTop = Math.floor((page.scrollTop + 10) * 1.25);
    //                 page.scrollTo({
    //                     top: Math.floor((page.scrollTop + 10) * 1.25),
    //                     behavior: "smooth",

    //                 });
    //                 scrollToIdTimerId = setTimeout(scrollToIdFunc, 20); 
        
    //             } else if(point > 1 && point < 800){
    //                 // page.scrollTop = Math.floor(page.scrollTop + 75);
    //                 page.scrollTo({
    //                     top: Math.floor(page.scrollTop + 10),
    //                     behavior: "smooth",
    //                 });
    //                 scrollToIdTimerId = setTimeout(scrollToIdFunc, 5); 
        
    //             } else { 
    //                 clearTimeout(scrollToIdTimerId); 
    //             } 
    //             return false; 
    //         } else {
    //             const point = document.querySelector(id).getBoundingClientRect().top - (document.documentElement.scrollHeight - 1040);
    //             if (point > 800) { 
    //                 // page.scrollTop = Math.floor((page.scrollTop + 10) * 1.25);
    //                 page.scrollTo({
    //                     top: Math.floor((page.scrollTop + 10) * 1.25),
    //                     behavior: "smooth",

    //                 });
    //                 scrollToIdTimerId = setTimeout(scrollToIdFunc, 20);
    //             } else if(point > 0 && point < 800){
    //                 // page.scrollTop = Math.floor(page.scrollTop + 20);
    //                 page.scrollTo({
    //                     top: Math.floor(page.scrollTop + 20),
    //                     behavior: "smooth",

    //                 });
    //                 scrollToIdTimerId = setTimeout(scrollToIdFunc, 10); 
    //             } else { 
    //                 clearTimeout(scrollToIdTimerId); 
    //             } 
    //             return false; 
    //         }
    //     }  
    // }

    // //-------------------------------------------------------------------------------------------
    // //--------------------------------------------------------------------------------------------




    // //Scroll click
    // const navElements = document.querySelectorAll("[data-nav]");

    // //old-----------------------------------------------
    // // navElements.forEach(elem => {
    // //     elem.addEventListener("click", (e) => {
    // //         e.preventDefault();
    // //         const idToScrollTo = e.target.getAttribute("data-nav");
    // //         scrollToId(idToScrollTo);
    // //     });
    // // });
    // //----------------------------------------------------------


    // //New Scroll for other browsers
    // navElements.forEach(elem => {
    //     elem.addEventListener("click", (e) => {
    //         if (!document.body.classList.contains("_touch")){
    //             e.preventDefault();
    //             const elemScrollTo = document.querySelector(e.target.getAttribute("data-nav"));
    //             const idToScrollTo = e.target.getAttribute("data-nav");
    //             // const point = elemScrollTo.getBoundingClientRect().top + page.scrollTop - document.querySelector("header").offsetHeight;
    //             const point = elemScrollTo.getBoundingClientRect().top + page.scrollTop;
    //             if (navigator.userAgent.match(/Chrome/i)){
    //                 scrollToId(idToScrollTo);
        
    //             } else {
    //                 page.scrollTo({
    //                     top: point,
    //                     behavior: "smooth",
    //                 });
    //             }
    //         }


    //     });
    // });




    // //_____________________________________________________________________
    // // Slider and Open / Close Photo
    // function photos() {
    //     let slideIndex = 1;
    //     const photoContainer = document.querySelector(".wrapper");
    //     const slides = document.querySelectorAll(".content_row_item");
    //     const prev = document.querySelector(".prev");
    //     const next = document.querySelector(".next");
    //     next.style = "-webkit-tap-highlight-color: transparent;";
    //     prev.style = "-webkit-tap-highlight-color: transparent;";
    //     slides.forEach(i=>i.style = "-webkit-tap-highlight-color: transparent;");

    //     const photoPopup = document.createElement("div");
    //     photoPopup.classList.add("popup_photo");
    //     photoPopup.style = "-webkit-tap-highlight-color: transparent;";

    //     const bigPhoto = document.createElement("img");
    //     const bigPhotoWrapper = document.createElement("div");
    //     bigPhotoWrapper.classList.add("bigPhotoWrapper");
    //     bigPhotoWrapper.style = "-webkit-tap-highlight-color: transparent;";
    //     bigPhoto.style = "-webkit-tap-highlight-color: transparent;";

    //     const closeX = document.createElement("div");
    //     closeX.classList.add("closeX");
    //     closeX.style = "-webkit-tap-highlight-color: transparent;";

    //     photoContainer.appendChild(photoPopup);
    //     photoPopup.appendChild(bigPhotoWrapper);
    //     photoPopup.appendChild(prev);
    //     photoPopup.appendChild(next);
    //     bigPhotoWrapper.appendChild(bigPhoto);
    //     bigPhotoWrapper.appendChild(closeX);

    //     // path to img that was clicked first
    //     let pathBPh;

    // // open-close photo____________________
    //     photoContainer.addEventListener("click", (event) => {
    //         // event.preventDefault();
    //         //Open photo
    //         if (event.target && event.target.classList.contains("content_row_item")){
    //             event.preventDefault();
    //             next.style.display = "block";
    //             prev.style.display = "block";
    //             photoPopup.style.display = "flex";
    //             photoPopup.style.overflow = "hidden";
    //             pathBPh = event.target.getAttribute("data-photo");
    //             bigPhoto.setAttribute("src", pathBPh);
    //             bigPhoto.classList.add("fadeOne");

    //             slides.forEach((item, index) => {
    //             if (pathBPh == item.getAttribute("data-photo")){
    //                 slideIndex = index;
    //             }
    //             }); 

    //         }
    //         //Close photo
    //         if (event.target && event.target.matches("div.popup_photo")){
    //             photoPopup.style.display = "none";
    //             photoPopup.style.overflow = "";
    //             bigPhoto.classList.remove("fadeTwo");
    //         }
    //     });

    //     //Close photo
    //     closeX.addEventListener("click", () =>{
    //         photoPopup.style.display = "none";
    //         photoPopup.style.overflow = "";
    //         bigPhoto.classList.remove("fadeTwo");
    //     });
    //     //___________________________

    //     //Slider
    //     next.addEventListener("click", (event)=>{
    //         if (slideIndex+1 < slides.length){
    //             bigPhoto.setAttribute("src", slides[slideIndex+1].getAttribute("data-photo"));
    //             slideIndex++;
    //             bigPhoto.classList.toggle("fadeOne");
    //             bigPhoto.classList.toggle("fadeTwo");

    //         } else {
    //             slideIndex = 0;
    //             bigPhoto.setAttribute("src", slides[slideIndex].getAttribute("data-photo"));
    //             bigPhoto.classList.toggle("fadeOne");
    //             bigPhoto.classList.toggle("fadeTwo");
    //         }
    //     });

    //     prev.addEventListener("click", (event)=>{
    //         if (slideIndex > 0){
    //             bigPhoto.setAttribute("src", slides[slideIndex-1].getAttribute("data-photo"));
    //             slideIndex--;
    //             bigPhoto.classList.toggle("fadeOne");
    //             bigPhoto.classList.toggle("fadeTwo");
    //         } else {
    //             slideIndex = slides.length - 1;
    //             bigPhoto.setAttribute("src", slides[slideIndex].getAttribute("data-photo"));
    //             bigPhoto.classList.toggle("fadeOne");
    //             bigPhoto.classList.toggle("fadeTwo");
    //         }
    //     });

    // }

    // photos();



    // // Bloom animation BgText
    // const bgPhotoText = document.querySelector(".static_bg_photo_row_H4_text");

    // function addBloomToBgPhoto() {
    //     if (Math.floor(bgPhotoText.getBoundingClientRect().top - document.documentElement.clientHeight <= -200)) {
    //         bgPhotoText.classList.add("bloom");
    //         bgPhotoText.style.opacity = "1";
    //         page.removeEventListener("scroll", addBloomToBgPhoto);
    //     }     
    //     return false;
    // }

    // page.addEventListener("scroll", addBloomToBgPhoto);

    // //Animation Portfolio
    // const contentItems = document.querySelectorAll(".content_row_item");
    // const content = document.querySelector(".content_row");

    // function addFadeToContent() {
    //     if (Math.floor(content.getBoundingClientRect().top - document.documentElement.clientHeight <= -100)) {
    //         // contentItems.forEach( i => {
    //         //     i.classList.add("fadeThree");  
    //         // });
    //         contentItems.forEach(function(i, index){
    //             setTimeout(function(){
    //                 i.classList.add("fadeOne");
                                    
    //             }, index*75);
                
    //         });
    
    //         page.removeEventListener("scroll", addFadeToContent);
    //     }     
    //     return false;
    // }

    // page.addEventListener("scroll", addFadeToContent);


    // //Preloader______________________________________________________
    // //_______________________________________________________________
    // // window.addEventListener("load", (e)=>{
    // //     const preloader = document.querySelector(".preloader");
    // //     setTimeout(function () {
    // //         // preloader.style.display = "none";   
    // //         preloader.classList.add("preloader_done");     
    // //     }, 500);
    // // });



    // //Burger__________________________________________________________
    // //________________________________________________________________

    // const burger = document.querySelector(".burger");
    // const menuBody = document.querySelector(".menu_body");
    // burger.addEventListener("click", showBurgerMenu);
    // menuBody.addEventListener("click", showBurgerMenu);


    // function showBurgerMenu() {
    //     menuBody.classList.toggle("_active");
    // }



    // //IsMobile
    // const isMobile = {
    //     Android: () => navigator.userAgent.match(/Android/i),
    //     BlackBerry: () => navigator.userAgent.match(/BlackBerry/i),
    //     iOS: () => navigator.userAgent.match(/iPhone|iPad|iPod/i),
    //     Opera: () => navigator.userAgent.match(/Opera Mini/i),
    //     Windows: () => navigator.userAgent.match(/IEMobile/i),
    //     any: () => {
    //         return (
    //         isMobile.Android() ||
    //         isMobile.BlackBerry() ||
    //         isMobile.iOS() ||
    //         isMobile.Opera() ||
    //         isMobile.Windows()
    //         );
    //     }
    // };

    // if (isMobile.any()) {
    //     document.body.classList.add("_touch");
    // } else {
    //     document.body.classList.add("_pc");
    // }



    // //_______________________________________________________________________________
    // //Hide Header
    // const social = document.querySelector(".social_media_panel");
    // const header = document.querySelector("#top");
    // const headerMB = document.querySelector(".menu_body");
    // // page.addEventListener("scroll", e=>{
    // //     const social = document.querySelector(".social_media_panel");
    // //     const header = document.querySelector("#top");
    // //     const headerMB = document.querySelector(".menu_body");


    // //     if (page.scrollTop > 80){
    // //         if (document.documentElement.clientWidth < 767){
    // //             social.classList.add("hidden_head");
    // //         }
    // //         header.classList.add("hidden_head");
    // //         headerMB.classList.add("hidden_head");
    // //     } else {
    // //         headerMB.classList.remove("hidden_head");
    // //         header.classList.remove("hidden_head");
    // //         social.classList.remove("hidden_head");
    // //     }

    // // });


    // //Show Header if scroll up

    // let lastScroll = 0;
    // const defaultOffset = 80;
    // const scrollPos = ()=> page.scrollTop;
    // const containHide = () => header.classList.contains('hidden_head');

    // page.addEventListener('scroll', () => {
    //     if(scrollPos() > lastScroll && !containHide() && scrollPos() > defaultOffset) {
    //         //scroll down
    //         if (document.documentElement.clientWidth < 767){
    //             social.classList.add("hidden_head");
    //         }

    //         header.classList.add('hidden_head');
    //         headerMB.classList.add("hidden_head");
    //     }
    //     else if(scrollPos() < lastScroll && containHide()){
    //         //scroll up
    //         header.classList.remove('hidden_head');
    //         social.classList.remove("hidden_head");
    //         headerMB.classList.remove("hidden_head");
    //     }

    //     lastScroll = scrollPos();
    // }) 


    // //____________________________________________________________________
    // //Form________________________________________________________________
    // //Show popup form--------------------------------------------------
    // const popupForm = document.querySelectorAll("._popupForm");
    // const popupsButton = document.querySelectorAll("[data-popup]");

    // popupsButton.forEach(btn=>{
    //     btn.addEventListener("click", showPopupForm);

    // });

    // function showPopupForm(e) {
    //     if (e.target.getAttribute("data-popup") == "_popupForm") {
    //         e.preventDefault();
    //         popupForm.forEach(form=>{
    //             form.classList.add("_active");
    //         });
    //     }   
    // }
    // //Close popup form---------------------------------------------

    // popupForm.forEach(form =>{
    //     form.addEventListener("click", e=>{
    //         if (e.target && e.target.classList.contains("popup__window") && form.classList.contains("_active")){
    //             form.classList.remove("_active");
    //         } else if (e.target && e.target.classList.contains("closeForm") && form.classList.contains("_active")) {
    //             form.classList.remove("_active");
    //             const preloaded = document.querySelectorAll('.file__preview');
    //             preloaded.forEach(p=>p.innerHTML = "");
    //         }
        
    //     });

    // });  




    // //Save Form data on google sheets

    // const forms = document.querySelectorAll("form");

    // const successMessage = document.querySelector(".status__success");
    // const failureMessage = document.querySelector(".status__failure");
    // const statusPopMessage = document.querySelector(".popup__status");

    // const fileInputs = document.querySelectorAll('[name="reference"]');





    // //close thanks window----------------------------------------------
    // statusPopMessage.addEventListener("click", (e)=>{
    //     if (e.target.classList.contains("popup__status")){
    //         statusPopMessage.classList.remove("_active");
    //     }

    // });
    // //------------------------------------------------------------------

    // const message = {
    //     loading:"../img/spinner.svg",
    //     success: "Thank you. We'll get in touch with you soon!",
    //     failure: "Something went wrong..."
    // };

    // forms.forEach(i=>{
    //     postData(i);
    // });

    // //--------------------------------------------------------------------
    // //-----add preview---------------------------------------------------------------
    // fileInputs.forEach(f=>{
    //     f.addEventListener('change', (e)=>{
    //     previewFile(f);
    //     });
    // });


    // //--------------------------------------------------------------------
    // //--------------------------------------------------------------------

    // const urlForm = "https://script.google.com/macros/s/AKfycbyKUbVsTFdGXejgm71mlV-AoSwCvJivHFvk8EDQPqfNJ_up8lHg-lsmTnwq423oEFyq/exec";
    // const urlImg = "https://script.google.com/macros/s/AKfycbw7q1hq38GVtseUZPH2J8B3c4UAnuJK-DQRGx4QIfYTzdjEiwqBhf_ItrV_fRGX3FHw/exec";

    // function postData(form) {
    //     form.addEventListener("submit", (e)=>{
    //         e.preventDefault();
    //         const statusMessage = document.createElement("img");
    //         statusMessage.src = message.loading;
    //         statusMessage.style.cssText = `
    //             display: block;
    //             margin: 0 auto;
    //             `;


    //         //Form validation---------------------------------------------------------------------
    //             let error = validateForm(form);
    //         //------------------------------------------------------------------------------------
    
    //         const formData = new FormData(form);

    //         // const object = {};
    //         // formData.forEach((value, key) =>{
    //         //     object[key] = value;
    //         // });
    //         // const json = JSON.stringify(object);


    //         const file = formData.get("reference");
    //         const fr = new FileReader();
    //         fr.readAsArrayBuffer(file);

    //         if (error === 0){
    //             form.append(statusMessage);
    //             fetchImg();
    //             fetchFormData();
    //         }

    //         const previewF = form.querySelector('.file__preview');
            

    //         function fetchImg() {
    //             fr.onload = f => {            
    //                 const qs = new URLSearchParams({filename: file.name, mimeType: file.type});

    //                 fetch(`${urlImg}?${qs}`, {method: "POST", body: JSON.stringify([...new Int8Array(f.target.result)]), mode:"no-cors"})
    //                 .then(()=>{previewF.innerHTML = '';})
    //                 .catch(err => console.log(err));
    //             };
                
    //         }

    //         function fetchFormData() {
    //             fetch(urlForm, {
    //                 method:'POST', 
    //                 body: formData, 
    //                 mode:"no-cors"
    //             })
    //             .then(()=>{
    //                 statusPopMessage.classList.remove("_active");
    //                 statusPopMessage.classList.add("_active");
    //                 successMessage.classList.add("_active");
    //                 previewF.innerHTML = '';
    //                 form.reset();
    //             })
    //             .catch(()=>{
    //                 statusPopMessage.classList.remove("_active");
    //                 statusPopMessage.classList.add("_active");
    //                 failureMessage.classList.add("_active");
    //             })
    //             .finally(()=>{
    //                 form.reset();
    //                 previewF.innerHTML = '';
    //                 setTimeout(()=>{
    //                     statusPopMessage.classList.remove("_active");
                        
    //                 }, 3000);
    //                 statusMessage.remove();
    //                 popupForm.forEach(form=>{
    //                     form.classList.remove("_active");
    //                     });
    //             });  
    //         }

    //     });    
    // }

    // //------------------------------------------------------------------------------------
    // //Form validation---------------------------------------------------------------------
    // function validateForm(form) {
    //     let error = 0;
    //     const formReqInputs = form.querySelectorAll("._req");
    //     formReqInputs.forEach((input, index)=>{
    //         removeErrorClass(input);
    //         if (input.getAttribute("name") === "email") {
    //             if (testEmail(input)) {
    //                 addErrorClass(input);
    //                 error++;
    //             } 
    //         } else if (input.getAttribute("type") === "checkbox" && input.checked === false) {
    //             addErrorClass(input);
    //             error++;
                    
    //         } else {
    //             if (input.value === "") {
    //                 addErrorClass(input);
    //                 error++;
    //             }
    //         }
    //     });
    //     return error;
        
    // }

    // function addErrorClass(input) {
    //     input.classList.add("_error");
    //     input.parentElement.classList.add("_error"); 
    // }

    // function removeErrorClass(input) {
    //     input.classList.remove("_error");
    //     input.parentElement.classList.remove("_error");
    // }

    // function testEmail(input) {
    //     return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value); 
    // }

    // //File Validation-------------------------------------------------------------------
    // function previewFile(fileInput) {
    //     let file = fileInput.files[0];
    //     //check type-------------------------------
    //     if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)){
    //         fileInput.value = "";
    //         return;
    //     }
    //     //check size--------------------------------
    //     if (file.size > 10*1024*1024){
    //         alert("Файл должен быть меньше 10МБ.")
    //         return;
    //     }

    //     const fileReader = new FileReader();
    //     fileReader.onload = function(e){
    //         const fileParent = fileInput.parentElement.parentElement;
    //     //---add preview---------------------
    //         let filePreview = fileParent.querySelector('.file__preview');
    //         filePreview.innerHTML = `<img src="${e.target.result}" alt="preview">`;
    //     };
    //     fileReader.onerror = function(e){
    //         alert('Что-то пошло не так...');
    //     };
    //     fileReader.readAsDataURL(file);
    // }







});