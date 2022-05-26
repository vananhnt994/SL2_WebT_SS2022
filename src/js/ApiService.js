class ApiService {
    currentData = []

    //eigene Variablen
    apiUrl  =   'https://web-t.l0e.de/tl2/news'
    loadArtFrom = 0 
    loadArtTo   = 10
 
    async getAllTags() {
        return this.fetchAsync('/tags')
    }

    async getAllNews() {
        return this.fetchAsync('/')
    }

    async getNewsByTag(tag) {
        return this.fetchAsync('/tag/'+tag)
    }

    // ... hier folgen die Sortierfunktionen...
    sortNewsByOptDesc(arr, opt){
        arr.sort(function (a, b) {
            return b[opt].localeCompare(a[opt]);
        });
        return arr;
    }

    // eigene Methoden
    async fetchAsync (endpoint) {
        const url = this.apiUrl + endpoint

            return fetch(url)
                .then(response => 
                        response.json().then(data => ({
                            data: data,
                            status: response.status
                        })
                    ).then(res => {
                        if (res.status !== 200) {
                            throw new Error(`${res.status}: Bitte prüfen Sie ob die angeforderte Ressource unter ${url} zur Verfügung steht` )
                        } else {
                            if(typeof res.data['content'] === undefined) {
                                throw new Error(`Request erfolgreich, aber keine Daten erhalten.` )
                            } else {
                                if(res.data['content'].length === 0) {
                                    throw new Error(`Daten erhalten, aber der Inhalt ist leer.` )
                                } else {
                                    this.hideLoadingIndicator()
                                    return res.data['content']
                                }
                            }
                            
                        }         
                    })
                    .catch((error) => {
                        this.hideLoadingIndicator()
                        this.showError(error)
                    })
                ).catch((error) => {
                    this.hideLoadingIndicator()
                    this.showError(`${error}<br>Überprüfen Sie Ihre Netzwerkverbindung.`)
                }); 
    }

    async getData(tag){

        //blende Ladeindikator ein
        apiService.loadingIndicator()
    
        //ohne Parameter oder bei Kategorie "Keine" laden aller News
        if(tag === null || tag === 'none' || tag === undefined) {
            apiService.currentData['news'] = await apiService.getAllNews()   
        } else {
            apiService.currentData['news'] = await apiService.getNewsByTag(tag)
        }
    
        //sort and append news
        apiService.appendNews(apiService.sortNewsByOptDesc(apiService.currentData['news'], document.getElementById('sort').value))
    
        //Kategorien nur einmal initial laden und ablegen
        if (typeof apiService.currentData['tags'] === "undefined"){
            apiService.currentData['tags'] = await apiService.getAllTags()
            apiService.appendTagsToSelect(apiService.currentData['tags'])
        }
    }

    appendNews(arr){    
 
        //wenn die Zahl der zu ladenden Artikel das Array übersteigt, setze zurück auf Array.length
        if (this.loadArtTo > arr.length) {
            this.loadArtTo = arr.length

            //blende den Link zum laden weiterer Artikel aus
            document.getElementById('loadArticleLink').style = "display:none"
        }

        //gehe durch jeden Artikel und generiere HTML    
        for (var i = this.loadArtFrom; i < this.loadArtTo; i++) {
            let html = `<article><h3>${arr[i].title}</h3><span>${arr[i].tag} | ${arr[i].time}</span><p>${arr[i].text}</p><a href="${arr[i].url}" target="_blank">Artikel lesen...</a></article>`
            let elem = document.querySelector('#news')
            elem.innerHTML = elem.innerHTML + html
        }
    }

    clearNews() {
        document.getElementById('news').innerHTML= ''
    }

    appendTagsToSelect(arr) {
        //Hänge die Kategorien an das Dropdown
        for (var i = 0; i < arr.length; i++) {
            let html = `<option value="${arr[i]}">${arr[i]}</option>`
            let elem = document.querySelector('#cat')
            elem.innerHTML = elem.innerHTML + html
        }
    }

    loadingIndicator(){
        document.getElementById('loading').style = "display:block"
        document.getElementById('loadArticle').style = "display:none"
    }

    hideLoadingIndicator(){
        document.getElementById('loading').style = "display:none"
        document.getElementById('loadArticle').style = "display:block"
    }

    showError(msg){
        document.getElementById('loading').style = "display:block"
        document.getElementById('loadArticle').style = "display:none"
        document.getElementById('loading').innerHTML = msg
    }
}
