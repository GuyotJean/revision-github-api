import React from 'react';
import SearchZone from './SearchZone';
import Result from './Result';
import ChangePage from './ChangePage'
import UserInfo from './UserInfo'
import './App.css';
import tokenApi from './Token.js'; 

//const tokenApi = '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';

console.log(tokenApi);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue : '',
            className: 'searchButton',
            isLoaded : false,
            userList : [],
            userInfos : {},
            deposInfos : [],
            arrayOfId : [0],
            startLoading : false,
            userSelected : false,
            numberReposPages : [1,1],
            reposUrl : '',
            searchingOn : false,
            numberPageResult : [],
            arrayCssClass : Array(12).fill('lastDiv'),
            mouseHover : false,
            isButtonUserNextClicked  : false, 
            isButtonUserPrevClicked : false,    
        }
    }

    componentDidMount() {
        //console.log("didMount");
        const arrayOfId = this.state.arrayOfId;
        fetch('https://api.github.com/users?since=' + arrayOfId[arrayOfId.length -1] + '&per_page=12',{
            method: "GET",
            headers : {
                Authorization : 'token ' + tokenApi
            }
        })
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    userList: result,
                });
            }
        ) 
    }

    componentDidUpdate() {
        const arrayOfId = this.state.arrayOfId;
        //console.log('didUpdate');
        if ((this.state.startLoading === true || this.state.userInfos === []) && !this.state.searchingOn) {
            //console.log('1');
            fetch('https://api.github.com/users?since=' + arrayOfId[arrayOfId.length -1] + '&per_page=12',{
                method: "GET",
                headers : {
                    Authorization : 'token ' + tokenApi
                }
            })
            .then(res => res.json())
            .then(
                 (result) => {
                     this.setState({
                          isLoaded: true,
                          userList: result,
                          startLoading: false,
                      });
                 }
           )
        }

        if (this.state.userInfos.avatar != undefined && this.state.startLoading) {
            //console.log('2');
            this.setState({
                userSelected: true,
                startLoading: false

            })
        }

        //Tentative de gérer les class CSS des bouttons pour afficher les repos dans le profil d'utilisateurs

        let reposPage = this.state.numberReposPages.slice();
        let buttonUserReposPrevClass = this.state.buttonUserReposPrevClass;
        let buttonUserReposNextClass = this.state.buttonUserReposNextClass;

        if (reposPage[0] === 1 ) {
            buttonUserReposPrevClass = 'buttonRepo cantClick'
        }

        if (reposPage[0] === reposPage[1]) {
            buttonUserReposNextClass = 'buttonRepo cantClick'
        }

        /*this.setState({
            reposPage : reposPage,
            buttonUserReposPrevClass : buttonUserReposPrevClass,
            buttonUserReposNextClass : buttonUserReposNextClass,
        })*/

    }

    nextPage() {

        const arrayOfId = this.state.arrayOfId;
        let arrayMaxPages = this.state.numberPageResult.slice()
        const search = this.state.searchValue;
        let usersTab = [];
        //PAGES AVEC UTILISATEURS DE BASE
        if (this.state.searchingOn === false) {
            fetch('https://api.github.com/users?since=' + arrayOfId[arrayOfId.length -1] + '&per_page=12',{
                method: "GET",
                headers : {
                    Authorization : 'token ' + tokenApi
                }
            })
        .then(res => {    
            return res.headers.get('link');
        }).then( result => {
            //console.log('lol');
            this.setState({
                arrayOfId : arrayOfId.concat(result.slice(result.indexOf('=') + 1,result.indexOf('&'))),
                startLoading: true,
            })
        })
        //PAGES AVEC UTILISATEURS RECHERCHES
        } else if ((this.state.searchingOn === true && arrayMaxPages[0] < arrayMaxPages[1]) && arrayMaxPages){
          arrayMaxPages[0]++
          fetch('https://api.github.com/search/users?per_page=12&page=' + arrayMaxPages[0] + '&q=' + search,{
            method: "GET",
            headers : {
                Authorization : 'token ' + tokenApi
                }
            })
            .then(res => res.json())
            .then( result => {
                usersTab = result.items;
                //console.log(arrayMaxPages);
                this.setState({
                    userList : usersTab,
                    numberPageResult : arrayMaxPages
                })

            })  
        }
    }

    previousPage() {
        const arrayOfId = this.state.arrayOfId;
        let arrayMaxPages = this.state.numberPageResult.slice()
        const search = this.state.searchValue;
        let usersTab = [];

        if (arrayOfId.length > 1) {
            arrayOfId.pop()
        }
        if (this.state.searchValue === '') {
            this.setState({
                arrayOfId : arrayOfId,
                startLoading : true,
            })
        }

        if ((this.state.searchingOn === true && 1 < arrayMaxPages[0]) && arrayMaxPages) {
            arrayMaxPages[0]--
            fetch('https://api.github.com/search/users?per_page=12&page=' + arrayMaxPages[0] + '&q=' + search,{
              method: "GET",
              headers : {
                  Authorization : 'token ' + tokenApi
                  }
                })
              .then(res => res.json())
              .then( result => {
                  usersTab = result.items;
                  //console.log(arrayMaxPages);
                  this.setState({
                      userList : usersTab,
                      numberPageResult : arrayMaxPages
                })
  
            })  
        }
        
    }
    
    changeInputValue(e) {
        
        let searchValue = e.target.value.split(' ').join('');

        this.setState({
            searchValue : searchValue
        })
    }

    searchResult(e) {
        let userList = this.state.userList.slice();
        let search = this.state.searchValue;
        e.preventDefault();
        if(!Boolean(search)) {
            this.setState({
                searchingOn: false,
                startLoading : true,
                arrayOfId : [0],
                numberPageResult: []
            })
        } else {
            this.setState({
                searchingOn: true,
                arrayOfId : [1]
            })
        }
        if (Boolean(search)) {
            userList.splice(0, userList.length)
            fetch('https://api.github.com/search/users?per_page=12&page=1&q=' + search,{
                method: "GET",
                headers : {
                    Authorization : 'token ' + tokenApi
                }
            })
            .then(res => {    
                if (res.headers.get('link')) {

                    let headersData = res.headers.get('link');
                    let numberPageResult = [1];

                    numberPageResult[1] = Number(headersData.slice(headersData.lastIndexOf('page') +5, headersData.lastIndexOf('&')));
                    this.setState({
                        numberPageResult : numberPageResult
                    })

                } else {
                    let numberPageResult = [1,1];
                    this.setState({
                        numberPageResult : numberPageResult
                    })
                }
                return res.json()
            })
            .then((data) => {
                userList =  data
                this.setState({
                    userList: data.items
                })     
            })
        }
        this.returnPage()
    }

    mouseDown() {
        this.setState({
            className : 'searchButtonClicked'
        })
        
    }

    mouseUp() {
        this.setState({
            className : 'searchButton'
        })
    }

    returnPage() {
        this.setState({
            userSelected: false,
            userInfos : {},
            numberReposPages: [1,1],
            reposUrl : ''
        })
    }

    //A delete
    selectUser(index) {
        this.getUserInfo(index)
    }

    getUserInfo(index) {
        const arrayUser = this.state.userList;
        const userName = arrayUser[index];
        let userInfos = {};
        let userInfosDepos = [];
        let userInfosOrgs = [];

        this.setState({
            reposUrl : this.state.userList[index].repos_url
        })

        userInfos.avatar = userName.avatar_url; 
        userInfos.html_url = userName.html_url;
        userInfos.login = userName.login

        //FETCH LES ORGS
        //console.log(arrayUser[index].organizations_url);
        fetch(userName.organizations_url,{
            method: "GET",
            headers : {
                Authorization : 'token ' + tokenApi
            }
        })
        .then(res => res.json())
        .then(
            (result => {
                result.forEach((element) => {
                    userInfosOrgs.push({
                        avatarOrgs : element.avatar_url,
                        description : element.description,
                        login : element.login,
                        url : element.url
                    })
                })
                userInfos.list_orgs = userInfosOrgs;
                this.setState({
                    userInfos : userInfos,
                    startLoading : true
                })
            })
        )
            
        
        //FETCH LES REPOS
        fetch(userName.repos_url + '?per_page=6&page=' + this.state.numberReposPages[0],{
            method: "GET",
            headers : {
                Authorization : 'token ' + tokenApi
            }
        })
        .then(res => {    
            if (res.headers.get('link')) {
                
                let arrayReposMax = [this.state.numberReposPages[0],null]
                let headersData = res.headers.get('link')

                
                headersData = headersData.slice(headersData.indexOf('&page=', headersData.indexOf(',')))
                arrayReposMax[1] = Number(headersData.slice(headersData.indexOf('=') + 1,headersData.indexOf('>'))) 
                this.setState({
                    numberReposPages : arrayReposMax,
                })
            }
            return res.json()
        })
        .then(
            (result) => {
                result.forEach((element) => {
                    userInfosDepos.push({
                        name : element.name,
                        description : element.description,
                        size : element.size,
                        language : element.language

                    })
                })
                this.setState({
                    userInfos : userInfos,
                    startLoading : true
                })
            }
        )
        userInfos.depos = userInfosDepos;

        //FETCH LES INFOS PERSOS USERS

        fetch(userName.url,{
            method: "GET",
            headers : {
                Authorization : 'token ' + tokenApi
            }
        })
        .then(res => res.json())
        .then(
            (result) => {
                userInfos.following = result.following
                userInfos.followers = result.followers; 
                userInfos.twitter = result.twitter_username;
                userInfos.location = result.location;
                userInfos.bio = result.bio;
                userInfos.name = result.name;
                this.setState({
                    userInfos : userInfos,
                    startLoading : true
                })
                return userInfos;
            }
        )
        
        
    }

    /*Fonction doit changer de nom normalement*/
    previousDepos() {
        /*Partie des changements des pages*/
        let arrayDeposPages = this.state.numberReposPages.slice();
        let newUserArray = [];
        if(arrayDeposPages[0] > 1){
            arrayDeposPages[0]--
            fetch(this.state.reposUrl + '?per_page=6&page=' + arrayDeposPages[0],{
                method: "GET",
                headers : {
                    Authorization : 'token ' + tokenApi
                }
            })
            .then(res => res.json())
            .then(
                (result) => {
                    result.forEach((element) => {
                        newUserArray.push({
                            name : element.name,
                            description : element.description,
                            size : element.size,
                            language : element.language
    
                        })
                    })

                    this.setState({
                        userInfos : {
                            ...this.state.userInfos,
                            depos : newUserArray},
                            numberReposPages : arrayDeposPages
                    })
                }
            )
        }

        /*Partie pour les actualisations des bouttons
        let buttonCssClass = this.state.buttonUserReposPrevClass;
        if (this.props.numberReposPages[0] === 1 ) {
            buttonPrevClass = 'buttonRepo cantClick'
        }*/

    }

    /*Click sur le boutton pour charger les repos sur la page des utilisateurs*/
    nextDepos(){
        let arrayDeposPages = this.state.numberReposPages.slice();
        let newUserArray = [];

        
        if(arrayDeposPages[0] < arrayDeposPages[1]){
            arrayDeposPages[0]++
            //console.log(this.state.reposUrl + '?per_page=12&page=' + arrayDeposPages[0])
            fetch(this.state.reposUrl + '?per_page=6&page=' + arrayDeposPages[0],{
                method: "GET",
                headers : {
                    Authorization : 'token ' + tokenApi
                }
            })
            .then(res => res.json())
            .then(
                (result) => {
                    result.forEach((element) => {
                        newUserArray.push({
                            name : element.name,
                            description : element.description,
                            size : element.size,
                            language : element.language
    
                        })
                    })

                    this.setState({
                        userInfos : {
                            ...this.state.userInfos,
                            depos : newUserArray},
                            numberReposPages : arrayDeposPages
                    })
                }
            )
        }

    }
    
    /*Animations du boutton UserInfosNext quand le clic est pressé*/
    onMouseDownNextUserInfo() {

       this.setState({
        isButtonUserNextClicked : true,
       })

       this.nextDepos();
    }

    onMouseDownPrevUserInfo() {

        this.setState({
            isButtonUserPrevClicked : true,
        })

        this.previousDepos();
    }

    /*Animations s'enlève quand le clic est terminé dans UserInfo*/
    onMouseUpUserInfo() {
        this.setState({
            isButtonUserNextClicked : false,
            isButtonUserPrevClicked : false,
           })
    }


    render() {
        const isUserSelected = this.state.userSelected;
         return <div
                className='container'>
            <SearchZone
                searchResult={(e) => this.searchResult(e)}
                changeInputValue={(e) => this.changeInputValue(e)}
                className={this.state.className}
                classSearchBar={this.state.classSearchBar}
                mouseDown={() => this.mouseDown()}
                mouseUp={() => this.mouseUp()}
             />

            {isUserSelected
            ? <UserInfo
                returnPage = {() => this.returnPage()}
                userInfos = {this.state.userInfos}
                previousDepos = {() => this.previousDepos()}
                nextDepos = {() => this.nextDepos()}
                numberReposPages = {this.state.numberReposPages}
                onMouseDownNextUserInfo = {() => this.onMouseDownNextUserInfo()}
                onMouseDownPrevUserInfo = {() => this.onMouseDownPrevUserInfo()}
                onMouseUpUserInfo = {() => this.onMouseUpUserInfo()}
                isButtonNextClicked = {this.state.isButtonUserNextClicked}
                isButtonPrevClicked = {this.state.isButtonUserPrevClicked}

            />
            : <Result 
                valueResult = {this.state.searchValue}
                usersList = {this.state.userList}
                selectUser = {index => this.selectUser(index)}
                mouseOverImg = {index => this.mouseOverImg(index)}
                mouseOutImg = {index => this.mouseOutImg(index)}
                arrayCssClass = {this.state.arrayCssClass}
            />
            }

            {!isUserSelected &&
                <ChangePage
                nextPage = {() => this.nextPage()}
                previousPage = {() => this.previousPage()}
                arrayOfId = {this.state.arrayOfId}
                numberPageResult = {this.state.numberPageResult}
             />
                
            }
         </div> 
    }
}


export default App;