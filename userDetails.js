//NavBar
console.log("Hesdafaewrf")

let apigClient = apigClientFactory.newClient();


var idToken = null;

async function checkLogin() {
    if (localStorage.hasOwnProperty('access_token')){
        var url_string = window.location;
        var url = new URL(url_string);
        console.log(url)
        hash = url.hash
        tokens = hash.split("&")
        let idToken = tokens[0].slice(10)
        let access_token = tokens[1].slice(13)

        localStorage.setItem("login_token",idToken);
        localStorage.setItem("access_token",access_token);
        let token_details = parseJwt(localStorage.getItem("login_token"))
        let user_details = await getUsername(token_details['email'])
        show_details(user_details)

    }
    else{
        console.log("Inside Login")
        var url_string = window.location;
        var url = new URL(url_string);
        console.log(url)
        hash = url.hash
        tokens = hash.split("&")
        let idToken = tokens[0].slice(10)
        let access_token = tokens[1].slice(13)

        if (idToken != null) {
            console.log("Inside Idtoken")
            
            // auth();
            localStorage.setItem("login_token",idToken);
            localStorage.setItem("access_token",access_token);
            let user_json = parseJwt(idToken)
            let username = user_json['cognito:username']
            document.getElementById("welcomeMsg").innerHTML = "Signed in as "+username;
            let useremail = user_json['email']
            let user_details = create_user(username,useremail)

            // let user_details = getUsername(useremail)
            show_details(user_details)

            // getUsername(103)
        }
    }
    


}

function update_details(){
    let token_details = parseJwt(localStorage.getItem("login_token"))
    let user_details = getUsername(token_details['email'])
    let user_id = user_details['id']

    let access_token = localStorage.getItem('access_token');

    var additionalParams = {

    };

    var body = {
        'username': document.getElementById('username').value,
        'email': document.getElementById('email').value,
        'mobile': document.getElementById('mobileNumber').value,
        'gender': document.getElementById('gender').value,
        'location': document.getElementById('location').value
    }

    var params = {
        'userId': user_id,
        "Authorization": "Bearer " + access_token
    }
    let res = {}
    try{
        // return new Promise(resolve => {
            
        //   });
        apigClient.userUserIdPut(params, body, additionalParams={}).then(function(result){
            console.log("This is create user id resutl: ",result);
            res = result
        }).catch(function(result){
            console.log("THis is create user ERR: ",result);
        });
        // console.log(data)
       
    }
    catch(err){
        console.log("**********")
        console.log(err)
    }
    location.href = "https://app.neighborly.ml/posts.html"

    
}

function create_user(username, useremail){
    let access_token = localStorage.getItem('access_token');

    var additionalParams = {

    };

    var body = {
        'username': username,
        'email': useremail,
        'mobile': 123456789,
        'gender': "Male/Female",
        'location': "Manhattan"
    }

    var params = {
        "Authorization": "Bearer " + access_token
    }
    let res = {}
    try{
        // return new Promise(resolve => {
            
        //   });
        apigClient.userPost(params, body, additionalParams={}).then(function(result){
            console.log("This is create user id resutl: ",result);
            res = result
        }).catch(function(result){
            console.log("THis is create user ERR: ",result);
        });
        // console.log(data)
       
    }
    catch(err){
        console.log("**********")
        console.log(err)
    }
    return res;
}

function show_details(user_details){
    console.log("******** user details",user_details)
    document.getElementById('username').value = user_details.data['username']
    document.getElementById('email').value = user_details.data['email']
    document.getElementById('location').value = user_details.data['location']
    document.getElementById('mobileNumber').value = user_details.data['mobile']
    document.getElementById('gender').value = user_details.data['gender']
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




