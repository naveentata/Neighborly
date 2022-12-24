//NavBar
console.log("Hesdafaewrf")

let apigClient = apigClientFactory.newClient();


var idToken = null;

async function checkLogin() {
    if (localStorage.hasOwnProperty('access_token')){
        let token_details = parseJwt(localStorage.getItem("login_token"))
        document.getElementById("welcomeMsg").innerHTML = "Signed in as "+token_details['cognito:username'];
        // document.getElementById("log_but").style.display = "none"
        console.log("Inside Login")
        var url_string = window.location;
        var url = new URL(url_string);
        console.log(url)
        let post_id = url.href.split('post_id=')[1].trim()
        localStorage.setItem("post_id",post_id);
        get_post_replies(post_id)
        let postres = await getpostdetails(post_id)
        console.log(postres)
        document.getElementsByClassName('topic-container')[0].children[0].children[1].textContent = postres.data['content']
    }
    // console.log("Inside Login")
    // var url_string = window.location;
    // var url = new URL(url_string);
    // console.log(url)
    // let post_id = url.href.split('post_id=')[1].trim()
    // localStorage.setItem("post_id",post_id);
    // // hash = url.hash
    // // tokens = hash.split("&")
    // // let idToken = tokens[0].slice(10)
    // // let access_token = tokens[1].slice(13)
    // let idToken = localStorage.getItem("login_token");
    // let access_token = localStorage.getItem("access_token");
    
    

    // if (idToken != null) {
    //     console.log("Inside Idtoken")
    //     document.getElementById("welcomeMsg").innerHTML = "signed in";
    //     // // auth();
    //     // localStorage.setItem("login_token",idToken);
    //     // localStorage.setItem("access_token",access_token);
    //     get_post_replies(post_id)
    //     // getUsername(103)
    // }


}

async function getpostdetails(post_id){
    let access_token = localStorage.getItem('access_token');

    var additionalParams = {

    };



    var params = {
        "postId": post_id,
        "Authorization": "Bearer " + access_token
    }
    let res = {}
    try{
        // return new Promise(resolve => {
            
        //   });
        await apigClient.userPostPostIdGet(params, body={}, additionalParams={}).then(function(result){
            console.log("This is user id resutl: ",result);
            res = result
        }).catch(function(result){
            console.log("THis is user ERR: ",result);
        });
        // console.log(data)
       
    }
    catch(err){
        console.log("**********")
        console.log(err)
    }
    return res;
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

// *********** Like
function liked(){
    var element = document.getElementById("like");
    element.classList.toggle("liked");
  }

// ****************************************
// Post comments

function submit_data(){
    let image_name = document.getElementById('myFile').files;
    if (image_name.length!=0){
        let image_name_base = ""
        image_name_base = image_name[0].name;
        console.log(image_name_base,"navesdfe")
        // localStorage.setItem('image_name_base',image_name_base)
        // console.log("*************",image_name_base)
        submitPhoto()
    }
    let comment_data = document.getElementById('myComment').value;
    let access_token = localStorage.getItem('access_token')
    // submitPhoto()
    var m = new Date();
    var dateString = m.getUTCFullYear() +"-"+ (m.getUTCMonth()+1) +"-"+ m.getUTCDate() + " " + m.getUTCHours() + ":" + m.getUTCMinutes() + ":" + m.getUTCSeconds();
    body={
        'user_id':localStorage.getItem("login_token"),
        'content': comment_data,
        'image': image_name.length!=0 ? image_name[0].name : "black.jpeg" ,
        'likes':0,
        'timestamp':dateString
    }
    console.log(body)
    var params = {
        "postId": localStorage.getItem("post_id"),
        "Authorization": "Bearer " + access_token
    }
    try{
        apigClient.userPostPostIdUserReplyPost(params, body, additionalParams={}).then(function(result){
            console.log(result);
        }).catch(function(result){
            console.log("ERR",result);
        });
        // console.log(data)
    }
    catch(err){
        console.log(err)
    }
    localStorage.setItem("image_name_base","black.jpeg");
    // location.reload();


}


function convertImgBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let encoded = reader.result.replace(/^data:(.*;base64,)?/, '');
        if ((encoded.length % 4) > 0) {
          encoded += '='.repeat(4 - (encoded.length % 4));
        }
        resolve(encoded);
      };
      reader.onerror = error => reject(error);
    });
  }
  
  function imgSuccess() {
    alert("Image Uploaded Successfully");
  }
  
  function imgFail() {
    alert("Image Not Uploaded. Try Again!");
  }
  

  function submitPhoto1(){

        var photo = document.getElementById("myFile").files[0];
        // var labels = document.getElementById("custom_labels").value;

        var xhr = new XMLHttpRequest();
        var url = "https://4pttas3dhk.execute-api.us-east-1.amazonaws.com/v1/uploadImage/"+photo.name
        xhr.open("PUT", url);
        xhr.setRequestHeader("Content-Type", 'image/jpeg');
        xhr.setRequestHeader("Authorization", localStorage.getItem("access_token"));
        // xhr.setRequestHeader("x-amz-meta-customLabels", labels);
        xhr.send(photo);
    
  }

  function submitPhoto()
  {
     var img_file = document.getElementById('myFile').files[0];

     console.log("akash", img_file.name);
    //  var mlabels = document.getElementById('clabel').value;
     
     var base64_image = convertImgBase64(img_file).then(
       promise_data => {
    //    var apigClient = apigClientFactory.newClient();
       
       var access_token = localStorage.getItem('access_token');
       var request_body = promise_data;
       var params = {"image" : img_file.name, "Content-Type" : img_file.type,  "Authorization": "Bearer " + access_token};
       
       console.log(params)
  
       var additionalParams = {};
  
       apigClient.uploadImageImagePut(params, request_body , additionalParams).then(function(res){
         if (res.status == 200)
         {  
           imgSuccess();
         }
         else{
          imgFail();
         }
       })
     });
  }



