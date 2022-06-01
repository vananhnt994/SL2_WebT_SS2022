let apiService = new ApiService()

//initiales laden aller Daten
apiService.getData()

//click Event-Handler für das nachladen von Artikeln
document.getElementById('loadArticleLink').addEventListener('click', function () {
    apiService.loadArtFrom = document.querySelectorAll('article').length;
    apiService.loadArtTo = apiService.loadArtFrom + 10
    apiService.appendNews(apiService.currentData['news'])
});

//change Event-Handler für das laden von Artikeln nach Kategorien
document.getElementById('cat').addEventListener('input', function (event) {
    apiService.loadArtFrom = 0  //reset...
    apiService.loadArtTo = 10   //...counters
    apiService.clearNews() //clear news area
    apiService.getData(event.target.value)
    document.getElementById('loadArticleLink').style = "display:inline" //reset visibility of button
    if(document.getElementById('cat').value != 'none') {
        document.getElementById('tag').style = "display:none"
    } else {
        document.getElementById('tag').style = "display:inline"
    }

});

//change Event-Handler für das Sortieren von Artikeln
document.getElementById('sort').addEventListener('input', function (event) {
    apiService.clearNews() //clear news area
    apiService.loadArtFrom = 0 //set to zero to display all elements
    apiService.appendNews(apiService.sortNewsByOptDesc(apiService.currentData['news'], event.target.value))
});


  
