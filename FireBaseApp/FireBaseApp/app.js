
var favMovies = new Firebase('https://rmovies.firebaseio.com/movies');
function saveToList(event) {
    if (event.which == 13 || event.keyCode == 13) { // as the user presses the enter key, we will attempt to save the data
        var movieName = document.getElementById('movieName').value.trim();
        var directorName = document.getElementById('movieDirector').value.trim();
        if (movieName.length > 0) {
            saveToFB(movieName,directorName);
        }
       
        document.getElementById('movieName').value = '';
        document.getElementById('movieDirector').value = '';
        return false;
    }
};
function saveToFB(movieName,movieDirector) {
    // this will save data to Firebase
    favMovies.push({
        name: movieName,
        directorName: movieDirector
    });
};
function refreshUI(list) {
    var lis = '';
    for (var i = 0; i < list.length; i++) {
        lis += '<li data-key="' + list[i].key + '">' + list[i].name + '</li>';
    };
    document.getElementById('favMovies').innerHTML = lis;
};

function CreateUser() {

   
    favMovies.createUser({
        email: "rahultiwari95@gmail.com",
        password: "appleme"
    }, function (error, userData) {
        if (error) {
            console.log("Error creating user:", error);
        } else {
            console.log("Successfully created user account with uid:", userData.uid);
        }
    });

}
// this will get fired on inital load as well as when ever there is a change in the data
favMovies.on("value", function (snapshot) {
    var data = snapshot.val();
    var list = [];
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            name = data[key].name ? data[key].name : '';
            if (name.trim().length > 0) {
                list.push({
                    name: name,
                    key: key
                })
            }
        }
    }
    // refresh the UI
    refreshUI(list);
});