// ****************************************

async function getUsername(author){
    let access_token = localStorage.getItem('access_token');

    var additionalParams = {

    };



    var params = {
        "userId": author,
        "Authorization": "Bearer " + access_token
    }
    let res = {}
    try{
        // return new Promise(resolve => {
            
        //   });
        await apigClient.userUserIdGet(params, body={}, additionalParams={}).then(function(result){
            console.log("This is user id resutl: ",result);
            res = result
        }).catch(function(result){
            console.log("THis is user ERR: ",result);
        });
        // console.log(data)
       
    }
    catch(err){
        console.log("**********")
        console.log(err)
    }
    return res;
}

async function get_post_replies(post_id){

    let userId = localStorage.getItem('login_token');
    let access_token = localStorage.getItem('access_token');
    console.log("))))))))))))",userId)
    console.log(access_token)
    var params = {
        "postId": post_id,
        "Authorization": "Bearer " + access_token
    }
        //This is where any header, path, or querystring request params go. The key is the parameter named as defined in the API
        

    var additionalParams = {
        
        // "Authorization": "Bearer " + access_token
        
        //If there are any unmodeled query parameters or headers that need to be sent with the request you can add them here
        
        
    };
    try{
        apigClient.userPostPostIdUserReplyGet(params, body={}, additionalParams={}).then(async function(result){
            console.log(result);
            let replies_data = result.data
            let parent_div = document.getElementsByClassName("container")[0]
            for (var i = 0; i < replies_data.length; i++) {
                // Create the outer div element
                let outerDiv = document.createElement('div');
                outerDiv.className = 'comments-container';
                console.log(replies_data[i])
                // Create the body div element
                let bodyDiv = document.createElement('div');
                bodyDiv.className = 'body';
            
                // Create the authors div element
                let authorsDiv = document.createElement('div');
                authorsDiv.className = 'authors';
            
                // Create the username div element
                let usernameDiv = document.createElement('div');
                usernameDiv.className = 'username';
            
                // Create the a element and set its href and text content
                let aElement = document.createElement('a');
                aElement.href = '';
                let user_details = await getUsername(replies_data[i].user_id);
                aElement.textContent = user_details.data.username;
            
                // Append the a element to the username div
                usernameDiv.appendChild(aElement);
            
                // Create the role div element and set its text content
                let roleDiv = document.createElement('div');
                roleDiv.textContent = "User";
            
                // Create the img element and set its src and alt attributes
                let imgElement = document.createElement('img');
                imgElement.src = 'https://cdn.pixabay.com/photo/2015/11/06/13/27/ninja-1027877_960_720.jpg';
                imgElement.alt = '';
            
                // Create the posts div element and set its text content
                // ****************************************************************
                let postsDiv = document.createElement('div');
                postsDiv.innerHTML = 'Posts: <u>' + 5 + '</u>';
            
                // Create the points div element and set its text content
                let pointsDiv = document.createElement('div');
                pointsDiv.innerHTML = 'Points: <u>' + 10 + '</u>';
            
                // Append the inner div elements to the authors div
                authorsDiv.appendChild(usernameDiv);
                authorsDiv.appendChild(roleDiv);
                authorsDiv.appendChild(imgElement);
                authorsDiv.appendChild(postsDiv);
                authorsDiv.appendChild(pointsDiv);
            
                // Create the content div element and set its text content
                let contentDiv = document.createElement('div');
                contentDiv.className = 'content';
                // contentDiv.innerHTML = replies_data[i].content + '<br><br><div class="comment"></div>' + "<img src='https://neighborly-images-bucket.s3.amazonaws.com/"+replies_data[i].image+"'></img>";
                contentDiv.innerHTML = replies_data[i].content + '<br><br><div class="comment"></div>' + "<img src='https://neighborly-images-bucket.s3.amazonaws.com/"+replies_data[i].image+"'></img>";
                
                // like button
                let likeDiv = document.createElement('button')
                likeDiv.setAttribute("id", "like");
                // setAttributes(likeDiv, {'id':'like', 'onclick':'liked()'})
                // likeDiv.setAttribute("onclick","liked()");
                likeDiv.innerHTML = "<i class='fa fa-thumbs-up'></i><span class='icon'>Like</span>";
                
                
                // Append the authors and content div elements to the body div
                bodyDiv.appendChild(authorsDiv);
                bodyDiv.appendChild(contentDiv);
                bodyDiv.appendChild(likeDiv)
            
                // Append the body div element to the outer div
                outerDiv.appendChild(bodyDiv);
            
                // Append the outer div element to the DOM
                document.body.appendChild(outerDiv);

                // Append the outer div element to the
                parent_div.appendChild(outerDiv)


              }
        }).catch(function(result){
            console.log("ERR",result);
        });
        // console.log(data)
    }
    catch(err){
        console.log(err)
    }

    // try{
    //     apigClient.recommendUserIdGet(params, body={}, additionalParams={}).then(function(result){
    //         console.log(result);
    //     }).catch(function(result){
    //         console.log("ERR",result);
    //     });
    //     // console.log(data)
    // }
    // catch(err){
    //     console.log(err)
    // }
}

