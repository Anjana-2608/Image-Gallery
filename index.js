//let res = https://api.allorigins.win/get?url=' +encodeURIComponent('https://picsum.photos/200/300';
// let data = await res.json();
// let url = data.contents;

let images = document.querySelectorAll('.image-container img');
let viewImage = document.querySelector('.view-image');
let targetImage = document.querySelector('.view-image img');
let closeBtn = document.querySelector('.view-image span');
let imageContainer = document.querySelector(".image-container");
let addImage = document.getElementsByTagName('button')[0];
let popUp = document.querySelector('.pop-up');
let closeInsidePopup = document.getElementById('close');
let overlay = document.querySelector('.overlay');
let submitBtn = document.querySelector('.submit');
const titleInput = document.getElementById('title');
const urlInput = document.getElementById('URL');
const loader=document.querySelector('.loader');
let start = 0;
let end = 8;

closeBtn.addEventListener('click', function () {
    viewImage.style.display = 'none';
})

function activateLoader() {
    loader.style.display = 'inline-block';
    overlay.style.display = 'block';
}

function deActivateLoader() {
    loader.style.display = 'none';
    overlay.style.display = 'none';
}

let isFetching = false;
let noMoreImages = false;

const getImage = async () => {
    if (isFetching || noMoreImages) return;
    isFetching = true;
    activateLoader();    

    try {
        const res = await fetch(`https://ak-backend-2a1z.onrender.com/api/images?start=${start}&end=${end}`);
        const data = await res.json();

        if (data.length === 0) {
            noMoreImages = true; // Prevent further API calls
            window.removeEventListener('scroll', scrollHandler);
            return;
        }

        for (let i = 0; i < data.length; i++) {
            let url = `data:image/jpeg;base64,${data[i].url}`;
            let img = document.createElement('img');
            img.src = url;
            imageContainer.appendChild(img);
            img.addEventListener('click', function (e) {
                viewImage.style.display = 'flex';
                targetImage.src = e.target.src;
            });
        }

        start = end;
        end = end + 8;
    } catch (err) {
        console.error("Image fetch failed:", err);
    } finally {
        deActivateLoader();
        setTimeout(() => { isFetching = false }, 500); // delay releasing flag
    }
};

window.addEventListener('scroll',function(e){
    let {clientHeight,scrollHeight,scrollTop}=e.target.documentElement;
    console.log(clientHeight);
    console.log(scrollHeight);
    console.log(scrollTop);
    if(scrollTop + clientHeight >= scrollHeight)
    {
        getImage();
    }
})


getImage();

function isValidBase64(str) {
  const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  return base64Regex.test(str);
}

addImage.addEventListener('click', function (e) {
    popUp.style.display = 'flex';
    overlay.style.display = 'block';
})

closeInsidePopup.addEventListener('click', function () {
    popUp.style.display = 'none';
    overlay.style.display = 'none';
    titleInput.value="";
    urlInput.value="";
})

overlay.addEventListener('click', function (e) {
    if (e.target === overlay) { // click occurred directly on the overlay
        popUp.style.display = 'none';
        overlay.style.display = 'none';
    }
});

submitBtn.addEventListener('click', async function (e) {
    e.preventDefault();

    const title = titleInput.value.trim();
    const url = urlInput.value.trim();
    
    // if(!url)
    // {
    //   alert("URL can not be empty, Please provide the URL");
    //   return;
    // }
    if(!title)
    {
       let confirmVal= confirm("Are you sure! that you don't want to give title");
       if(!confirmVal)
       {
        return;
       }
    }

    if(!isValidBase64(url))
    {
        alert("Please Enter Valid URL in Base64 format");
    }

    // if(title && !typeof(title)=='string')
    // {
    //  alert("Title Name should be alphanumeric");
    // }
    popUp.style.display='none';
    const payLoad = { title, url }

    try {
        activateLoader();
        popUp.style.opacity=0.8;
        const res = await fetch('https://ak-backend-2a1z.onrender.com/api/images', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payLoad)
        });
        if (res.ok) {
            const data = await res.json();
            console.log("success", data);
            alert("Image added sucessfully");
            title = " ";
            url = " ";
            popUp.style.display = 'none';
            overlay.style.display = 'none';
        }
        else {
            const errorData = await res.json();
            console.log("Error", errorData);
            alert(errorData.error);
        }
    }
    catch (err) {
        console.log("Network Error", err);
    }
    finally{
        deActivateLoader();
        
        popUp.style.opacity=1;
    }
})



