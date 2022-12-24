//NavBar
console.log("Hesdafaewrf")

let apigClient = apigClientFactory.newClient();


var idToken = null;

function checkLogin() {
    if (localStorage.hasOwnProperty('access_token')){
        let token_details = parseJwt(localStorage.getItem("login_token"))
        document.getElementById("welcomeMsg").innerHTML = "Signed in";
        // document.getElementById("log_but").style.display = "none"
        get_recommend_posts()
    }
    // console.log("Inside Login")
    // var url_string = window.location;
    // var url = new URL(url_string);
    // console.log(url)
    // hash = url.hash
    // tokens = hash.split("&")
    // let idToken = tokens[0].slice(10)
    // let access_token = tokens[1].slice(13)

    // if (idToken != null) {
    //     console.log("Inside Idtoken")
    //     document.getElementById("welcomeMsg").innerHTML = "signed in";
    //     // auth();
    //     localStorage.setItem("login_token",idToken);
    //     localStorage.setItem("access_token",access_token);
    //     get_recommend_posts()
        // getUsername(103)
    // }


}


function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

// ****************************************

function search(){
    let search_text = document.getElementsByName('q')[0].value;
    table_rows = document.getElementsByClassName('table-row');
    for(let i = 0; i< table_rows.length; i++){
        table_rows[i].style.display = 'none';
    }
    get_search_posts(search_text);


}





// ****************************************


async function submit_data(){
    
    let comment_data = document.getElementById('myComment').value;
    let access_token = localStorage.getItem('access_token')
    // submitPhoto()
    let token_details = parseJwt(localStorage.getItem("login_token"))
    let user_details = await getUsername(token_details['email'])
    var m = new Date();
    var dateString = m.getUTCFullYear() +"-"+ (m.getUTCMonth()+1) +"-"+ m.getUTCDate() + " " + m.getUTCHours() + ":" + m.getUTCMinutes() + ":" + m.getUTCSeconds();
    body={
        'author':user_details.data['id'],
        'content': comment_data,
        'image':"" ,
        'tag':"food",
        'likes':0,
        'timestamp':dateString
    }
    var params = {
        // "postId": localStorage.getItem("post_id"),
        "Authorization": "Bearer " + access_token
    }
    try{
        apigClient.userPostPost(params, body, additionalParams={}).then(function(result){
            console.log(result);
        }).catch(function(result){
            console.log("ERR",result);
        });
        // console.log(data)
    }
    catch(err){
        console.log(err)
    }
    // localStorage.setItem("image_name_base","black.jpeg");
    location.reload();


}







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


// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
// Search