// ############################################################

// let access_token = localStorage.getItem('access_token');

// var additionalParams = {
//     //If there are any unmodeled query parameters or headers that need to be sent with the request you can add them here
//     headers: {
//         "Authorization": access_token
//     }
// };


// var body = {
//     "post_ids":["1","2","3","4","5"]
// };


// try{
//     apigClient.getUserPostsPost(params= {}, body, additionalParams).then(function(result){
//         console.log(result);
//     }).catch(function(result){
//         console.log("ERR",result);
//     });
//     // console.log(data)
// }
// catch(err){
//     console.log(err)
// }

// *********************************



// ############################################################



function hideIconBar(){
    var iconBar = document.getElementById("iconBar");
    var navigation = document.getElementById("navigation");
    iconBar.setAttribute("style", "display:none;");
    navigation.classList.remove("hide");
}

function showIconBar(){
    var iconBar = document.getElementById("iconBar");
    var navigation = document.getElementById("navigation");
    iconBar.setAttribute("style", "display:block;");
    navigation.classList.add("hide");
}

//Comment
function showComment(){
    var commentArea = document.getElementById("comment-area");
    commentArea.classList.remove("hide");
}

//Reply
function showReply(){
    var replyArea = document.getElementById("reply-area");
    replyArea.classList.remove("hide");
}




