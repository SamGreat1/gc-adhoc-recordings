// **** Token Implicit Grant (Browser) - UserLogin ****
let redirectUri = 'https://samgreat1.github.io/gc-adhoc-recordings/index.html';
// redirectUri = 'http://localhost:5500/index.html';
const platformClient = require('platformClient');
const client = platformClient.ApiClient.instance;
client.setEnvironment("mypurecloud.ie");
client.setPersistSettings(true);


let apiInstance = new platformClient.ConversationsApi();
let recordingsApiInstance = new platformClient.UserRecordingsApi();

let myParams = {
    conversationId: getUrlVars()['conversationId'],
    participantId: getUrlVars()['participantId'],
    remoteNumber: getUrlVars()['remoteNumber'],    
};


function login(_state) {
    return new Promise(function (resolve, reject) {
        // Authenticate
        client.loginImplicitGrant("1b831a39-844c-4dce-9f7a-2ec29a88ddae", redirectUri , { state: _state })
        .then((data) => {
            // Make request to GET /api/v2/users/me?expand=presence
            console.log('Logged-In');
            console.log(data.state);
            resolve(data.state);
        })
        .catch((err) => {
        // Handle failure response
            console.log(err);
            reject();
        });

        //#endregion

    });
}


client.loginImplicitGrant("1b831a39-844c-4dce-9f7a-2ec29a88ddae", redirectUri, { state: myParams })
.then((data) => {
    // Make request to GET /api/v2/users/me?expand=presence
    console.log('Logged-In v3'); 
    if (data?.state?.conversationId) {
        myParams = data.state;
        document.getElementById("send").disabled = false;
        document.getElementById("cancel").disabled = true;
        document.getElementById("save").disabled = true;
    };      
    console.log(myParams); 
})
.catch((err) => {
// Handle failure response
    console.log(err);    
});



function triggerRecording(isRecording) {
    console.log(`Setting recording to ${isRecording} for conversation:${myParams.conversationId}, participant: ${myParams.participantId}`);

    return new Promise(function (resolve, reject) {
        
        let body = {
            "recording": isRecording           
         }
        
        apiInstance.patchConversationsChatParticipant(myParams.conversationId, myParams.participantId, body)
        .then((data) => {
            console.log(`patchConversationsChatParticipant success! data: ${JSON.stringify(data, null, 2)}`);
            localStorage.setItem('participantId', myParams.participantId);

            document.getElementById("send").disabled = isRecording;
            document.getElementById("cancel").disabled = !isRecording;
            document.getElementById("save").disabled = isRecording;
            resolve();

    
        })
        .catch((err) => {
            console.log('There was a failure calling patchConversationsChatParticipant');
            console.error(err);

            document.getElementById("send").disabled = !isRecording;
            document.getElementById("cancel").disabled = isRecording;
            document.getElementById("save").disabled = !isRecording;

            reject("Failed to place a Call");
        });

    });
}

function saveRecording(conversationId) {

    getAllUserRecordings().then(async (recordings) => {         
        let conversationRecordings = recordings.filter(x=>x.conversation.id === myParams.conversationId);
        console.log('Conversation Recordings Found:', conversationRecordings);

        for (let i = 0; i < conversationRecordings.length; i++) {
            let recordingId = conversationRecordings[i].id;
            downloadUserRecording(recordingId).then(async(recordingDownloadResponse)=> {
               
                //save the downloaded recording
                console.log('downloaded recording', recordingDownloadResponse);
                var a = document.createElement("a");
                a.href = recordingDownloadResponse.contentLocationUri;
                a.setAttribute("download", 'recording_download.wav');
                a.click();

                //Delete the user file               
                deleteUserRecording(recordingId);            

                document.getElementById("save").disabled = true;
            })
          }
   
    }).catch((err) => {
        console.error("Failed to call API");                    
        //showMessage(err, true);
    });

  
    
}




function triggerRecording(isRecording) {
    console.log(`Setting recording to ${isRecording} for conversation:${myParams.conversationId}, participant: ${myParams.participantId}`);

    return new Promise(function (resolve, reject) {
        
        let body = {
            "recording": isRecording           
         }

        apiInstance.patchConversationsChatParticipant(myParams.conversationId, myParams.participantId, body)
        .then((data) => {
            console.log(`patchConversationsChatParticipant success! data: ${JSON.stringify(data, null, 2)}`);        
            resolve();
        })
        .catch((err) => {
            console.log('There was a failure calling patchConversationsChatParticipant');
            console.error(err);
            reject("Failed to place a Call");
        });

    });
}

function deleteUserRecording(recordingId) {
    console.log(`Deleting User Recording: ${recordingId}`);

    return new Promise(function (resolve, reject) {      
        recordingsApiInstance.deleteUserrecording(recordingId)
        .then((data) => {
            console.log(`deleteUserRecording success! data: ${JSON.stringify(data, null, 2)}`);        
            resolve(data);
        })
        .catch((err) => {
            console.log('There was a failure calling deleteUserRecording');
            console.error(err);
            reject("Failed to delete user recording");
        });

    });
}

function getAllUserRecordings() {
    console.log(`Getting all user recordings.`);

    let opts = { 
        'pageSize': 25, // Number | Page size
        'pageNumber': 1, // Number | Page number
        'expand': ["expand_example"] // [String] | Which fields, if any, to expand.
      };
      
    return new Promise(function (resolve, reject) {      
        recordingsApiInstance.getUserrecordings(opts)
        .then((data) => {
            console.log(`getUserRecordings success! data: ${JSON.stringify(data, null, 2)}`);        
            resolve(data.entities);
        })
        .catch((err) => {
            console.log('There was a failure calling getUserRecordings');
            console.error(err);
            reject("Failed to place a Call");
        });

    });
}

function downloadUserRecording(recordingId) {
    console.log(`Downloading user recording ${recordingId}`);

    let opts = { 
        'formatId': "WAV" // String | The desired media format.
      };
      
    return new Promise(function (resolve, reject) {      
        recordingsApiInstance.getUserrecordingMedia(recordingId, opts)
        .then((data) => {
            console.log(`downloadUserRecordingMedia success! data: ${JSON.stringify(data, null, 2)}`);        
            resolve(data);
        })
        .catch((err) => {
            console.log('There was a failure calling getUserRecordings');
            console.error(err);
            reject("Failed to place a Call");
        });

    });
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