async function get_search_posts(search_text){
    let userId = localStorage.getItem('login_token');
    let access_token = localStorage.getItem('access_token');
    console.log("))))))))))))",userId)
    console.log(access_token)
    var params = {
        "keyword": search_text,
        "Authorization": "Bearer " + access_token
    }
        //This is where any header, path, or querystring request params go. The key is the parameter named as defined in the API
        

    var additionalParams = {
        
        // "Authorization": "Bearer " + access_token
        
        //If there are any unmodeled query parameters or headers that need to be sent with the request you can add them here
        
        
    };
    try{
        apigClient.searchKeywordGet(params, body={}, additionalParams={}).then(async function(result){
            console.log(result);
            let posts_data = result.data
            let parent_div = document.getElementsByClassName("posts-table")[0]
            for (var i = 0; i < posts_data.length; i++) {
                // var reply = posts_data[i];
                // var mdiv = document.createElement('div');
                // mdiv.className = "table-row";
                // mdiv.innerHTML ="<div class='status'><i class='fa fa-fire'></i></div>";
                // let sdiv = document.createElement('div').classList.add('subjects');
                // let adiv = document.createElement('a');
                // adiv.href = ""
                // adiv.innerHTML = i.content
                // linebreak = document.createElement("br");
                // mdiv.appendChild(linebreak);
                // sspan = document.createElement('span').appendChild(document.createTextNode("Started by "))
                // sadiv = 
                // div.innerHTML = '<p>' + reply.content + '</p>';
                // document.getElementById('Posts').appendChild(div);



                // Create the outer div element
                let outerDiv = document.createElement('div');
                outerDiv.className = 'table-row';
                outerDiv.className+= ' search-result';

                // Create the first inner div element
                let statusDiv = document.createElement('div');
                statusDiv.className = 'status';

                // Create the i element and set its class
                let iElement = document.createElement('i');
                iElement.className = 'fa fa-fire';

                // Append the i element to the first inner div
                statusDiv.appendChild(iElement);

                // Create the second inner div element
                let subjectsDiv = document.createElement('div');
                subjectsDiv.className = 'subjects';

                // Create the a element and set its href and text content
                let aElement = document.createElement('a');
                aElement.href = 'https://app.neighborly.ml/detail.html?post_id='+posts_data[i].id;
                aElement.textContent = posts_data[i].content;

                // Append the a element to the second inner div
                subjectsDiv.appendChild(aElement);

                // Create the br element and append it to the second inner div
                let brElement = document.createElement('br');
                subjectsDiv.appendChild(brElement);

                // Create the span element and set its text content
                let spanElement = document.createElement('span');
                spanElement.textContent = 'Started by ';
                console.log(posts_data[i],posts_data[i].author)


                user_details = await getUsername(posts_data[i].author);
                console.log(user_details)
                // Create the b element and set its text content
                let bElement = document.createElement('b');
                bElement.textContent =  user_details.data.username;

                // Create the second a element and set its href
                let aElement2 = document.createElement('a');
                aElement2.href = '';

                // Append the second a element to the b element, and append the b element to the span element
                bElement.appendChild(aElement2);
                spanElement.appendChild(bElement);

                // Append the span element to the second inner div
                subjectsDiv.appendChild(spanElement);

                // Create the third inner div element and set its text content
                let repliesDiv = document.createElement('div');
                repliesDiv.className = 'replies';
                repliesDiv.textContent = '2 replies \n 125 views';

                // Create the fourth inner div element
                let lastReplyDiv = document.createElement('div');
                lastReplyDiv.className = 'last-reply';

                // Set the text content of the fourth inner div
                lastReplyDiv.textContent = posts_data[i].timestamp+'\n';

                // Create the second b element and set its text content
                let bElement2 = document.createElement('b');
                bElement2.textContent = user_details.data.username;

                // Create the third a element and set its href
                let aElement3 = document.createElement('a');
                aElement3.href = '';

                // Append the third a element to the second b element, and append the second b element to the fourth inner div
                bElement2.appendChild(aElement3);
                lastReplyDiv.appendChild(bElement2);

                // Append the inner div elements to the outer div element
                outerDiv.appendChild(statusDiv);
                outerDiv.appendChild(subjectsDiv);
                outerDiv.appendChild(repliesDiv);
                outerDiv.appendChild(lastReplyDiv);

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






async function get_recommend_posts(){
    let userId = localStorage.getItem('login_token');
    let access_token = localStorage.getItem('access_token');
    console.log("))))))))))))",userId)
    console.log(access_token)
    var params = {
        "userId": userId,
        "Authorization": "Bearer " + access_token
    }
        //This is where any header, path, or querystring request params go. The key is the parameter named as defined in the API
        

    var additionalParams = {
        
        // "Authorization": "Bearer " + access_token
        
        //If there are any unmodeled query parameters or headers that need to be sent with the request you can add them here
        
        
    };
    try{
        apigClient.recommendUserIdGet(params, body={}, additionalParams={}).then(async function(result){
            console.log(result);
            let posts_data = result.data
            let parent_div = document.getElementsByClassName("posts-table")[0]
            for (var i = 0; i < posts_data.length; i++) {
                // var reply = posts_data[i];
                // var mdiv = document.createElement('div');
                // mdiv.className = "table-row";
                // mdiv.innerHTML ="<div class='status'><i class='fa fa-fire'></i></div>";
                // let sdiv = document.createElement('div').classList.add('subjects');
                // let adiv = document.createElement('a');
                // adiv.href = ""
                // adiv.innerHTML = i.content
                // linebreak = document.createElement("br");
                // mdiv.appendChild(linebreak);
                // sspan = document.createElement('span').appendChild(document.createTextNode("Started by "))
                // sadiv = 
                // div.innerHTML = '<p>' + reply.content + '</p>';
                // document.getElementById('Posts').appendChild(div);



                // Create the outer div element
                let outerDiv = document.createElement('div');
                outerDiv.className = 'table-row';

                // Create the first inner div element
                let statusDiv = document.createElement('div');
                statusDiv.className = 'status';

                // Create the i element and set its class
                let iElement = document.createElement('i');
                iElement.className = 'fa fa-fire';

                // Append the i element to the first inner div
                statusDiv.appendChild(iElement);

                // Create the second inner div element
                let subjectsDiv = document.createElement('div');
                subjectsDiv.className = 'subjects';

                // Create the a element and set its href and text content
                let aElement = document.createElement('a');
                aElement.href = 'https://app.neighborly.ml/detail.html?post_id='+posts_data[i].id;
                aElement.textContent = posts_data[i].content;

                // Append the a element to the second inner div
                subjectsDiv.appendChild(aElement);

                // Create the br element and append it to the second inner div
                let brElement = document.createElement('br');
                subjectsDiv.appendChild(brElement);

                // Create the span element and set its text content
                let spanElement = document.createElement('span');
                spanElement.textContent = 'Started by ';
                console.log(posts_data[i],posts_data[i].author)


                user_details = await getUsername(posts_data[i].author);
                console.log(user_details)
                // Create the b element and set its text content
                let bElement = document.createElement('b');
                bElement.textContent =  user_details.data.username;

                // Create the second a element and set its href
                let aElement2 = document.createElement('a');
                aElement2.href = '';

                // Append the second a element to the b element, and append the b element to the span element
                bElement.appendChild(aElement2);
                spanElement.appendChild(bElement);

                // Append the span element to the second inner div
                subjectsDiv.appendChild(spanElement);

                // Create the third inner div element and set its text content
                let repliesDiv = document.createElement('div');
                repliesDiv.className = 'replies';
                repliesDiv.textContent = '2 replies \n 125 views';

                // Create the fourth inner div element
                let lastReplyDiv = document.createElement('div');
                lastReplyDiv.className = 'last-reply';

                // Set the text content of the fourth inner div
                lastReplyDiv.textContent = posts_data[i].timestamp+'\n';

                // Create the second b element and set its text content
                let bElement2 = document.createElement('b');
                bElement2.textContent = user_details.data.username;

                // Create the third a element and set its href
                let aElement3 = document.createElement('a');
                aElement3.href = '';

                // Append the third a element to the second b element, and append the second b element to the fourth inner div
                bElement2.appendChild(aElement3);
                lastReplyDiv.appendChild(bElement2);

                // Append the inner div elements to the outer div element
                outerDiv.appendChild(statusDiv);
                outerDiv.appendChild(subjectsDiv);
                outerDiv.appendChild(repliesDiv);
                outerDiv.appendChild(lastReplyDiv);

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




